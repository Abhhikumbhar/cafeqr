import React, { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from '../common/Sidebar';
import Header from '../common/Header';
import ToastContainer from '../common/ToastContainer';
import { useAuth } from '../../context/AuthContext';

export default function AdminLayout() {
  const { isAuthenticated } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Protected route check
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="min-h-screen bg-[#F8F5F0] text-[#241A14] flex flex-col font-sans">
      {/* Toast notifications */}
      <ToastContainer />

      {/* Sidebar (Desktop fixed + Mobile offcanvas) */}
      <Sidebar
        mobileOpen={mobileSidebarOpen}
        closeMobileSidebar={() => setMobileSidebarOpen(false)}
      />

      {/* Main Area: lg:ml-64 */}
      <div className="flex-1 flex flex-col lg:pl-64 transition-all">
        <Header toggleMobileSidebar={() => setMobileSidebarOpen(prev => !prev)} />
        
        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
