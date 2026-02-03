import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { format } from "date-fns";
import { StatCard } from "../components/StatCard";
import { Card } from "../components/Card";
import { FiBook, FiUsers } from "react-icons/fi";

// ==================== Admin Dashboard ====================
export const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    totalCourses: 0,
    recentAnnouncements: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const { data } = await api.get("/reports/dashboard");
      setStats(data.data);
    } catch (error) {
      console.error("Failed to fetch dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-full">Loading...</div>
    );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Overview of your school management system
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          icon={FiUsers}
          title="Total Students"
          value={stats.totalStudents}
          subtitle="Active students"
          color="primary"
        />
        <StatCard
          icon={FiUsers}
          title="Total Teachers"
          value={stats.totalTeachers}
          subtitle="Active faculty"
          color="success"
        />
        <StatCard
          icon={FiBook}
          title="Total Courses"
          value={stats.totalCourses}
          subtitle="Active courses"
          color="info"
        />
      </div>

      <Card title="Recent Announcements">
        {stats.recentAnnouncements.length > 0 ? (
          <div className="space-y-3">
            {stats.recentAnnouncements.map((announcement) => (
              <div
                key={announcement._id}
                className="border-l-4 border-primary-500 pl-4 py-2"
              >
                <h4 className="font-medium text-gray-900">
                  {announcement.title}
                </h4>
                <p className="text-sm text-gray-600 mt-1">
                  {announcement.content.substring(0, 100)}...
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  {format(new Date(announcement.createdAt), "PPp")}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No announcements</p>
        )}
      </Card>
    </div>
  );
};
