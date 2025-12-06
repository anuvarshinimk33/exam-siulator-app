import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { 
  LayoutDashboard, 
  BookOpen, 
  GraduationCap, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  BrainCircuit,
  Layers,
  Users
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export const Layout = ({ children }: { children?: React.ReactNode }) => {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  if (!user) {
    return <>{children}</>;
  }

  const isActive = (path: string) => location.pathname === path;

  const NavItem = ({ to, icon: Icon, label }: { to: string, icon: any, label: string }) => (
    <Link
      to={to}
      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
        isActive(to) 
          ? 'bg-indigo-600 text-white shadow-md' 
          : 'text-gray-600 hover:bg-indigo-50 hover:text-indigo-600'
      }`}
      onClick={() => setIsMobileMenuOpen(false)}
    >
      <Icon size={20} />
      <span className="font-medium">{label}</span>
    </Link>
  );

  const StudentNav = () => (
    <>
      <NavItem to="/dashboard" icon={LayoutDashboard} label="Dashboard" />
      <NavItem to="/subjects" icon={BookOpen} label="Practice Exams" />
      <NavItem to="/flashcards" icon={Layers} label="Flashcards" />
      <NavItem to="/profile" icon={Settings} label="Profile" />
    </>
  );

  const AdminNav = () => (
    <>
      <NavItem to="/admin" icon={LayoutDashboard} label="Overview" />
      <NavItem to="/admin/subjects" icon={BookOpen} label="Subjects" />
      <NavItem to="/admin/exams" icon={GraduationCap} label="Exams" />
      <NavItem to="/admin/users" icon={Users} label="Users" />
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 fixed h-full z-10">
        <div className="flex items-center space-x-2 px-6 py-6 border-b border-gray-100">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <BrainCircuit className="text-white" size={20} />
          </div>
          <span className="text-xl font-bold text-gray-800">ExamGenie</span>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {user.role === UserRole.ADMIN ? <AdminNav /> : <StudentNav />}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button 
            onClick={logout}
            className="flex items-center space-x-3 px-4 py-3 w-full text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed w-full bg-white border-b border-gray-200 z-20 flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <BrainCircuit className="text-white" size={20} />
          </div>
          <span className="font-bold text-gray-800">ExamGenie</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-600">
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-gray-800 bg-opacity-50 z-30" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="bg-white w-64 h-full shadow-xl p-4" onClick={e => e.stopPropagation()}>
             <nav className="space-y-2 mt-12">
              {user.role === UserRole.ADMIN ? <AdminNav /> : <StudentNav />}
              <button 
                onClick={logout}
                className="flex items-center space-x-3 px-4 py-3 w-full text-gray-600 hover:text-red-600 mt-8"
              >
                <LogOut size={20} />
                <span>Sign Out</span>
              </button>
            </nav>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-4 md:p-8 mt-14 md:mt-0 overflow-y-auto h-screen">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};