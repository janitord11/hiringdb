import { useContext } from 'react';
import { DbContext } from '../lib/db';

export const useDb = () => {
  const db = useContext(DbContext);
  if (!db) {
    throw new Error('useDb must be used within a DbProvider');
  }
  return db;
};