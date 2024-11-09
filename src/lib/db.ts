import { createContext } from 'react';

export type DB = any;
export const DbContext = createContext<DB | undefined>(undefined);

interface DBResponse {
  success: boolean;
  data?: any;
  error?: string;
}

const API_BASE = 'https://district11.cloud/api';

export const queries = {
  async executeQuery(endpoint: string, method: string = 'GET', data?: any): Promise<DBResponse> {
    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: data ? JSON.stringify(data) : undefined,
        credentials: 'same-origin'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Database query error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  },

  // Job Openings
  async getJobOpenings(): Promise<DBResponse> {
    return this.executeQuery('/job_openings');
  },

  async addJobOpening(data: any): Promise<DBResponse> {
    return this.executeQuery('/job_openings', 'POST', data);
  },

  async updateJobOpening(id: number, data: any): Promise<DBResponse> {
    return this.executeQuery(`/job_openings?id=${id}`, 'PUT', data);
  },

  // Facilities
  async getFacilities(): Promise<DBResponse> {
    return this.executeQuery('/facilities');
  },

  // Positions
  async getPositions(): Promise<DBResponse> {
    return this.executeQuery('/positions');
  },

  // Pay Rates
  async getPayRates(positionId: number): Promise<DBResponse> {
    return this.executeQuery(`/pay_rates?position_id=${positionId}`);
  }
};

export const initDb = async (): Promise<boolean> => {
  try {
    const response = await queries.executeQuery('/init');
    return response.success;
  } catch (error) {
    console.error('Failed to initialize database connection:', error);
    return false;
  }
};