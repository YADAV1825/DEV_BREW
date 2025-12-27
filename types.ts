
export interface User {
  id: string;
  email: string;
  username: string;
  password?: string; // Added for simulated auth persistence
  dp_url?: string;
  bio?: string;
  message_privacy: 'all' | 'friends';
  created_at: string;
}

export interface Post {
  id: string;
  author_id: string;
  author_username: string;
  content: string;
  tags?: string[];
  poll?: Poll;
  created_at: string;
}

export interface Poll {
  id: string;
  question: string;
  options: PollOption[];
}

export interface PollOption {
  id: string;
  option_text: string;
  vote_count: number;
  user_voted?: boolean;
}

export interface Room {
  id: string;
  name: string;
  slug: string;
  description: string;
}

export interface Message {
  id: string;
  room_id?: string;
  sender_id: string;
  sender_username: string;
  content: string;
  created_at: string;
}

export interface FriendRequest {
  id: string;
  sender_id: string;
  sender_username: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
}
