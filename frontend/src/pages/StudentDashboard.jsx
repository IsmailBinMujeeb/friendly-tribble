import { useEffect, useState } from "react";
import { Badge } from "../components/Badge";
import { Card } from "../components/Card";
import { StatCard } from "../components/StatCard";
import { api } from "../lib/api";
import { FiAward, FiBook, FiCheckCircle } from "react-icons/fi";

// ==================== Student Dashboard ====================
export const StudentDashboard = () => {
  const [stats, setStats] = useState({
    enrolledCourses: 0,
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
      <h1 className="text-3xl font-bold text-gray-900">Student Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          icon={FiBook}
          title="Enrolled Courses"
          value={stats.enrolledCourses}
          subtitle="Current semester"
          color="primary"
        />
        <StatCard
          icon={FiCheckCircle}
          title="Attendance"
          value="85%"
          subtitle="Overall"
          color="success"
        />
        <StatCard
          icon={FiAward}
          title="Average Grade"
          value="B+"
          subtitle="Current semester"
          color="info"
        />
      </div>

      <Card title="My Courses">
        {stats.courses.length > 0 ? (
          <div className="grid gap-4">
            {stats.courses.map((enrollment) => (
              <div
                key={enrollment._id}
                className="border border-gray-200 rounded-lg p-4"
              >
                <h3 className="font-semibold text-lg">
                  {enrollment.courseId?.courseName}
                </h3>
                <p className="text-sm text-gray-600">
                  {enrollment.courseId?.courseCode}
                </p>
                <Badge variant="primary" className="mt-2">
                  {enrollment.status}
                </Badge>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No courses enrolled</p>
        )}
      </Card>
    </div>
  );
};
