import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

interface JobOpening {
  facility_name: string;
  position_title: string;
  shift: string;
  pay_rate: number;
  date_opened: string;
  status: string;
  start_time: string;
  end_time: string;
  candidate_name?: string;
  notes?: string;
  filled_date?: string;
}

const SHIFT_LABELS = {
  '1st': '1st Shift (Day)',
  '2nd': '2nd Shift (Swing)',
  '3rd': '3rd Shift (Night)'
};

export const generatePDF = (openings: JobOpening[]) => {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });

  doc.setFontSize(20);
  doc.text('4M Building Solutions - Open Positions Report', 20, 20);
  doc.setFontSize(12);
  doc.text(`Generated on ${new Date().toLocaleDateString()}`, 20, 30);

  doc.autoTable({
    startY: 40,
    margin: { left: 20 },
    head: [['Facility', 'Position', 'Shift', 'Work Hours', 'Pay Rate', 'Status', 'Candidate', 'Date Opened']],
    body: openings.map((opening) => [
      opening.facility_name,
      opening.position_title,
      SHIFT_LABELS[opening.shift as keyof typeof SHIFT_LABELS] || opening.shift,
      `${opening.start_time} - ${opening.end_time}`,
      `$${opening.pay_rate.toFixed(2)}/hour`,
      opening.status,
      opening.candidate_name || '-',
      new Date(opening.date_opened).toLocaleDateString()
    ]),
    styles: { fontSize: 10, cellPadding: 5 },
    headStyles: { fillColor: [0, 38, 76] },
  });

  doc.save('open-positions-report.pdf');
};

export const generateFilledPositionsPDF = (positions: JobOpening[]) => {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });

  doc.setFontSize(20);
  doc.text('4M Building Solutions - Filled Positions Report', 20, 20);
  doc.setFontSize(12);
  doc.text(`Generated on ${new Date().toLocaleDateString()}`, 20, 30);

  doc.autoTable({
    startY: 40,
    margin: { left: 20 },
    head: [['Facility', 'Position', 'Candidate', 'Fill Date', 'Pay Rate', 'Date Opened']],
    body: positions.map((position) => [
      position.facility_name,
      position.position_title,
      position.candidate_name || '-',
      position.filled_date ? new Date(position.filled_date).toLocaleDateString() : '-',
      `$${position.pay_rate.toFixed(2)}/hour`,
      new Date(position.date_opened).toLocaleDateString()
    ]),
    styles: { fontSize: 10, cellPadding: 5 },
    headStyles: { fillColor: [0, 38, 76] },
  });

  doc.save('filled-positions-report.pdf');
};