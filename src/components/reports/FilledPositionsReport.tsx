import React, { useState } from 'react';
import { Download, Calendar, Save, Link as LinkIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDb } from '../../lib/db';
import { queries } from '../../lib/queries';
import { generateFilledPositionsPDF } from '../../lib/pdfGenerator';
import { useAuth } from '../../lib/auth/AuthContext';

interface FilledPosition {
  id: number;
  facility_name: string;
  position_title: string;
  candidate_name: string;
  filled_date: string;
  pay_rate: number;
  date_opened: string;
  status: string;
  notes?: string;
}

export default function FilledPositionsReport() {
  const db = useDb();
  const { isAuthenticated } = useAuth();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState({
    candidateName: '',
    notes: ''
  });
  const filledPositions = db ? queries.getFilledPositions(db) : [];

  const handleDownloadPDF = () => {
    if (!isAuthenticated) return;
    generateFilledPositionsPDF(filledPositions);
  };

  const handleEdit = (position: FilledPosition) => {
    setEditingId(position.id);
    setEditData({
      candidateName: position.candidate_name || '',
      notes: position.notes || ''
    });
  };

  const handleSave = (id: number) => {
    if (!db) return;
    
    // Always include status: 'Filled' in the update to ensure it stays filled
    queries.updateJobOpening(db, id, {
      ...editData,
      status: 'Filled' // Force status to remain 'Filled'
    });
    
    setEditingId(null);
    window.location.reload(); // Refresh to show updated data
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Filled Positions Report</h2>
          <p className="mt-2 text-sm text-gray-600">
            Total Filled Positions: {filledPositions.length}
          </p>
        </div>
        {isAuthenticated && (
          <button
            onClick={handleDownloadPDF}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Download className="w-4 h-4" />
            Download PDF
          </button>
        )}
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
                Candidate
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fill Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pay Rate
              </th>
              {isAuthenticated && (
                <>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Notes
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filledPositions.map((position) => (
              <tr key={position.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {position.facility_name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {isAuthenticated ? (
                    <Link
                      to={`/dashboard/positions/${position.id}`}
                      className="flex items-center text-blue-600 hover:text-blue-800"
                    >
                      {position.position_title}
                      <LinkIcon className="w-4 h-4 ml-1" />
                    </Link>
                  ) : (
                    position.position_title
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {editingId === position.id ? (
                    <input
                      type="text"
                      value={editData.candidateName}
                      onChange={(e) => setEditData({ ...editData, candidateName: e.target.value })}
                      className="rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm w-full"
                    />
                  ) : (
                    position.candidate_name
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <span className="inline-flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                    {new Date(position.filled_date).toLocaleDateString()}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${position.pay_rate.toFixed(2)}/hour
                </td>
                {isAuthenticated && (
                  <>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {editingId === position.id ? (
                        <input
                          type="text"
                          value={editData.notes}
                          onChange={(e) => setEditData({ ...editData, notes: e.target.value })}
                          className="rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm w-full"
                          placeholder="Add notes"
                        />
                      ) : (
                        position.notes || '-'
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {editingId === position.id ? (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleSave(position.id)}
                            className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            <Save className="w-4 h-4 mr-1" />
                            Save
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleEdit(position)}
                          className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          Edit
                        </button>
                      )}
                    </td>
                  </>
                )}
              </tr>
            ))}
            {filledPositions.length === 0 && (
              <tr>
                <td colSpan={isAuthenticated ? 7 : 5} className="px-6 py-4 text-center text-sm text-gray-500">
                  No filled positions found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}