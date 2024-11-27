export interface User {
  id: number;
  username: string;
  password: string;
  role: string;
  email: string;
  phone: string;
}

export let users: User[] = [
  { id: 1, username: 'admin', password: 'admin123', role: 'admin', email: 'admin@example.com', phone: '1234567890' },
];

// export const addUser = (user: Omit<User, 'id'>): void => {
//   const nextId = users.length + 1;
//   users.push({ id: nextId, ...user });
// };

export const addUser = (user: Omit<User, 'id'>): void => {
  const nextId = users.length + 1;
  users.push({ id: nextId, ...user, role: 'user' }); // Ensure role is 'user' by default
};

export const updateUser = (id: number, updatedData: Partial<Omit<User, 'id'>>): void => {
  const index = users.findIndex((user) => user.id === id);
  if (index !== -1) {
    users[index] = { ...users[index], ...updatedData };
  }
};