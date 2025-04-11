import WebSocketService from "@/services/WebSocketService.ts";
import { CookiesDto } from "@/types/auth.ts";

export enum AttachmentType {
  IMAGE = "IMAGE",
  VIDEO = "VIDEO",
  FILE = "FILE",
}

export interface MessageComponent {
  messageId: number;
  senderId: number;
  senderFirstName: string;
  channelId: number;
  messageContent: string;
  attachments: Attachment[];
  sentAt: string;
  type: string;
  avatarUrl: string | undefined;
}

export interface SendMessageComponent {
  senderId: number;
  channelId: number;
  messageContent: string;
  sentAt: string;
  type: string;
  senderFirstName: string;
  avatarUrl: string | null;
}

export interface ChatMessageProps {
  messages: MessageComponent[];
  currentUserId: number;
  activateSkeleton: boolean;
  skeletonId: number;
  skeletonCount: number;
  status: string;
}

export interface Attachment {
  attachmentUrl: string;
  fileType: AttachmentType;
}

export interface LastMessageComponent {
  senderId: number;
  channelId: number;
  messageContent: string;
  type: string;
  hasAttachments: boolean;
}

export interface UserBlockedComponentProps {
  showBlockedMessage: boolean;
  channelIsBlocked: boolean;
  webSocketRef: WebSocketService | null;
  channelId: number;
  channelType: string;
  cookies: CookiesDto;
}

export interface ChatImageDialogProps {
  attachment: Attachment;
}
