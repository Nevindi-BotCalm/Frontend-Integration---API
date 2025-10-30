import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  name: string;
  email: string;
  gender: string;
  department: string;
  phone: string;
  isActive: boolean;
  startDate: string;
}

interface UserStore {
  users: User[];
  addUser: (user: User) => void;
  updateUser: (index: number, user: User) => void;
  deleteUser: (index: number) => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      users: [],
      addUser: (user) => set((state) => ({ users: [...state.users, user] })),
      updateUser: (index, user) =>
        set((state) => ({
          users: state.users.map((u, i) => (i === index ? user : u)),
        })),
      deleteUser: (index) =>
        set((state) => ({
          users: state.users.filter((_, i) => i !== index),
        })),
    }),
    {
      name: 'user-storage',
    }
  )
);
