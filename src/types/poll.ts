export interface Poll {
  id: string;
  itemName: string;
  description: string;
  category: string;
  maxPrice?: number;
  hostelId: string;
  buyerId: string;
  buyerName: string;
  buyerAvatar: string;
  status: "open" | "closed";
  createdAt: string;
  replyCount: number;
}

export interface PollReply {
  id: string;
  pollId: string;
  sellerId: string;
  sellerName: string;
  sellerAvatar: string;
  message: string;
  price?: number;
  createdAt: string;
}
