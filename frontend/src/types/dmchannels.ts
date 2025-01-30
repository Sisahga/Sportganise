import React from "react";
import WebSocketService from "@/services/WebSocketService.ts";
import { AccountDetailsDirectMessaging } from "@/types/account.ts";

export enum GroupChannelMemberRole {
  ADMIN = "ADMIN",
  REGULAR = "REGULAR",
}

export interface Channel {
  channelId: number;
  channelName: string;
  channelImageBlob: string;
  channelType: string;
  lastMessage: string | null;
  lastEvent: string | null;
  read: boolean;
}

export interface MessagesSectionProps {
  messageChannels: Channel[];
}

export interface GroupSectionProps {
  groupChannels: Channel[];
}

export interface ChannelItemProps {
  channel: Channel;
  layout?: "horizontal" | "vertical";
  extraInfo?: React.ReactNode; // Holds 'read' and 'lastEvent' info
}

export interface CreateChannelDto {
  channelId: number | null;
  channelName: string;
  channelType: string;
  memberIds: number[];
  createdAt: string | null;
  avatarUrl: string | null;
}

export interface ChatScreenProps {
  channelId: number;
  channelName: string;
  channelImageBlob: string;
  read: boolean;
  channelType: string;
  isBlocked: boolean;
}

export interface ChannelSettingsDropdownProps {
  channelId: number;
  channelType: string;
  webSocketRef: WebSocketService | null;
  isBlocked: boolean | false;
  currentUserId: number;
  channelName: string;
  setCurrentChannelName: React.Dispatch<React.SetStateAction<string>>;
  currentChannelPictureUrl: string;
  setCurrentChannelPictureUrl: React.Dispatch<React.SetStateAction<string>>;
  isDeleteRequestActive: boolean;
}

export interface ChannelMember {
  accountId: number;
  firstName: string;
  lastName: string;
  avatarUrl: string | undefined;
  role: GroupChannelMemberRole | null;
}

export interface MembersSettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  channelMembers: ChannelMember[];
  channelId: number;
  websocketRef: WebSocketService | null;
  currentUserId: number;
}

export interface LeaveGroupDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onLeave: () => void;
}

export interface AddChannelMemberDto {
  channelId: number;
  memberIds: number[];
  adminId: number;
}

export interface AddMembersDialogProps {
  selectedUsers: AccountDetailsDirectMessaging[];
  setSelectedUsers: React.Dispatch<
    React.SetStateAction<AccountDetailsDirectMessaging[]>
  >;
  submitButtonLabel: string;
  createFunction: () => void;
  currentUserId: number;
  excludedMembers: ChannelMember[] | null;
}

export interface RenameGroupDialogProps {
  isOpen: boolean;
  onClose: () => void;
  channelName: string;
  channelId: number;
  setCurrentChannelName: React.Dispatch<React.SetStateAction<string>>;
  currentUserId: number;
  webSocketRef: WebSocketService | null;
}

export interface RenameChannelDto {
  channelId: number;
  channelName: string;
}

export interface ChangePictureDialogProps {
  isOpen: boolean;
  onClose: () => void;
  currentChannelId: number;
  currentChannelPictureUrl: string;
  setCurrentChannelPictureUrl: React.Dispatch<React.SetStateAction<string>>;
  webSocketRef: WebSocketService | null;
  currentUserId: number;
}

export interface UpdateChannelPictureResponse {
  channelImageUrl: string;
}