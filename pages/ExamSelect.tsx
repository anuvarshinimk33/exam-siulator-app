import React, { useState, useEffect } from 'react';
import { db } from '../services/mockDb';
import { Subject, Exam } from '../types';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Book } from 'lucide-react';

export const ExamSelect = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    setSubjects(db.getSubjects());
    setExams(db.getExams());
  }, []);

  const filteredExams = selectedSubject 
    ? exams.filter(e => e.subjectId === selectedSubject) 
    : [];

  const startExam = (exam: Exam) => {
    navigate('/test', { 
      state: { 
        examName: exam.name, 
        topicName: exam.topics[0] || 'General' 
      } 
    });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Select an Exam</h1>
      
      {!selectedSubject ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map(subject => (
            <div 
              key={subject.id}
              onClick={() => setSelectedSubject(subject.id)}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 cursor-pointer hover:border-indigo-500 hover:shadow-md transition-all group"
            >
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <Book size={24} />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">{subject.name}</h3>
              <p className="text-gray-500 text-sm mb-4">{subject.description}</p>
              <div className="flex items-center text-indigo-600 font-medium text-sm">
                <span>View Exams</span>
                <ChevronRight size={16} className="ml-1" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          <button 
            onClick={() => setSelectedSubject(null)}
            className="text-gray-500 hover:text-gray-800 flex items-center mb-4"
          >
            ← Back to Subjects
          </button>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredExams.map(exam => (
              <div key={exam.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-2">{exam.name}</h3>
                <p className="text-gray-500 text-sm mb-4">{exam.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {exam.topics.map(topic => (
                    <span key={topic} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                      {topic}
                    </span>
                  ))}
                </div>

                <button 
                  onClick={() => startExam(exam)}
                  className="w-full bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                >
                  Start Adaptive Test
                </button>
              </div>
            ))}
          </div>
          {filteredExams.length === 0 && (
             <p className="text-gray-500 text-center py-8">No exams available for this subject yet.</p>
          )}
        </div>
      )}
    </div>
  );
};
