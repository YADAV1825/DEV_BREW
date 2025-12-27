
import { User, Post, Room, Message, FriendRequest } from '../types';
import { STATIC_ROOMS } from '../constants';

class DatabaseService {
  constructor() {
    this.initSampleData();
  }

  private initSampleData() {
    const users = this.getStorage<User>('users');
    if (users.length === 0) {
      const sampleUser: User = {
        id: 'sample-admin-uuid',
        email: 'coffee_coder@devbrew.io',
        username: 'coffee_coder',
        password: 'password123', // Default test password
        bio: 'I turn caffeine into recursive functions.',
        message_privacy: 'all',
        created_at: new Date().toISOString()
      };
      users.push(sampleUser);
      this.setStorage('users', users);

      // Add a sample post
      this.createPost({
        author_id: sampleUser.id,
        author_username: sampleUser.username,
        content: "Just initialized the DevBrew kernel. Ready to code. #helloworld #coffee",
        tags: ['helloworld', 'coffee']
      });
    }
  }

  private getStorage<T>(key: string): T[] {
    const data = localStorage.getItem(`devbrew_${key}`);
    return data ? JSON.parse(data) : [];
  }

  private setStorage<T>(key: string, data: T[]): void {
    localStorage.setItem(`devbrew_${key}`, JSON.stringify(data));
  }

  // USERS
  async getUser(id: string): Promise<User | null> {
    const users = this.getStorage<User>('users');
    return users.find(u => u.id === id) || null;
  }

  async getUserByUsername(username: string): Promise<User | null> {
    const users = this.getStorage<User>('users');
    return users.find(u => u.username.toLowerCase() === username.toLowerCase()) || null;
  }

  async createUser(user: User): Promise<User> {
    const users = this.getStorage<User>('users');
    users.push(user);
    this.setStorage('users', users);
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    const users = this.getStorage<User>('users');
    const index = users.findIndex(u => u.id === id);
    if (index === -1) throw new Error('User not found');
    users[index] = { ...users[index], ...updates };
    this.setStorage('users', users);
    return users[index];
  }

  // POSTS
  async getPosts(): Promise<Post[]> {
    return this.getStorage<Post>('posts').sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }

  async createPost(post: Omit<Post, 'id' | 'created_at'>): Promise<Post> {
    const posts = this.getStorage<Post>('posts');
    const newPost: Post = {
      ...post,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString()
    };
    posts.push(newPost);
    this.setStorage('posts', posts);
    return newPost;
  }

  // ROOM MESSAGES
  async getRoomMessages(roomId: string): Promise<Message[]> {
    const messages = this.getStorage<Message>('messages');
    return messages.filter(m => m.room_id === roomId).sort((a, b) => 
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );
  }

  async sendMessage(message: Omit<Message, 'id' | 'created_at'>): Promise<Message> {
    const messages = this.getStorage<Message>('messages');
    const newMessage: Message = {
      ...message,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString()
    };
    messages.push(newMessage);
    this.setStorage('messages', messages);
    return newMessage;
  }

  // FRIENDS
  async getFriendRequests(userId: string): Promise<FriendRequest[]> {
    const requests = this.getStorage<FriendRequest>('friend_requests');
    return requests;
  }

  async getFriends(userId: string): Promise<User[]> {
    const friendships = this.getStorage<{user_a: string, user_b: string}>('friendships');
    const friendIds = friendships.flatMap(f => 
      f.user_a === userId ? [f.user_b] : f.user_b === userId ? [f.user_a] : []
    );
    const users = this.getStorage<User>('users');
    return users.filter(u => friendIds.includes(u.id));
  }
}

export const db = new DatabaseService();
