import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDb } from '../../lib/db';
import { queries } from '../../lib/queries';
import { sendNewPositionEmail } from '../../lib/notifications';

interface Facility {
  id: number;
  name: string;
}

interface Position {
  id: number;
  title: string;
}

interface PayRate {
  id: number;
  rate: number;
}

export default function NewPosition() {
  const navigate = useNavigate();
  const db = useDb();
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [payRates, setPayRates] = useState<PayRate[]>([]);
  const [formData, setFormData] = useState({
    facilityId: '',
    positionId: '',
    employmentType: 'full-time',
    payRate: '',
    shift: '',
    startTime: '',
    endTime: '',
    description: ''
  });

  useEffect(() => {
    if (db) {
      const facilityResults = queries.getFacilities(db);
      setFacilities(facilityResults);
      
      const positionResults = queries.getPositions(db);
      setPositions(positionResults);
    }
  }, [db]);

  useEffect(() => {
    if (db && formData.positionId) {
      const rates = queries.getPayRates(db, parseInt(formData.positionId));
      setPayRates(rates);
    }
  }, [db, formData.positionId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db) return;

    try {
      // First, add the job opening
      const result = queries.addJobOpening(db, {
        facilityId: parseInt(formData.facilityId),
        positionId: parseInt(formData.positionId),
        employmentType: formData.employmentType,
        payRate: parseFloat(formData.payRate),
        shift: formData.shift,
        startTime: formData.startTime,
        endTime: formData.endTime,
        description: formData.description
      });

      // Get the last inserted ID from the database
      const stmt = db.prepare('SELECT last_insert_rowid() as id');
      const { id } = stmt.getAsObject() as { id: number };
      stmt.free();

      // Send notification email
      await sendNewPositionEmail(db, id);

      navigate('/dashboard/reports');
    } catch (error) {
      console.error('Error creating position:', error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Create New Job Opening</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label htmlFor="facilityId" className="block text-sm font-medium text-gray-700 mb-1">
              Facility
            </label>
            <select
              id="facilityId"
              name="facilityId"
              required
              className="form-select mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={formData.facilityId}
              onChange={handleChange}
            >
              <option value="">Select Facility</option>
              {facilities.map((facility) => (
                <option key={`facility-${facility.id}`} value={facility.id}>
                  {facility.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="positionId" className="block text-sm font-medium text-gray-700 mb-1">
              Position
            </label>
            <select
              id="positionId"
              name="positionId"
              required
              className="form-select mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={formData.positionId}
              onChange={handleChange}
            >
              <option value="">Select Position</option>
              {positions.map((position) => (
                <option key={`position-${position.id}`} value={position.id}>
                  {position.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label htmlFor="employmentType" className="block text-sm font-medium text-gray-700 mb-1">
              Employment Type
            </label>
            <select
              id="employmentType"
              name="employmentType"
              required
              className="form-select mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={formData.employmentType}
              onChange={handleChange}
            >
              <option value="full-time">Full Time</option>
              <option value="part-time">Part Time</option>
            </select>
          </div>

          <div>
            <label htmlFor="payRate" className="block text-sm font-medium text-gray-700 mb-1">
              Pay Rate ($/hour)
            </label>
            <select
              id="payRate"
              name="payRate"
              required
              className="form-select mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={formData.payRate}
              onChange={handleChange}
            >
              <option value="">Select Pay Rate</option>
              {payRates.map((rate) => (
                <option key={`rate-${rate.id}`} value={rate.rate}>
                  ${rate.rate.toFixed(2)}/hour
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label htmlFor="shift" className="block text-sm font-medium text-gray-700 mb-1">
              Shift
            </label>
            <select
              id="shift"
              name="shift"
              required
              className="form-select mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={formData.shift}
              onChange={handleChange}
            >
              <option value="">Select Shift</option>
              <option value="1st">1st Shift</option>
              <option value="2nd">2nd Shift</option>
              <option value="3rd">3rd Shift</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-1">
                Start Time
              </label>
              <input
                type="time"
                id="startTime"
                name="startTime"
                required
                className="form-input mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={formData.startTime}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-1">
                End Time
              </label>
              <input
                type="time"
                id="endTime"
                name="endTime"
                required
                className="form-input mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={formData.endTime}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Job Description
          </label>
          <textarea
            id="description"
            name="description"
            required
            rows={4}
            className="form-textarea mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the position responsibilities and requirements..."
          />
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Create Position
          </button>
        </div>
      </form>
    </div>
  );
}