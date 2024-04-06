import { User } from '@/api/user/userModel';

export const users: User[] = [
  {
    id: '1',
    name: 'Alice',
    email: 'alice@example.com',
    age: 42,
    createdAt: new Date(),
    updatedAt: new Date(),
    secret: 'pewpew',
  },
  {
    id: '2',
    name: 'Bob',
    email: 'bob@example.com',
    age: 21,
    createdAt: new Date(),
    updatedAt: new Date(),
    secret: 'pewpew',
  },
];

export const userRepository = {
  findAllAsync: async (): Promise<User[]> => {
    return users;
  },

  findByIdAsync: async (id: string): Promise<User | null> => {
    return users.find((user) => user.id === id) || null;
  },
};
