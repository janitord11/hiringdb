import React, { useState } from 'react';

interface JobOpening {
  facility: string;
  positionTitle: string;
  payRate: string;
  description: string;
}

export default function JobOpeningForm() {
  const [formData, setFormData] = useState<JobOpening>({
    facility: '',
    positionTitle: '',
    payRate: '',
    description: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Job Opening Created:', {
      ...formData,
      dateOpened: new Date().toISOString(),
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Create New Job Opening</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label htmlFor="facility" className="block text-sm font-medium text-gray-700 mb-1">
              Facility
            </label>
            <select
              id="facility"
              name="facility"
              required
              className="form-select mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={formData.facility}
              onChange={handleChange}
            >
              <option value="">Select Facility</option>
              <option value="facility1">Main Office Building</option>
              <option value="facility2">Tech Center</option>
              <option value="facility3">Medical Plaza</option>
              <option value="facility4">Corporate Tower</option>
            </select>
          </div>

          <div>
            <label htmlFor="positionTitle" className="block text-sm font-medium text-gray-700 mb-1">
              Position Title
            </label>
            <input
              type="text"
              id="positionTitle"
              name="positionTitle"
              required
              className="form-input mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={formData.positionTitle}
              onChange={handleChange}
            />
          </div>
        </div>

        <div>
          <label htmlFor="payRate" className="block text-sm font-medium text-gray-700 mb-1">
            Pay Rate ($/hour)
          </label>
          <input
            type="number"
            id="payRate"
            name="payRate"
            required
            step="0.01"
            min="0"
            className="form-input mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={formData.payRate}
            onChange={handleChange}
          />
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