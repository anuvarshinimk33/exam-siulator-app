import React, { useState, useEffect } from 'react';
import { db } from '../services/mockDb';
import { Subject, Exam } from '../types';
import { Plus, Trash2, Edit2, ChevronDown, ChevronRight, Save, X } from 'lucide-react';

export const AdminSubjects = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [isAddingSubject, setIsAddingSubject] = useState(false);
  const [newSubject, setNewSubject] = useState({ name: '', description: '' });
  
  // Refresh data
  const loadData = () => {
    setSubjects(db.getSubjects());
    setExams(db.getExams());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddSubject = () => {
    if (!newSubject.name) return;
    db.addSubject({ ...newSubject });
    setIsAddingSubject(false);
    setNewSubject({ name: '', description: '' });
    loadData();
  };

  const handleDeleteSubject = (id: string) => {
    if (confirm('Are you sure? This will delete all exams under this subject.')) {
      db.deleteSubject(id);
      loadData();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Manage Subjects & Exams</h1>
        <button 
          onClick={() => setIsAddingSubject(true)}
          className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus size={18} />
          <span>Add Subject</span>
        </button>
      </div>

      {isAddingSubject && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-indigo-100 animate-in fade-in slide-in-from-top-4">
          <h3 className="font-bold text-gray-800 mb-4">New Subject</h3>
          <div className="grid gap-4 mb-4">
            <input 
              type="text" 
              placeholder="Subject Name (e.g., Mathematics)" 
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={newSubject.name}
              onChange={e => setNewSubject({...newSubject, name: e.target.value})}
            />
            <input 
              type="text" 
              placeholder="Description" 
              className="w-full p-2 border border-gray-300 rounded-lg"
              value={newSubject.description}
              onChange={e => setNewSubject({...newSubject, description: e.target.value})}
            />
          </div>
          <div className="flex space-x-3">
            <button onClick={handleAddSubject} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium">Save Subject</button>
            <button onClick={() => setIsAddingSubject(false)} className="text-gray-500 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100">Cancel</button>
          </div>
        </div>
      )}

      <div className="grid gap-6">
        {subjects.map(subject => (
          <SubjectCard 
            key={subject.id} 
            subject={subject} 
            exams={exams.filter(e => e.subjectId === subject.id)}
            onDelete={() => handleDeleteSubject(subject.id)}
            onExamAdded={loadData}
            onExamDeleted={loadData}
          />
        ))}
      </div>
    </div>
  );
};

const SubjectCard = ({ subject, exams, onDelete, onExamAdded, onExamDeleted }: any) => {
  const [expanded, setExpanded] = useState(false);
  const [isAddingExam, setIsAddingExam] = useState(false);
  const [newExam, setNewExam] = useState({ name: '', description: '' });

  const handleAddExam = () => {
    if (!newExam.name) return;
    db.addExam({
      subjectId: subject.id,
      name: newExam.name,
      description: newExam.description,
      topics: []
    });
    setIsAddingExam(false);
    setNewExam({ name: '', description: '' });
    onExamAdded();
  };

  const handleDeleteExam = (id: string) => {
    db.deleteExam(id);
    onExamDeleted();
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div 
        className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center space-x-3">
          {expanded ? <ChevronDown size={20} className="text-gray-400" /> : <ChevronRight size={20} className="text-gray-400" />}
          <div>
            <h3 className="font-bold text-gray-800">{subject.name}</h3>
            <p className="text-sm text-gray-500">{exams.length} Exams available</p>
          </div>
        </div>
        <div className="flex items-center space-x-2" onClick={e => e.stopPropagation()}>
          <button onClick={onDelete} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-gray-100 bg-gray-50 p-4 space-y-4">
          {exams.map((exam: Exam) => (
             <div key={exam.id} className="bg-white p-3 rounded-lg border border-gray-200 flex justify-between items-center">
                <div>
                  <h4 className="font-semibold text-gray-800">{exam.name}</h4>
                  <p className="text-xs text-gray-500">{exam.description}</p>
                </div>
                <button onClick={() => handleDeleteExam(exam.id)} className="text-red-400 hover:text-red-600">
                  <X size={16} />
                </button>
             </div>
          ))}

          {isAddingExam ? (
             <div className="bg-white p-4 rounded-lg border border-indigo-200">
                <h4 className="text-sm font-bold text-gray-700 mb-2">New Exam</h4>
                <div className="grid gap-2 mb-2">
                   <input 
                      className="text-sm border p-2 rounded" 
                      placeholder="Exam Name" 
                      value={newExam.name}
                      onChange={e => setNewExam({...newExam, name: e.target.value})}
                   />
                   <input 
                      className="text-sm border p-2 rounded" 
                      placeholder="Description" 
                      value={newExam.description}
                      onChange={e => setNewExam({...newExam, description: e.target.value})}
                   />
                </div>
                <div className="flex space-x-2">
                  <button onClick={handleAddExam} className="text-xs bg-indigo-600 text-white px-3 py-1.5 rounded">Save</button>
                  <button onClick={() => setIsAddingExam(false)} className="text-xs bg-gray-200 text-gray-600 px-3 py-1.5 rounded">Cancel</button>
                </div>
             </div>
          ) : (
            <button 
              onClick={() => setIsAddingExam(true)}
              className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-indigo-500 hover:text-indigo-600 transition-colors flex items-center justify-center space-x-2"
            >
              <Plus size={16} />
              <span>Add Exam to {subject.name}</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
