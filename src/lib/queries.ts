import { DB } from './db';

export const queries = {
  // Facilities
  getFacilities: (db: DB) => {
    try {
      const stmt = db.prepare('SELECT id, name FROM facilities ORDER BY name');
      const facilities = [];
      while (stmt.step()) {
        facilities.push(stmt.getAsObject());
      }
      stmt.free();
      return facilities;
    } catch (error) {
      console.error('Error getting facilities:', error);
      return [];
    }
  },
  
  addFacility: (db: DB, name: string) => {
    try {
      db.run('INSERT INTO facilities (name) VALUES (?)', [name]);
    } catch (error) {
      console.error('Error adding facility:', error);
      throw error;
    }
  },
  
  deleteFacility: (db: DB, id: number) => {
    try {
      db.run('DELETE FROM facilities WHERE id = ?', [id]);
    } catch (error) {
      console.error('Error deleting facility:', error);
      throw error;
    }
  },

  // Positions
  getPositions: (db: DB) => {
    try {
      const stmt = db.prepare('SELECT id, title FROM position_titles ORDER BY title');
      const positions = [];
      while (stmt.step()) {
        positions.push(stmt.getAsObject());
      }
      stmt.free();
      return positions;
    } catch (error) {
      console.error('Error getting positions:', error);
      return [];
    }
  },
  
  addPosition: (db: DB, title: string) => {
    try {
      db.run('INSERT INTO position_titles (title) VALUES (?)', [title]);
    } catch (error) {
      console.error('Error adding position:', error);
      throw error;
    }
  },
  
  deletePosition: (db: DB, id: number) => {
    try {
      db.run('DELETE FROM position_titles WHERE id = ?', [id]);
    } catch (error) {
      console.error('Error deleting position:', error);
      throw error;
    }
  },

  // Pay Rates
  getPayRates: (db: DB, positionId: number) => {
    try {
      const stmt = db.prepare('SELECT id, rate FROM pay_rates WHERE position_id = ? ORDER BY rate');
      stmt.bind([positionId]);
      const rates = [];
      while (stmt.step()) {
        rates.push(stmt.getAsObject());
      }
      stmt.free();
      return rates;
    } catch (error) {
      console.error('Error getting pay rates:', error);
      return [];
    }
  },
  
  addPayRate: (db: DB, positionId: number, rate: number) => {
    try {
      db.run('INSERT INTO pay_rates (position_id, rate) VALUES (?, ?)', [positionId, rate]);
    } catch (error) {
      console.error('Error adding pay rate:', error);
      throw error;
    }
  },
  
  deletePayRate: (db: DB, id: number) => {
    try {
      db.run('DELETE FROM pay_rates WHERE id = ?', [id]);
    } catch (error) {
      console.error('Error deleting pay rate:', error);
      throw error;
    }
  },

  // Job Openings
  getJobOpenings: (db: DB) => {
    try {
      const stmt = db.prepare(`
        SELECT 
          jo.*,
          f.name as facility_name,
          pt.title as position_title
        FROM job_openings jo
        JOIN facilities f ON jo.facility_id = f.id
        JOIN position_titles pt ON jo.position_id = pt.id
        WHERE jo.status = 'Open'
        ORDER BY jo.date_opened DESC
      `);
      const openings = [];
      while (stmt.step()) {
        openings.push(stmt.getAsObject());
      }
      stmt.free();
      return openings;
    } catch (error) {
      console.error('Error getting job openings:', error);
      return [];
    }
  },

  getFilledPositions: (db: DB) => {
    try {
      const stmt = db.prepare(`
        SELECT 
          jo.*,
          f.name as facility_name,
          pt.title as position_title,
          CASE 
            WHEN jo.status = 'Filled' THEN jo.status_updated_at
            ELSE NULL
          END as filled_date
        FROM job_openings jo
        JOIN facilities f ON jo.facility_id = f.id
        JOIN position_titles pt ON jo.position_id = pt.id
        WHERE jo.status = 'Filled'
        ORDER BY jo.status_updated_at DESC
      `);
      const positions = [];
      while (stmt.step()) {
        positions.push(stmt.getAsObject());
      }
      stmt.free();
      return positions;
    } catch (error) {
      console.error('Error getting filled positions:', error);
      return [];
    }
  },
  
  addJobOpening: (db: DB, opening: {
    facilityId: number;
    positionId: number;
    payRate: number;
    shift: string;
    startTime: string;
    endTime: string;
    description: string;
    employmentType: string;
  }) => {
    try {
      db.run(`
        INSERT INTO job_openings (
          facility_id,
          position_id,
          pay_rate,
          shift,
          start_time,
          end_time,
          description,
          employment_type,
          status,
          date_opened
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Open', CURRENT_TIMESTAMP)
      `, [
        opening.facilityId,
        opening.positionId,
        opening.payRate,
        opening.shift,
        opening.startTime,
        opening.endTime,
        opening.description,
        opening.employmentType
      ]);
    } catch (error) {
      console.error('Error adding job opening:', error);
      throw error;
    }
  },

  updateJobOpening: (db: DB, id: number, data: { 
    status?: string; 
    candidateName?: string; 
    notes?: string;
    description?: string;
    payRate?: number;
    shift?: string;
    startTime?: string;
    endTime?: string;
    employmentType?: string;
  }) => {
    try {
      const updates = [];
      const params = [];
      
      if (data.status !== undefined) {
        updates.push('status = ?');
        params.push(data.status);
      }
      
      if (data.candidateName !== undefined) {
        updates.push('candidate_name = ?');
        params.push(data.candidateName);
      }
      
      if (data.notes !== undefined) {
        updates.push('notes = ?');
        params.push(data.notes);
      }
      
      if (data.description !== undefined) {
        updates.push('description = ?');
        params.push(data.description);
      }
      
      if (data.payRate !== undefined) {
        updates.push('pay_rate = ?');
        params.push(data.payRate);
      }
      
      if (data.shift !== undefined) {
        updates.push('shift = ?');
        params.push(data.shift);
      }
      
      if (data.startTime !== undefined) {
        updates.push('start_time = ?');
        params.push(data.startTime);
      }
      
      if (data.endTime !== undefined) {
        updates.push('end_time = ?');
        params.push(data.endTime);
      }
      
      if (data.employmentType !== undefined) {
        updates.push('employment_type = ?');
        params.push(data.employmentType);
      }
      
      if (data.status !== undefined) {
        updates.push('status_updated_at = CURRENT_TIMESTAMP');
      }
      
      if (updates.length === 0) return;
      
      params.push(id);
      db.run(`
        UPDATE job_openings 
        SET ${updates.join(', ')}
        WHERE id = ?
      `, params);
    } catch (error) {
      console.error('Error updating job opening:', error);
      throw error;
    }
  },

  // Position Details
  getPositionDetails: (db: DB, id: number) => {
    try {
      const stmt = db.prepare(`
        SELECT 
          jo.*,
          f.name as facility_name,
          pt.title as position_title
        FROM job_openings jo
        JOIN facilities f ON jo.facility_id = f.id
        JOIN position_titles pt ON jo.position_id = pt.id
        WHERE jo.id = ?
      `);
      stmt.bind([id]);
      const result = stmt.step() ? stmt.getAsObject() : null;
      stmt.free();
      return result;
    } catch (error) {
      console.error('Error getting position details:', error);
      return null;
    }
  },

  // Interviews
  getInterviews: (db: DB, jobOpeningId: number) => {
    try {
      const stmt = db.prepare(`
        SELECT *
        FROM interviews
        WHERE job_opening_id = ?
        ORDER BY interview_date DESC
      `);
      stmt.bind([jobOpeningId]);
      const interviews = [];
      while (stmt.step()) {
        interviews.push(stmt.getAsObject());
      }
      stmt.free();
      return interviews;
    } catch (error) {
      console.error('Error getting interviews:', error);
      return [];
    }
  },

  addInterview: (db: DB, interview: {
    jobOpeningId: number;
    interviewDate: string;
    candidateName: string;
    notes: string;
  }) => {
    try {
      db.run(`
        INSERT INTO interviews (
          job_opening_id,
          interview_date,
          candidate_name,
          notes
        ) VALUES (?, ?, ?, ?)
      `, [
        interview.jobOpeningId,
        interview.interviewDate,
        interview.candidateName,
        interview.notes
      ]);
    } catch (error) {
      console.error('Error adding interview:', error);
      throw error;
    }
  },

  // Counts
  getFacilityCount: (db: DB) => {
    try {
      const stmt = db.prepare('SELECT COUNT(*) as count FROM facilities');
      const result = stmt.step() ? stmt.getAsObject() : { count: 0 };
      stmt.free();
      return result.count;
    } catch (error) {
      console.error('Error getting facility count:', error);
      return 0;
    }
  },

  getOpenPositionsCount: (db: DB) => {
    try {
      const stmt = db.prepare("SELECT COUNT(*) as count FROM job_openings WHERE status = 'Open'");
      const result = stmt.step() ? stmt.getAsObject() : { count: 0 };
      stmt.free();
      return result.count;
    } catch (error) {
      console.error('Error getting open positions count:', error);
      return 0;
    }
  }
};