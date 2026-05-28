// Set to true to access admin dashboard (replace with real auth check when ready)
export const MOCK_IS_ADMIN = true;

export const MOCK_ADMIN_STATS = {
  totalUsers: 248,
  totalProducts: 312,
  activeListings: 189,
  soldProducts: 123,
  liveUsers: 14,

  hostelActivity: [
    { hostel: "KP-3",  listings: 28 },
    { hostel: "KP-5",  listings: 24 },
    { hostel: "KP-7",  listings: 19 },
    { hostel: "KP-12", listings: 17 },
    { hostel: "QC-2",  listings: 15 },
    { hostel: "QC-6",  listings: 13 },
    { hostel: "KP-15", listings: 11 },
    { hostel: "QC-10", listings: 9  },
  ],

  categoryBreakdown: [
    { category: "Books",       sold: 48 },
    { category: "Electronics", sold: 35 },
    { category: "Clothing",    sold: 18 },
    { category: "Sports",      sold: 10 },
    { category: "Stationery",  sold: 7  },
    { category: "Other",       sold: 5  },
  ],

  dailyUsers: [
    { date: "Mon", users: 42 },
    { date: "Tue", users: 58 },
    { date: "Wed", users: 51 },
    { date: "Thu", users: 73 },
    { date: "Fri", users: 89 },
    { date: "Sat", users: 61 },
    { date: "Sun", users: 38 },
  ],

  chatActivity: [
    { date: "Mon", messages: 87  },
    { date: "Tue", messages: 124 },
    { date: "Wed", messages: 103 },
    { date: "Thu", messages: 148 },
    { date: "Fri", messages: 192 },
    { date: "Sat", messages: 135 },
    { date: "Sun", messages: 74  },
  ],

  recentActivity: [
    { id: "a1", type: "listing",  description: "New listing: Sony Earbuds",         user: "Priya Sharma",  hostel: "KP-5",  time: "2 min ago"  },
    { id: "a2", type: "sale",     description: "Product sold: HC Verma Textbook",    user: "Aryan Kapoor",  hostel: "KP-7",  time: "8 min ago"  },
    { id: "a3", type: "user",     description: "New user registered",                user: "Sneha Patel",   hostel: "QC-3",  time: "15 min ago" },
    { id: "a4", type: "chat",     description: "Chat started for Wacom Tablet",      user: "Anjali Mehta",  hostel: "QC-6",  time: "22 min ago" },
    { id: "a5", type: "poll",     description: "New request: Badminton Racket",      user: "Nikhil Bose",   hostel: "KP-12", time: "34 min ago" },
    { id: "a6", type: "listing",  description: "New listing: Casio Calculator",      user: "Rahul Verma",   hostel: "KP-3",  time: "41 min ago" },
    { id: "a7", type: "sale",     description: "Product sold: Study Lamp",           user: "Divya Rao",     hostel: "QC-8",  time: "1 hr ago"   },
    { id: "a8", type: "poll",     description: "Poll closed: Scientific Calculator", user: "Sneha Patel",   hostel: "QC-3",  time: "2 hr ago"   },
  ],

  topUsers: [
    { id: "u1", name: "Priya Sharma",  hostel: "KP-5",  listings: 8, sold: 5, avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Priya+Sharma&backgroundColor=ec4899"  },
    { id: "u2", name: "Rahul Verma",   hostel: "KP-3",  listings: 7, sold: 4, avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Rahul+Verma&backgroundColor=0ea5e9"   },
    { id: "u3", name: "Anjali Mehta",  hostel: "QC-6",  listings: 6, sold: 3, avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Anjali+Mehta&backgroundColor=10b981"  },
    { id: "u4", name: "Aryan Kapoor",  hostel: "KP-7",  listings: 5, sold: 3, avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Aryan+Kapoor&backgroundColor=7C3AED"  },
    { id: "u5", name: "Divya Rao",     hostel: "QC-8",  listings: 4, sold: 2, avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Divya+Rao&backgroundColor=f59e0b"     },
  ],
};
