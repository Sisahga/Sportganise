import WebSocketService from "@/services/WebSocketService.ts";

export interface MessageComponent {
  messageId: number;
  senderId: number;
  senderFirstName: string;
  channelId: number;
  messageContent: string;
  attachments: File[];
  sentAt: string;
  type: string;
  avatarUrl: string | undefined;
}

export interface SendMessageComponent {
  senderId: number;
  channelId: number;
  messageContent: string;
  attachments: File[];
  sentAt: string;
  type: string;
  senderFirstName: string;
  avatarUrl: string | null;
}

export interface ChatMessageProps {
  messages: MessageComponent[];
  currentUserId: number;
}

export interface FileAttachment {
  fileName: string;
  fileSize: number;
  fileType: string;
  fileUrl: string;
}

export interface LastMessageComponent {
  senderId: number;
  channelId: number;
  messageContent: string;
  type: string;
}

export interface UserBlockedComponentProps {
  showBlockedMessage: boolean;
  channelIsBlocked: boolean;
  webSocketRef: WebSocketService | null;
  channelId: number;
  channelType: string;
}
