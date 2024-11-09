import React, { useState } from 'react';
import FacilityManager from './FacilityManager';
import PositionManager from './PositionManager';
import PayRateManager from './PayRateManager';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('facilities');

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Admin Panel</h2>
        
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex space-x-8">
            {['facilities', 'positions', 'payrates'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-6">
          {activeTab === 'facilities' && <FacilityManager />}
          {activeTab === 'positions' && <PositionManager />}
          {activeTab === 'payrates' && <PayRateManager />}
        </div>
      </div>
    </div>
  );
}