import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Toaster } from '@/components/ui/sonner';
import { Landing } from '@/pages/Landing';
import { Login } from '@/pages/Login';
import { Register } from '@/pages/Register';
import { StudentDashboard } from '@/pages/StudentDashboard';
import { Courses } from '@/pages/Courses';
import { CourseDetail } from '@/pages/CourseDetail';
import { LessonViewer } from '@/pages/LessonViewer';
import { Profile } from '@/pages/Profile';
import { AdminDashboard } from '@/pages/AdminDashboard';
import { AdminCourseManagement } from '@/pages/AdminCourseManagement';
import { AdminUserManagement } from '@/pages/AdminUserManagement';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/courses/:id" element={<CourseDetail />} />

              <Route
                path="/courses/:courseId/lessons/:lessonId"
                element={
                  <ProtectedRoute>
                    <LessonViewer />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <StudentDashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin"
                element={
                  <ProtectedRoute requireAdmin>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/courses"
                element={
                  <ProtectedRoute requireAdmin>
                    <AdminCourseManagement />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/users"
                element={
                  <ProtectedRoute requireAdmin>
                    <AdminUserManagement />
                  </ProtectedRoute>
                }
              />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
          <Toaster position="top-right" richColors />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
