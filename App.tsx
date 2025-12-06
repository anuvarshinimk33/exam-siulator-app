import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { StudentDashboard } from './pages/StudentDashboard';
import { ExamSelect } from './pages/ExamSelect';
import { AdaptiveTest } from './pages/AdaptiveTest';
import { Flashcards } from './pages/Flashcards';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminSubjects } from './pages/AdminSubjects';
import { UserRole } from './types';

const PrivateRoute = ({ children, roles }: { children?: React.ReactNode, roles?: UserRole[] }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) return <div>Loading...</div>;

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to={user.role === UserRole.ADMIN ? '/admin' : '/dashboard'} />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/login" element={<Login />} />
            
            {/* Student Routes */}
            <Route path="/dashboard" element={
              <PrivateRoute roles={[UserRole.STUDENT]}>
                <StudentDashboard />
              </PrivateRoute>
            } />
             <Route path="/subjects" element={
              <PrivateRoute roles={[UserRole.STUDENT]}>
                <ExamSelect />
              </PrivateRoute>
            } />
            <Route path="/test" element={
              <PrivateRoute roles={[UserRole.STUDENT]}>
                <AdaptiveTest />
              </PrivateRoute>
            } />
            <Route path="/flashcards" element={
              <PrivateRoute roles={[UserRole.STUDENT]}>
                <Flashcards />
              </PrivateRoute>
            } />

            {/* Admin Routes */}
            <Route path="/admin" element={
              <PrivateRoute roles={[UserRole.ADMIN]}>
                <AdminDashboard />
              </PrivateRoute>
            } />
            <Route path="/admin/subjects" element={
              <PrivateRoute roles={[UserRole.ADMIN]}>
                <AdminSubjects />
              </PrivateRoute>
            } />
            
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;