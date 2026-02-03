import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./index.css";
import { AuthProvider } from "./context/authContext";
import { ProtectedRoute } from "./components/Protected";
import { AdminDashboard } from "./pages/AdminDashboard";
import { StudentsList } from "./pages/StudentList";
import { StudentDashboard } from "./pages/StudentDashboard";
import { TeacherDashboard } from "./pages/TeacherDashboard";
import { LoginPage } from "./pages/Login";
import { TeachersList } from "./pages/TeachersList";
import { CoursesList } from "./pages/CoursesList";
import { EnrollmentsPage } from "./pages/Enrollments";
import { AnnouncementsPage } from "./pages/Announcements";
import { ReportsPage } from "./pages/Reports";
import { TeacherCourses } from "./pages/TeacherMyCourses";
import { TeacherAttendance } from "./pages/Attendance";
import { TeacherGrades } from "./pages/TeacherGrades";
import { StudentCourses } from "./pages/StudentMyCourses";
import { StudentAttendance } from "./pages/StudentAttendance";
import { StudentGrades } from "./pages/StudentMyGrades";
import { ProfilePage } from "./pages/ProfilePage";
import { NewCourseForm } from "./pages/NewCourse";
import { NewTeacherForm } from "./pages/NewTeacher";
import { NewStudentForm } from "./pages/NewStudent";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/students"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <StudentsList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/teachers"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <TeachersList />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/courses"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <CoursesList />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/enrollments"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <EnrollmentsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/announcements"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AnnouncementsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/reports"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <ReportsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/teacher/dashboard"
            element={
              <ProtectedRoute allowedRoles={["teacher"]}>
                <TeacherDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/teacher/courses"
            element={
              <ProtectedRoute allowedRoles={["teacher"]}>
                <TeacherCourses />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher/attendance"
            element={
              <ProtectedRoute allowedRoles={["teacher"]}>
                <TeacherAttendance />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher/grades"
            element={
              <ProtectedRoute allowedRoles={["teacher"]}>
                <TeacherGrades />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/dashboard"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/courses"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <StudentCourses />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/attendance"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <StudentAttendance />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/grades"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <StudentGrades />
              </ProtectedRoute>
            }
          />

          {/* Shared route for all roles */}
          <Route
            path="/announcements"
            element={
              <ProtectedRoute allowedRoles={["admin", "teacher", "student"]}>
                <AnnouncementsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/students/new"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <NewStudentForm />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/teachers/new"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <NewTeacherForm />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/courses/new"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <NewCourseForm />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute allowedRoles={["admin", "teacher", "student"]}>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
