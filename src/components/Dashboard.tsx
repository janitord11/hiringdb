import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Building, Briefcase } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useDb } from '../lib/db';
import { queries } from '../lib/queries';

export default function Dashboard() {
  const navigate = useNavigate();
  const db = useDb();

  const { data: facilityCount = 0 } = useQuery({
    queryKey: ['facilityCount'],
    queryFn: () => queries.getFacilityCount(db),
    enabled: !!db
  });

  const { data: openPositions = [] } = useQuery({
    queryKey: ['openPositions'],
    queryFn: () => queries.getJobOpenings(db),
    enabled: !!db
  });

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Hello, Managers!</h2>
        <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed">
          We're thrilled to have you here. At District 11, excellence and innovation drive us every day—and it's all thanks to leaders like you. You're at the heart of making District 11 the very best, setting new standards and creating a positive impact in everything we do. Let's continue reaching new heights together!
        </p>
        <p className="text-blue-600 font-semibold mt-4">
          Welcome aboard to where success happens—District 11 part of Region 10 the best of the best!
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div
          onClick={() => navigate('/dashboard/positions/new')}
          className="bg-white overflow-hidden shadow rounded-lg cursor-pointer hover:shadow-md transition-shadow text-left"
        >
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <PlusCircle className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-lg font-medium text-gray-500 truncate">
                    Add Position
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      Create New
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <span className="font-medium text-blue-600 hover:text-blue-900 text-lg">
                Create position &rarr;
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5 flex flex-col items-center justify-center h-full">
            <div className="flex-shrink-0 mb-3">
              <Building className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-500 mb-2 text-center">
              Total Facilities
            </h3>
            <div className="text-4xl font-bold text-gray-900 text-center">
              {facilityCount}
            </div>
          </div>
        </div>

        <div
          onClick={() => navigate('/dashboard/reports')}
          className="bg-white overflow-hidden shadow rounded-lg cursor-pointer hover:shadow-md transition-shadow"
        >
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Briefcase className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-lg font-medium text-gray-500 truncate">
                    Open Positions
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {openPositions.length}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <span className="font-medium text-blue-600 hover:text-blue-900 text-lg">
                View positions &rarr;
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}