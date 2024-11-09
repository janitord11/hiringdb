import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-8">
            <Building2 className="h-20 w-20 text-blue-600" />
          </div>
          
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            District 11
          </h1>
          
          <p className="text-xl text-gray-600 mb-12 leading-relaxed">
            Welcome to District 11's Job Management System. We're dedicated to maintaining excellence 
            in facility management and creating opportunities for growth and success.
          </p>

          <div className="grid gap-8 md:grid-cols-3 mb-12">
            <div className="bg-white rounded-xl p-6 text-gray-800 border border-gray-200 shadow-lg">
              <h3 className="text-xl font-semibold mb-2">Efficient Management</h3>
              <p className="text-gray-600">
                Streamlined job posting and application process for better resource allocation
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 text-gray-800 border border-gray-200 shadow-lg">
              <h3 className="text-xl font-semibold mb-2">Real-time Updates</h3>
              <p className="text-gray-600">
                Stay informed with instant updates on position status and applications
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 text-gray-800 border border-gray-200 shadow-lg">
              <h3 className="text-xl font-semibold mb-2">Data Insights</h3>
              <p className="text-gray-600">
                Comprehensive reporting tools to make informed decisions
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center px-8 py-4 text-lg font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-colors duration-150 shadow-lg"
          >
            Enter Management Portal
            <ArrowRight className="ml-2 h-6 w-6" />
          </button>
        </div>
      </div>

      <footer className="absolute bottom-0 w-full py-4 text-center text-gray-600">
        <p>© 2024 District 11. All rights reserved.</p>
      </footer>
    </div>
  );
}