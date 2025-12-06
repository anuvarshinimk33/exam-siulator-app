import React, { useEffect, useState } from 'react';
import { db } from '../services/mockDb';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, BookOpen, GraduationCap, Activity } from 'lucide-react';

export const AdminDashboard = () => {
  const [stats, setStats] = useState({
    users: 124,
    subjects: 0,
    exams: 0,
    apiCalls: 1450
  });

  useEffect(() => {
    setStats({
      users: 124,
      subjects: db.getSubjects().length,
      exams: db.getExams().length,
      apiCalls: 1450
    });
  }, []);

  const usageData = [
    { name: 'Mon', calls: 120 },
    { name: 'Tue', calls: 230 },
    { name: 'Wed', calls: 180 },
    { name: 'Thu', calls: 290 },
    { name: 'Fri', calls: 340 },
    { name: 'Sat', calls: 110 },
    { name: 'Sun', calls: 180 },
  ];

  const StatCard = ({ icon: Icon, label, value, color }: any) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">{label}</p>
          <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon size={24} className="text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-800">System Administration</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard icon={Users} label="Total Users" value={stats.users} color="bg-blue-500" />
        <StatCard icon={BookOpen} label="Active Subjects" value={stats.subjects} color="bg-indigo-500" />
        <StatCard icon={GraduationCap} label="Total Exams" value={stats.exams} color="bg-purple-500" />
        <StatCard icon={Activity} label="AI Generations" value={stats.apiCalls} color="bg-pink-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Gemini AI Model Usage</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={usageData}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '8px', border: 'none'}} />
                <Bar dataKey="calls" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-6">System Health</h3>
          <div className="space-y-4">
             <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-3">
                   <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                   <span className="font-medium text-green-700">API Status</span>
                </div>
                <span className="text-sm text-green-600">Operational</span>
             </div>
             <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-3">
                   <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                   <span className="font-medium text-green-700">Database</span>
                </div>
                <span className="text-sm text-green-600">Connected</span>
             </div>
             <div className="p-4 bg-gray-50 rounded-lg mt-4">
               <h4 className="font-medium text-gray-800 mb-2">Latest Action Log</h4>
               <ul className="text-sm text-gray-500 space-y-2">
                 <li>• User Alex started SAT Math exam</li>
                 <li>• Admin updated Physics topics</li>
                 <li>• System backup completed successfully</li>
               </ul>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
