import React from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { BrainCircuit, ShieldCheck, GraduationCap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (role: UserRole) => {
    login(role);
    if (role === UserRole.ADMIN) {
      navigate('/admin');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-indigo-600 p-8 text-center">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4">
            <BrainCircuit className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">ExamGenie</h1>
          <p className="text-indigo-100">Smart AI-Powered Test Prep</p>
        </div>

        <div className="p-8 space-y-6">
          <div className="text-center mb-8">
            <h2 className="text-xl font-semibold text-gray-800">Welcome Back</h2>
            <p className="text-gray-500 text-sm">Select a role to continue (Demo Mode)</p>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => handleLogin(UserRole.STUDENT)}
              className="w-full flex items-center p-4 border border-gray-200 rounded-xl hover:border-indigo-500 hover:bg-indigo-50 transition-all group"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <GraduationCap size={24} />
              </div>
              <div className="ml-4 text-left">
                <p className="font-semibold text-gray-800">Student</p>
                <p className="text-sm text-gray-500">Take exams & study flashcards</p>
              </div>
            </button>

            <button
              onClick={() => handleLogin(UserRole.ADMIN)}
              className="w-full flex items-center p-4 border border-gray-200 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition-all group"
            >
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                <ShieldCheck size={24} />
              </div>
              <div className="ml-4 text-left">
                <p className="font-semibold text-gray-800">Admin</p>
                <p className="text-sm text-gray-500">Manage subjects & users</p>
              </div>
            </button>
          </div>

          <div className="text-center mt-6">
             <p className="text-xs text-gray-400">
               Powered by Google Gemini 2.5 Flash
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};
