import React, { useEffect, useState } from 'react';
import { Download } from 'lucide-react';
import { queries } from '../../lib/db';
import { generatePDF } from '../../lib/pdfGenerator';

interface JobOpening {
  id: number;
  facility_name: string;
  position_title: string;
  pay_rate: number;
  date_opened: string;
  description: string;
}

export default function OpenPositionsReport() {
  const [openings, setOpenings] = useState<JobOpening[]>([]);

  useEffect(() => {
    loadOpenings();
  }, []);

  const loadOpenings = () => {
    const results = queries.getJobOpenings.all();
    setOpenings(results);
  };

  const handleDownloadPDF = () => {
    generatePDF(openings);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">Open Positions Report</h2>
        <button
          onClick={handleDownloadPDF}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Download className="w-4 h-4" />
          Download PDF
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Facility
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Position
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pay Rate
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date Opened
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {openings.map((opening) => (
              <tr key={opening.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {opening.facility_name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {opening.position_title}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${opening.pay_rate.toFixed(2)}/hour
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(opening.date_opened).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}