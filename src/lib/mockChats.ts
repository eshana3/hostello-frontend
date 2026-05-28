import type { Chat, Message } from "@/types/chat";

export const CURRENT_USER_ID = "buyer123";
export const CURRENT_USER_NAME = "Campus Buyer";

export const MOCK_CHATS: Chat[] = [
  {
    id: "chat1",
    participants: ["buyer123", "s1"],
    participantNames: { buyer123: "You", s1: "Priya Sharma" },
    participantAvatars: {
      buyer123: "https://api.dicebear.com/7.x/initials/svg?seed=You&backgroundColor=7C3AED",
      s1: "https://api.dicebear.com/7.x/initials/svg?seed=Priya+Sharma&backgroundColor=ec4899",
    },
    lastMessage: "Sure, you can pick it up from KP-5 after 5pm",
    lastMessageTime: "2026-05-26T14:30:00Z",
    lastMessageSenderId: "s1",
    unreadCount: 1,
    productId: "p1",
    productTitle: "Physics Textbook HC Verma",
    productImageUrl: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=200&q=80",
  },
  {
    id: "chat2",
    participants: ["buyer123", "s2"],
    participantNames: { buyer123: "You", s2: "Rahul Verma" },
    participantAvatars: {
      buyer123: "https://api.dicebear.com/7.x/initials/svg?seed=You&backgroundColor=7C3AED",
      s2: "https://api.dicebear.com/7.x/initials/svg?seed=Rahul+Verma&backgroundColor=0ea5e9",
    },
    lastMessage: "₹750 is my best price",
    lastMessageTime: "2026-05-25T10:15:00Z",
    lastMessageSenderId: "s2",
    unreadCount: 0,
    productId: "p2",
    productTitle: "Casio FX-991EX Calculator",
    productImageUrl: "https://images.unsplash.com/photo-1564466809058-bf4114d55352?w=200&q=80",
  },
  {
    id: "chat3",
    participants: ["buyer123", "s3"],
    participantNames: { buyer123: "You", s3: "Anjali Mehta" },
    participantAvatars: {
      buyer123: "https://api.dicebear.com/7.x/initials/svg?seed=You&backgroundColor=7C3AED",
      s3: "https://api.dicebear.com/7.x/initials/svg?seed=Anjali+Mehta&backgroundColor=10b981",
    },
    lastMessage: "The tablet comes with the stylus too!",
    lastMessageTime: "2026-05-24T18:00:00Z",
    lastMessageSenderId: "s3",
    unreadCount: 2,
    productId: "p4",
    productTitle: "Wacom Drawing Tablet",
    productImageUrl: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=200&q=80",
  },
];

export const MOCK_MESSAGES: Record<string, Message[]> = {
  chat1: [
    { id: "m1", chatId: "chat1", senderId: "buyer123", senderName: "You", content: "Hi! Is the HC Verma still available?", createdAt: "2026-05-26T14:00:00Z", read: true },
    { id: "m2", chatId: "chat1", senderId: "s1", senderName: "Priya Sharma", content: "Yes it is! It's in great condition, used only one semester.", createdAt: "2026-05-26T14:05:00Z", read: true },
    { id: "m3", chatId: "chat1", senderId: "buyer123", senderName: "You", content: "Can you do ₹130?", createdAt: "2026-05-26T14:10:00Z", read: true },
    { id: "m4", chatId: "chat1", senderId: "s1", senderName: "Priya Sharma", content: "Hmm, I can do ₹140, final.", createdAt: "2026-05-26T14:15:00Z", read: true },
    { id: "m5", chatId: "chat1", senderId: "buyer123", senderName: "You", content: "Deal! When can I pick it up?", createdAt: "2026-05-26T14:20:00Z", read: true },
    { id: "m6", chatId: "chat1", senderId: "s1", senderName: "Priya Sharma", content: "Sure, you can pick it up from KP-5 after 5pm", createdAt: "2026-05-26T14:30:00Z", read: false },
  ],
  chat2: [
    { id: "m7", chatId: "chat2", senderId: "buyer123", senderName: "You", content: "Hey! Is the calculator still for sale?", createdAt: "2026-05-25T10:00:00Z", read: true },
    { id: "m8", chatId: "chat2", senderId: "s2", senderName: "Rahul Verma", content: "Yes! Barely used, works perfectly.", createdAt: "2026-05-25T10:05:00Z", read: true },
    { id: "m9", chatId: "chat2", senderId: "buyer123", senderName: "You", content: "Would you take ₹700?", createdAt: "2026-05-25T10:10:00Z", read: true },
    { id: "m10", chatId: "chat2", senderId: "s2", senderName: "Rahul Verma", content: "₹750 is my best price", createdAt: "2026-05-25T10:15:00Z", read: true },
  ],
  chat3: [
    { id: "m11", chatId: "chat3", senderId: "buyer123", senderName: "You", content: "Hi Anjali! Interested in the Wacom tablet", createdAt: "2026-05-24T17:45:00Z", read: true },
    { id: "m12", chatId: "chat3", senderId: "s3", senderName: "Anjali Mehta", content: "Great! It's the medium size CTL-672.", createdAt: "2026-05-24T17:50:00Z", read: true },
    { id: "m13", chatId: "chat3", senderId: "s3", senderName: "Anjali Mehta", content: "The tablet comes with the stylus too!", createdAt: "2026-05-24T18:00:00Z", read: false },
  ],
};
