export type NotificationType = "message" | "poll_reply" | "wishlist" | "sold" | "listing" | "system";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  link?: string;
  avatar?: string;
}
