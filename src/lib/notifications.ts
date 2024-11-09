import { queries } from './queries';
import type { DB } from './db';

interface EmailPayload {
  facilityName: string;
  positionTitle: string;
  employmentType: string;
  payRate: number;
  shift: string;
  startTime: string;
  endTime: string;
}

const LAMBDA_ENDPOINT = 'https://your-lambda-endpoint.amazonaws.com/notify';
const ADMIN_EMAIL = 'admin@yourdomain.com';

export async function sendNewPositionEmail(db: DB, positionId: number): Promise<void> {
  try {
    const position = queries.getPositionDetails(db, positionId);
    
    if (!position) {
      console.error('Position not found for notification:', positionId);
      return;
    }

    const payload: EmailPayload = {
      facilityName: position.facility_name,
      positionTitle: position.position_title,
      employmentType: position.employment_type,
      payRate: position.pay_rate,
      shift: position.shift,
      startTime: position.start_time,
      endTime: position.end_time
    };

    const response = await fetch(LAMBDA_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: ADMIN_EMAIL,
        subject: `New Position Opened: ${position.position_title}`,
        payload
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to send notification: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Failed to send position notification:', error);
  }
}