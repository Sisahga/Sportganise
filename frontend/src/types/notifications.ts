export enum NotificationMethodEnum {
  PUSH = "PUSH",
  EMAIL = "EMAIL",
}

export enum NotificationTypeEnum {
  TRAINING_SESSIONS = "TRAINING_SESSIONS",
  EVENTS = "EVENTS",
  MESSAGING = "MESSAGING",
}

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

export interface NotificationPreference {
  notifName: NotificationTypeEnum;
  description: string;
  enabled: boolean;
}

export interface NotificationMethod {
  notificationMethod: NotificationMethodEnum;
  enabled: boolean;
}

export interface NotificationSettings {
  notificationMethods: NotificationMethod[];
  notificationComponents: NotificationPreference[];
}
