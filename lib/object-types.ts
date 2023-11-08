export type ProfileObject = {
  _id: string;
  userId: string;
  name: string;
  imageUrl: string;
  email: string;
  servers: string[] | ServerObject[];
  members: string[] | MemberObject[];
  channels: string[] | ChannelObject[];
  createdAt: Date;
  updatedAt: Date;
}

export type ServerObject = {
  _id: string;
  name: string;
  imageUrl: string;
  inviteCode: string;
  profileId: string | ProfileObject;
  members: string[] | MemberObject[];
  channels: string[] | ChannelObject[];
  createdAt: Date;
  updatedAt: Date;
}

export type MemberObject = {
  _id: string;
  role: 'ADMIN' | 'MODERATOR' | 'GUEST';
  profileId: string | ProfileObject;
  serverId: string | ServerObject;
  messages: string[] | MessageObject[];
  directMessages: string[] | DirectMessageObject[];
  conversationsInitiated: string[] | ConversationObject[];
  conversationsReceived: string[] | ConversationObject[];
  createdAt: Date;
  updatedAt: Date;
}

export type ChannelObject = {
  _id: string;
  name: string;
  type: 'TEXT' | 'AUDIO' | 'VIDEO';
  profileId: string | ProfileObject;
  serverId: string | ServerObject;
  messages: string[] | MessageObject[];
  createdAt: Date;
  updatedAt: Date;
}

export type MessageObject = {
  _id: string;
  content: string;
  fileUrl: string;
  memberId: string | MemberObject;
  channelId: string | ChannelObject;
  deleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type ConversationObject = {
  _id: string;
  memberOneId: string | MemberObject;
  memberTwoId: string | MemberObject;
  directMessages: string[] | DirectMessageObject[];
  createdAt: Date;
  updatedAt: Date;
}

export type DirectMessageObject = {
  _id: string;
  content: string;
  fileUrl: string;
  memberId: string | MemberObject;
  conversationId: string | ConversationObject;
  deleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}