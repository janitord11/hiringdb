import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Download, Save, Link as LinkIcon, Calendar } from 'lucide-react';
import { useDb } from '../../lib/db';
import { queries } from '../../lib/queries';
import { generatePDF } from '../../lib/pdfGenerator';
import { useAuth } from '../../lib/auth/AuthContext';
import FilledPositionsReport from './FilledPositionsReport';

interface JobOpening {
  id: number;
  facility_name: string;
  position_title: string;
  employment_type: string;
  shift: string;
  start_time: string;
  end_time: string;
  pay_rate: number;
  date_opened: string;
  status: string;
  candidate_name?: string;
  notes?: string;
}

export default function Reports() {
  const db = useDb();
  const { isAuthenticated } = useAuth();
  const [openings, setOpenings] = useState<JobOpening[]>([]);
  const [facilityCount, setFacilityCount] = useState(0);
  const [openPositionsCount, setOpenPositionsCount] = useState(0);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState({ status: '', candidateName: '', notes: '' });
  const [activeTab, setActiveTab] = useState('open');

  useEffect(() => {
    if (db) {
      if (activeTab === 'open') {
        const results = queries.getJobOpenings(db);
        setOpenings(results);
        setFacilityCount(queries.getFacilityCount(db));
        setOpenPositionsCount(queries.getOpenPositionsCount(db));
      }
    }
  }, [db, activeTab]);

  const handleDownloadPDF = () => {
    generatePDF(openings);
  };

  const handleEdit = (opening: JobOpening) => {
    setEditingId(opening.id);
    setEditData({
      status: opening.status,
      candidateName: opening.candidate_name || '',
      notes: opening.notes || ''
    });
  };

  const handleSave = (id: number) => {
    if (!db) return;
    
    queries.updateJobOpening(db, id, editData);
    setEditingId(null);
    
    const results = queries.getJobOpenings(db);
    setOpenings(results);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'open':
        return 'bg-green-100 text-green-800';
      case 'filled':
        return 'bg-blue-100 text-blue-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('open')}
            className={`${
              activeTab === 'open'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Open Positions
          </button>
          <button
            onClick={() => setActiveTab('filled')}
            className={`${
              activeTab === 'filled'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Filled Positions
          </button>
        </nav>
      </div>

      {activeTab === 'open' ? (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">Position Management</h2>
              <div className="mt-2 text-sm text-gray-600">
                <span className="mr-4">Total Facilities: {facilityCount}</span>
                <span>Open Positions: {openPositionsCount}</span>
              </div>
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
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Shift
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Work Hours
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pay Rate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date Opened
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Candidate
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
                {openings.map((opening) => (
                  <tr key={opening.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {opening.facility_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {isAuthenticated ? (
                        <Link
                          to={`/dashboard/positions/${opening.id}`}
                          className="flex items-center text-blue-600 hover:text-blue-800"
                        >
                          {opening.position_title}
                          <LinkIcon className="w-4 h-4 ml-1" />
                        </Link>
                      ) : (
                        opening.position_title
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {opening.employment_type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {opening.shift} Shift
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {opening.start_time} - {opening.end_time}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${opening.pay_rate.toFixed(2)}/hour
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                        {new Date(opening.date_opened).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {isAuthenticated && editingId === opening.id ? (
                        <select
                          value={editData.status}
                          onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                          className="rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                        >
                          <option value="Open">Open</option>
                          <option value="Filled">Filled</option>
                          <option value="Closed">Closed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      ) : (
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(opening.status)}`}>
                          {opening.status}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {isAuthenticated && editingId === opening.id ? (
                        <input
                          type="text"
                          value={editData.candidateName}
                          onChange={(e) => setEditData({ ...editData, candidateName: e.target.value })}
                          className="rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm w-full"
                          placeholder="Candidate name"
                        />
                      ) : (
                        opening.candidate_name || '-'
                      )}
                    </td>
                    {isAuthenticated && (
                      <>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {editingId === opening.id ? (
                            <input
                              type="text"
                              value={editData.notes}
                              onChange={(e) => setEditData({ ...editData, notes: e.target.value })}
                              className="rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm w-full"
                              placeholder="Add notes"
                            />
                          ) : (
                            opening.notes || '-'
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {editingId === opening.id ? (
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleSave(opening.id)}
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
                              onClick={() => handleEdit(opening)}
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
                {openings.length === 0 && (
                  <tr>
                    <td colSpan={isAuthenticated ? 11 : 9} className="px-6 py-4 text-center text-sm text-gray-500">
                      No open positions found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <FilledPositionsReport />
      )}
    </div>
  );
}