import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'

import { connectToDB } from '@/lib/db'
import Profile from '@/lib/models/profile.model'
import { createProfile, deleteProfile } from '@/lib/actions/profile.actions'

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local')
  }

  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400
    })
  }

  // Get the body
  const payload = await req.json()
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occured', {
      status: 400
    })
  }

  if (evt.type === "user.created") {
    try {
      connectToDB();

      const {
        id: userId,
        image_url: imageUrl,
        first_name: firstName,
        last_name: lastName,
        email_addresses
      } = evt.data;

      await createProfile({
        userId,
        firstName,
        lastName,
        imageUrl,
        email: email_addresses[0].email_address
      })

      return new Response("profile created", { status: 200 });
    } catch (error) {
      return new Response(
        "Internal Server Error",
        { status: 500 }
      );
    }
  }

  if (evt.type === "user.updated") {
    try {
      connectToDB();

      const {
        id: userId,
        image_url: imageUrl
      } = evt.data;

      await Profile.updateOne(
        { userId },
        { imageUrl }
      );

      return new Response("update done", { status: 200 });
    } catch (error) {
      return new Response(
        "Internal Server Error",
        { status: 500 }
      );
    }
  }

  if (evt.type === "user.deleted") {
    try {
      connectToDB();

      const { id: userId } = evt.data;

      await deleteProfile(userId as string);

      return new Response("deleted the profile successfully", { status: 200 });
    } catch (error) {
      return new Response(
        "Internal Server Error",
        { status: 500 }
      );
    }
  }

  return new Response('', { status: 200 })
}
