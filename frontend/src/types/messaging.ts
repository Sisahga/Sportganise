export interface MessageComponent {
  messageId: number;
  senderId: number;
  senderFirstName: string;
  channelId: number;
  messageContent: string;
  attachments: string[];
  sentAt: string;
  type: string;
  avatarUrl: string;
}

export interface SendMessageComponent {
  senderId: number;
  channelId: number;
  messageContent: string;
  attachments: File[];
  sentAt: string;
  type: string;
  senderFirstName: string;
  avatarUrl: string;
}

export interface ChatMessageProps {
  messages: MessageComponent[];
}

export interface LastMessageComponent {
  senderId: number;
  channelId: number;
  messageContent: string;
  type: string;
}
