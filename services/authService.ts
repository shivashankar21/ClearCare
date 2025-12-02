import { User } from '../constants/types';
import AsyncStorage from '@react-native-async-storage/async-storage';

export class AuthService {
  private static currentUser: User | null = null;

  // Mock users data
  private static mockUsers: User[] = [
    {
      id: 'user1',
      email: 'cheytna@clearcare.com',
      name: 'Cheytna',
      avatar: '',
      isAdmin: false
    },
    {
      id: 'admin1',
      email: 'admin@clearcare.com',
      name: 'Dr. Sarah Johnson',
      avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop&crop=face',
      isAdmin: true
    },
    {
      id: 'user2',
      email: 'jane.smith@example.com',
      name: 'Jane Smith',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b332c1cf?w=100&h=100&fit=crop&crop=face',
      isAdmin: false
    }
  ];

  static async signInWithGoogle(): Promise<User> {
    // Simulate Google OAuth flow
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Always use consistent default user (Cheytna) for demo
    const defaultUser = this.mockUsers[0];
    this.currentUser = defaultUser;
    
    // Clear any existing user data first to ensure consistency
    await AsyncStorage.removeItem('currentUser');
    await AsyncStorage.setItem('currentUser', JSON.stringify(defaultUser));
    return defaultUser;
  }

  static async signOut(): Promise<void> {
    this.currentUser = null;
    await AsyncStorage.removeItem('currentUser');
  }

  static async getCurrentUser(): Promise<User | null> {
    if (this.currentUser) {
      return this.currentUser;
    }

    try {
      const stored = await AsyncStorage.getItem('currentUser');
      if (stored) {
        this.currentUser = JSON.parse(stored);
        return this.currentUser;
      }
    } catch (error) {
      console.error('Error getting current user:', error);
    }

    // If no stored user, default to Cheytna for consistency
    const defaultUser = this.mockUsers[0];
    this.currentUser = defaultUser;
    await AsyncStorage.setItem('currentUser', JSON.stringify(defaultUser));
    return defaultUser;
  }

  static async checkAuthState(): Promise<User | null> {
    return await this.getCurrentUser();
  }

  static isAdmin(user: User | null): boolean {
    return user?.isAdmin === true;
  }

  // Mock admin data
  static getMockUsers(): User[] {
    return this.mockUsers;
  }
}