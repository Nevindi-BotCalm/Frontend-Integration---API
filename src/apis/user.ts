import { User } from '../app/payments/columns';

export async function fetchUsers(): Promise<User[]> {
  try {
    const response = await fetch('https://dummyjson.com/users?limit=208');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.users;
  } catch (error) {
    console.error('Fetch error:', error);
    throw new Error('Network error: Unable to fetch users');
  }
}
