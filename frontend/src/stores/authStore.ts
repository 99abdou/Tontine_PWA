import { create } from 'zustand';
import { User, UserRole } from '../types';
import { mockUsers } from '../services/mockData';

interface AuthState {
  user: User | null;
  role: UserRole;
  isAuthenticated: boolean;
  login: (phone: string, role?: UserRole) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: mockUsers[0], // Fatou Sow (Organisatrice) par défaut
  role: 'organizer',
  isAuthenticated: true,

  login: (phone: string, targetRole: UserRole = 'organizer') => {
    let found = mockUsers.find((u) => u.phone.includes(phone) || u.role === targetRole);
    if (!found) {
      found = targetRole === 'participant' ? mockUsers[1] : mockUsers[0];
    }
    set({
      user: found,
      role: found.role,
      isAuthenticated: true,
    });
  },

  logout: () => {
    set({
      user: null,
      role: 'participant',
      isAuthenticated: false,
    });
  },

  switchRole: (role: UserRole) => {
    const targetUser = mockUsers.find((u) => u.role === role) || mockUsers[0];
    set({
      user: targetUser,
      role: role,
      isAuthenticated: true,
    });
  },
}));
