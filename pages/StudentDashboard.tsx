import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../services/mockDb';
import { ExamResult } from '../types';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar 
} from 'recharts';
import { Clock, TrendingUp, Award, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const StudentDashboard = () => {
  const { user } = useAuth();
  const [results, setResults] = useState<ExamResult[]>([]);

  useEffect(() => {
    setResults(db.getResults());
  }, []);

  const recentActivity = results.slice(0, 5);
  
  // Chart Data Preparation
  const performanceData = results.map((r, i) => ({
    name: `Test ${i + 1}`,
    score: (r.score / r.totalQuestions) * 100,
    date: new Date(r.date).toLocaleDateString()
  })).reverse();

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Hello, {user?.name.split(' ')[0]}! 👋</h1>
          <p className="text-gray-500 mt-1">Ready to ace your next exam?</p>
        </div>
        <Link 
          to="/subjects" 
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-colors shadow-lg shadow-indigo-200 flex items-center space-x-2"
        >
          <span>Start New Exam</span>
          <ArrowRight size={18} />
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-green-100 text-green-600 rounded-lg">
              <TrendingUp size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Average Score</p>
              <h3 className="text-2xl font-bold text-gray-800">
                {results.length > 0 
                  ? Math.round(results.reduce((acc, curr) => acc + (curr.score / curr.totalQuestions) * 100, 0) / results.length) 
                  : 0}%
              </h3>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
              <Clock size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Tests Taken</p>
              <h3 className="text-2xl font-bold text-gray-800">{results.length}</h3>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
              <Award size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Mastery Level</p>
              <h3 className="text-2xl font-bold text-gray-800">Intermediate</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Performance Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#4f46e5" 
                  strokeWidth={3} 
                  dot={{r: 4, fill: '#4f46e5', strokeWidth: 2, stroke: '#fff'}} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Recent Exams</h3>
          <div className="space-y-4">
            {recentActivity.length === 0 ? (
              <p className="text-gray-400 text-center py-4">No exams taken yet.</p>
            ) : (
              recentActivity.map((result) => (
                <div key={result.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-gray-100">
                  <div>
                    <h4 className="font-medium text-gray-800">{result.examName}</h4>
                    <p className="text-xs text-gray-500">{new Date(result.date).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-sm font-bold ${(result.score/result.totalQuestions) > 0.7 ? 'text-green-600' : 'text-orange-500'}`}>
                      {Math.round((result.score/result.totalQuestions)*100)}%
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
