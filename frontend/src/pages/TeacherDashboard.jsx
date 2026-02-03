import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { StatCard } from "../components/StatCard";
import { Card } from "../components/Card";
import { FiBook, FiUsers } from "react-icons/fi";

// ==================== Teacher Dashboard ====================
export const TeacherDashboard = () => {
  const [stats, setStats] = useState({
    myCourses: 0,
    totalStudents: 0,
    courses: [],
    recentAnnouncements: [],
  });

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const { data } = await api.get("/reports/dashboard");
      setStats(data.data);
    } catch (error) {
      console.error("Failed to fetch dashboard:", error);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Teacher Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatCard
          icon={FiBook}
          title="My Courses"
          value={stats.myCourses}
          subtitle="Active courses"
          color="primary"
        />
        <StatCard
          icon={FiUsers}
          title="Total Students"
          value={stats.totalStudents}
          subtitle="Enrolled students"
          color="success"
        />
      </div>

      <Card title="My Courses">
        {stats.courses.length > 0 ? (
          <div className="grid gap-4">
            {stats.courses.map((course) => (
              <div
                key={course._id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <h3 className="font-semibold text-lg">{course.courseName}</h3>
                <p className="text-sm text-gray-600">
                  {course.courseCode} • Grade {course.grade}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  {course.enrolledStudents.length} students enrolled
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No courses assigned</p>
        )}
      </Card>
    </div>
  );
};
