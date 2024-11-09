import React, { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import { useDb } from '../../lib/db';
import { queries } from '../../lib/queries';

interface Position {
  id: number;
  title: string;
}

export default function PositionManager() {
  const db = useDb();
  const [positions, setPositions] = useState<Position[]>([]);
  const [newPosition, setNewPosition] = useState('');

  useEffect(() => {
    if (db) {
      loadPositions();
    }
  }, [db]);

  const loadPositions = () => {
    if (!db) return;
    const results = queries.getPositions(db);
    setPositions(results);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!db || !newPosition.trim()) return;

    queries.addPosition(db, newPosition.trim());
    setNewPosition('');
    loadPositions();
  };

  const handleDelete = (id: number) => {
    if (!db) return;
    queries.deletePosition(db, id);
    loadPositions();
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex gap-4">
          <input
            type="text"
            value={newPosition}
            onChange={(e) => setNewPosition(e.target.value)}
            placeholder="Enter position title"
            className="flex-1 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Add Position
          </button>
        </div>
      </form>

      <ul className="space-y-2">
        {positions.map((position) => (
          <li
            key={`position-${position.id}`}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <span>{position.title}</span>
            <button
              onClick={() => handleDelete(position.id)}
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