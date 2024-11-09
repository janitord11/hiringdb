import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Save, ArrowLeft } from 'lucide-react';
import { useDb } from '../../lib/db';
import { queries } from '../../lib/queries';

interface Interview {
  id: number;
  interview_date: string;
  candidate_name: string;
  notes: string;
}

export default function PositionDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const db = useDb();
  const [position, setPosition] = useState<any>(null);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    description: '',
    payRate: '',
    shift: '',
    startTime: '',
    endTime: '',
    employmentType: '',
    status: '',
    candidateName: '',
    notes: ''
  });
  const [newInterview, setNewInterview] = useState({
    interviewDate: '',
    candidateName: '',
    notes: ''
  });

  useEffect(() => {
    if (db && id) {
      const positionData = queries.getPositionDetails(db, parseInt(id));
      setPosition(positionData);
      setEditData({
        description: positionData.description || '',
        payRate: positionData.pay_rate?.toString() || '',
        shift: positionData.shift || '',
        startTime: positionData.start_time || '',
        endTime: positionData.end_time || '',
        employmentType: positionData.employment_type || '',
        status: positionData.status || '',
        candidateName: positionData.candidate_name || '',
        notes: positionData.notes || ''
      });

      const interviewData = queries.getInterviews(db, parseInt(id));
      setInterviews(interviewData);
    }
  }, [db, id]);

  const handleSave = () => {
    if (!db || !id) return;

    queries.updateJobOpening(db, parseInt(id), {
      ...editData,
      payRate: parseFloat(editData.payRate)
    });

    const updatedPosition = queries.getPositionDetails(db, parseInt(id));
    setPosition(updatedPosition);
    setIsEditing(false);
  };

  const handleAddInterview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!db || !id) return;

    queries.addInterview(db, {
      jobOpeningId: parseInt(id),
      ...newInterview
    });

    const updatedInterviews = queries.getInterviews(db, parseInt(id));
    setInterviews(updatedInterviews);
    setNewInterview({
      interviewDate: '',
      candidateName: '',
      notes: ''
    });
  };

  if (!position) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">
              {position.position_title} at {position.facility_name}
            </h2>
            <p className="text-gray-500 mt-1">Position ID: {position.id}</p>
          </div>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Edit Position
            </button>
          )}
        </div>

        {isEditing ? (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pay Rate ($/hour)
                </label>
                <input
                  type="number"
                  value={editData.payRate}
                  onChange={(e) => setEditData({ ...editData, payRate: e.target.value })}
                  className="form-input"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Employment Type
                </label>
                <select
                  value={editData.employmentType}
                  onChange={(e) => setEditData({ ...editData, employmentType: e.target.value })}
                  className="form-select"
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Shift
                </label>
                <select
                  value={editData.shift}
                  onChange={(e) => setEditData({ ...editData, shift: e.target.value })}
                  className="form-select"
                >
                  <option value="1st">1st Shift</option>
                  <option value="2nd">2nd Shift</option>
                  <option value="3rd">3rd Shift</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={editData.status}
                  onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                  className="form-select"
                >
                  <option value="Open">Open</option>
                  <option value="Filled">Filled</option>
                  <option value="Closed">Closed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Time
                </label>
                <input
                  type="time"
                  value={editData.startTime}
                  onChange={(e) => setEditData({ ...editData, startTime: e.target.value })}
                  className="form-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Time
                </label>
                <input
                  type="time"
                  value={editData.endTime}
                  onChange={(e) => setEditData({ ...editData, endTime: e.target.value })}
                  className="form-input"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={editData.description}
                onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                className="form-textarea"
                rows={4}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Candidate Name
              </label>
              <input
                type="text"
                value={editData.candidateName}
                onChange={(e) => setEditData({ ...editData, candidateName: e.target.value })}
                className="form-input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                value={editData.notes}
                onChange={(e) => setEditData({ ...editData, notes: e.target.value })}
                className="form-textarea"
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Pay Rate</h3>
                <p className="mt-1 text-gray-900">${position.pay_rate}/hour</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Employment Type</h3>
                <p className="mt-1 text-gray-900">{position.employment_type}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Shift</h3>
                <p className="mt-1 text-gray-900">{position.shift} Shift</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Status</h3>
                <p className="mt-1">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    position.status === 'Open' ? 'bg-green-100 text-green-800' :
                    position.status === 'Filled' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {position.status}
                  </span>
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Work Hours</h3>
                <p className="mt-1 text-gray-900">{position.start_time} - {position.end_time}</p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Description</h3>
              <p className="mt-1 text-gray-900 whitespace-pre-wrap">{position.description}</p>
            </div>

            {position.candidate_name && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">Candidate</h3>
                <p className="mt-1 text-gray-900">{position.candidate_name}</p>
              </div>
            )}

            {position.notes && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">Notes</h3>
                <p className="mt-1 text-gray-900 whitespace-pre-wrap">{position.notes}</p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">Interviews</h3>

        <form onSubmit={handleAddInterview} className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 mb-4">Schedule New Interview</h4>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Interview Date & Time
              </label>
              <input
                type="datetime-local"
                value={newInterview.interviewDate}
                onChange={(e) => setNewInterview({ ...newInterview, interviewDate: e.target.value })}
                className="form-input"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Candidate Name
              </label>
              <input
                type="text"
                value={newInterview.candidateName}
                onChange={(e) => setNewInterview({ ...newInterview, candidateName: e.target.value })}
                className="form-input"
                required
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Interview Notes
            </label>
            <textarea
              value={newInterview.notes}
              onChange={(e) => setNewInterview({ ...newInterview, notes: e.target.value })}
              className="form-textarea"
              rows={3}
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Schedule Interview
            </button>
          </div>
        </form>

        <div className="space-y-4">
          {interviews.map((interview) => (
            <div
              key={interview.id}
              className="p-4 border border-gray-200 rounded-lg"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center text-gray-900">
                  <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                  {new Date(interview.interview_date).toLocaleString()}
                </div>
                <span className="text-sm font-medium text-gray-500">
                  {interview.candidate_name}
                </span>
              </div>
              {interview.notes && (
                <p className="text-gray-600 text-sm whitespace-pre-wrap">
                  {interview.notes}
                </p>
              )}
            </div>
          ))}
          {interviews.length === 0 && (
            <p className="text-center text-gray-500 py-4">
              No interviews scheduled yet
            </p>
          )}
        </div>
      </div>
    </div>
  );
}