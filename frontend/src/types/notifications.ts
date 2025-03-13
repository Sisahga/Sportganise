export interface Notification {
  id: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  sender: string;
}

export interface NotificationRequest {
  title: string;
  body: string;
  topic: string | null;
  recipients: number[]; // Ids of users to notify.
}

export interface StoreFcmTokenDto {
  accountId: number;
  token: string;
}
