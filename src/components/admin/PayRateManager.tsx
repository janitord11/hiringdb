import React, { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import { useDb } from '../../lib/db';
import { queries } from '../../lib/queries';

interface Position {
  id: number;
  title: string;
}

interface PayRate {
  id: number;
  rate: number;
}

export default function PayRateManager() {
  const db = useDb();
  const [positions, setPositions] = useState<Position[]>([]);
  const [selectedPosition, setSelectedPosition] = useState<string>('');
  const [payRates, setPayRates] = useState<PayRate[]>([]);
  const [newRate, setNewRate] = useState<string>('');

  useEffect(() => {
    if (db) {
      loadPositions();
    }
  }, [db]);

  useEffect(() => {
    if (db && selectedPosition) {
      loadPayRates();
    }
  }, [db, selectedPosition]);

  const loadPositions = () => {
    if (!db) return;
    const results = queries.getPositions(db);
    setPositions(results);
  };

  const loadPayRates = () => {
    if (!db || !selectedPosition) return;
    const results = queries.getPayRates(db, parseInt(selectedPosition, 10));
    setPayRates(results);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!db || !selectedPosition || !newRate) return;

    queries.addPayRate(db, parseInt(selectedPosition, 10), parseFloat(newRate));
    setNewRate('');
    loadPayRates();
  };

  const handleDelete = (id: number) => {
    if (!db) return;
    queries.deletePayRate(db, id);
    loadPayRates();
  };

  return (
    <div>
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Position
        </label>
        <select
          value={selectedPosition}
          onChange={(e) => setSelectedPosition(e.target.value)}
          className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option key="default" value="">Select a position</option>
          {positions.map((position) => (
            <option key={`position-${position.id}`} value={position.id}>
              {position.title}
            </option>
          ))}
        </select>
      </div>

      {selectedPosition && (
        <>
          <form onSubmit={handleSubmit} className="mb-6">
            <div className="flex gap-4">
              <input
                type="number"
                step="0.01"
                min="0"
                value={newRate}
                onChange={(e) => setNewRate(e.target.value)}
                placeholder="Enter pay rate"
                className="flex-1 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Add Pay Rate
              </button>
            </div>
          </form>

          <ul className="space-y-2">
            {payRates.map((rate) => (
              <li
                key={`rate-${rate.id}`}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <span>${rate.rate.toFixed(2)}/hour</span>
                <button
                  onClick={() => handleDelete(rate.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}