import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DbProvider } from './components/DbProvider';
import { AuthProvider } from './lib/auth/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import AdminPanel from './components/admin/AdminPanel';
import NewPosition from './components/positions/NewPosition';
import Reports from './components/reports/Reports';
import Header from './components/Header';
import Login from './components/auth/Login';
import ProtectedRoute from './components/auth/ProtectedRoute';
import PositionDetails from './components/admin/PositionDetails';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5000,
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <DbProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<Header />}>
                  <Route index element={<Dashboard />} />
                  <Route path="positions">
                    <Route path="new" element={<NewPosition />} />
                    <Route path=":id" element={<ProtectedRoute><PositionDetails /></ProtectedRoute>} />
                  </Route>
                  <Route path="reports" element={<Reports />} />
                  <Route path="admin" element={<ProtectedRoute><AdminPanel /></ProtectedRoute>} />
                </Route>
              </Routes>
            </BrowserRouter>
          </DbProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;