import React, { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import { useDb } from '../../lib/db';
import { queries } from '../../lib/queries';

interface Facility {
  id: number;
  name: string;
}

export default function FacilityManager() {
  const db = useDb();
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [newFacility, setNewFacility] = useState('');

  useEffect(() => {
    if (db) {
      loadFacilities();
    }
  }, [db]);

  const loadFacilities = () => {
    if (!db) return;
    const results = queries.getFacilities(db);
    setFacilities(results);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!db || !newFacility.trim()) return;

    queries.addFacility(db, newFacility.trim());
    setNewFacility('');
    loadFacilities();
  };

  const handleDelete = (id: number) => {
    if (!db) return;
    queries.deleteFacility(db, id);
    loadFacilities();
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex gap-4">
          <input
            type="text"
            value={newFacility}
            onChange={(e) => setNewFacility(e.target.value)}
            placeholder="Enter facility name"
            className="flex-1 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Add Facility
          </button>
        </div>
      </form>

      <ul className="space-y-2">
        {facilities.map((facility) => (
          <li
            key={`facility-${facility.id}`}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <span>{facility.name}</span>
            <button
              onClick={() => handleDelete(facility.id)}
              className="text-red-600 hover:text-red-800"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}