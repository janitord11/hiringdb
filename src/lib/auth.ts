import { useAuth } from './auth/AuthContext';

const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'district11'
};

export const authenticate = (username: string, password: string): boolean => {
  return username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password;
};

export const isAuthenticated = (): boolean => {
  return sessionStorage.getItem('isAuthenticated') === 'true';
};