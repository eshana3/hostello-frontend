import type { Notification } from "@/types/notification";

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "n1", type: "message", title: "New message from Priya Sharma",
    message: "Sure, you can pick it up from KP-5 after 5pm",
    read: false, createdAt: "2026-05-27T14:30:00Z", link: "/chats/chat1",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Priya+Sharma&backgroundColor=ec4899",
  },
  {
    id: "n2", type: "poll_reply", title: "Someone replied to your request",
    message: "Priya Sharma replied to your Organic Chemistry Textbook request",
    read: false, createdAt: "2026-05-27T13:00:00Z", link: "/polls/poll1",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Priya+Sharma&backgroundColor=ec4899",
  },
  {
    id: "n3", type: "wishlist", title: "Price drop on wishlisted item",
    message: "Wacom Drawing Tablet dropped to ₹2,200 (was ₹2,500)",
    read: false, createdAt: "2026-05-27T11:00:00Z", link: "/product/p4",
  },
  {
    id: "n4", type: "sold", title: "Your listing was marked sold",
    message: "Physics Textbook HC Verma has been marked as sold",
    read: true, createdAt: "2026-05-26T18:00:00Z", link: "/product/p1",
  },
  {
    id: "n5", type: "message", title: "New message from Rahul Verma",
    message: "₹750 is my best price",
    read: true, createdAt: "2026-05-25T10:15:00Z", link: "/chats/chat2",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Rahul+Verma&backgroundColor=0ea5e9",
  },
  {
    id: "n6", type: "listing", title: "New listing in your hostel",
    message: "Someone in KP-5 listed: Sony WH-1000XM4 Headphones for ₹3,500",
    read: true, createdAt: "2026-05-24T09:00:00Z", link: "/products",
  },
  {
    id: "n7", type: "system", title: "Welcome to Hostello!",
    message: "Start browsing listings or post your first item for sale",
    read: true, createdAt: "2026-05-20T08:00:00Z", link: "/products",
  },
];
