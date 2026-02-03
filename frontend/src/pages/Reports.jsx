import { FiBook, FiCalendar, FiUsers } from "react-icons/fi";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { api } from "../lib/api";
import { useEffect, useState } from "react";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { format } from "date-fns";

export const ReportsPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reportType, setReportType] = useState("overview");

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [dashRes, studentsRes, teachersRes, coursesRes, enrollmentsRes] =
        await Promise.all([
          api.get("/reports/dashboard"),
          api.get("/students?limit=100"),
          api.get("/teachers?limit=100"),
          api.get("/courses?limit=100"),
          api.get("/enrollments"),
        ]);

      setStats({
        dashboard: dashRes.data.data,
        students: studentsRes.data.data,
        teachers: teachersRes.data.data,
        courses: coursesRes.data.data,
        enrollments: enrollmentsRes.data.data,
      });
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  const gradeDistribution = stats.students.reduce((acc, student) => {
    acc[student.grade] = (acc[student.grade] || 0) + 1;
    return acc;
  }, {});

  const departmentDistribution = stats.teachers.reduce((acc, teacher) => {
    acc[teacher.department] = (acc[teacher.department] || 0) + 1;
    return acc;
  }, {});

  const enrollmentStatus = stats.enrollments.reduce((acc, enrollment) => {
    acc[enrollment.status] = (acc[enrollment.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Reports & Analytics
        </h1>
        <p className="text-gray-600 mt-1">
          System-wide statistics and insights
        </p>
      </div>

      <div className="flex gap-2">
        {["overview", "students", "teachers", "courses"].map((type) => (
          <Button
            key={type}
            variant={reportType === type ? "primary" : "outline"}
            onClick={() => setReportType(type)}
            className="capitalize"
          >
            {type}
          </Button>
        ))}
      </div>

      {reportType === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="text-center">
              <FiUsers className="mx-auto text-primary-600 mb-2" size={32} />
              <p className="text-gray-600 text-sm">Total Students</p>
              <p className="text-3xl font-bold text-gray-900">
                {stats.students.length}
              </p>
            </Card>
            <Card className="text-center">
              <FiUsers className="mx-auto text-green-600 mb-2" size={32} />
              <p className="text-gray-600 text-sm">Total Teachers</p>
              <p className="text-3xl font-bold text-gray-900">
                {stats.teachers.length}
              </p>
            </Card>
            <Card className="text-center">
              <FiBook className="mx-auto text-blue-600 mb-2" size={32} />
              <p className="text-gray-600 text-sm">Total Courses</p>
              <p className="text-3xl font-bold text-gray-900">
                {stats.courses.length}
              </p>
            </Card>
            <Card className="text-center">
              <FiCalendar className="mx-auto text-purple-600 mb-2" size={32} />
              <p className="text-gray-600 text-sm">Total Enrollments</p>
              <p className="text-3xl font-bold text-gray-900">
                {stats.enrollments.length}
              </p>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card title="Students by Grade">
              <div className="space-y-3">
                {Object.entries(gradeDistribution)
                  .sort()
                  .map(([grade, count]) => (
                    <div key={grade}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium">Grade {grade}</span>
                        <span className="text-gray-600">{count} students</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-primary-600 h-2 rounded-full"
                          style={{
                            width: `${(count / stats.students.length) * 100}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
              </div>
            </Card>

            <Card title="Teachers by Department">
              <div className="space-y-3">
                {Object.entries(departmentDistribution).map(([dept, count]) => (
                  <div key={dept}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium">{dept}</span>
                      <span className="text-gray-600">{count} teachers</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{
                          width: `${(count / stats.teachers.length) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <Card title="Enrollment Status">
            <div className="grid grid-cols-3 gap-4">
              {Object.entries(enrollmentStatus).map(([status, count]) => (
                <div
                  key={status}
                  className="text-center p-4 bg-gray-50 rounded-lg"
                >
                  <p className="text-sm text-gray-600 capitalize mb-1">
                    {status}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">{count}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {((count / stats.enrollments.length) * 100).toFixed(1)}%
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {reportType === "students" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="text-center">
            <p className="text-gray-600 text-sm">Active Students</p>
            <p className="text-3xl font-bold text-green-600">
              {stats.students.filter((s) => s.isActive).length}
            </p>
          </Card>
          <Card className="text-center">
            <p className="text-gray-600 text-sm">Inactive Students</p>
            <p className="text-3xl font-bold text-red-600">
              {stats.students.filter((s) => !s.isActive).length}
            </p>
          </Card>
          <Card className="text-center">
            <p className="text-gray-600 text-sm">Avg. Enrollments</p>
            <p className="text-3xl font-bold text-blue-600">
              {stats.students.length > 0
                ? (
                    stats.enrollments.filter((e) => e.status === "enrolled")
                      .length / stats.students.length
                  ).toFixed(1)
                : 0}
            </p>
          </Card>
        </div>
      )}

      {reportType === "teachers" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="text-center">
            <p className="text-gray-600 text-sm">Active Teachers</p>
            <p className="text-3xl font-bold text-green-600">
              {stats.teachers.filter((t) => t.isActive).length}
            </p>
          </Card>
          <Card className="text-center">
            <p className="text-gray-600 text-sm">Avg. Experience</p>
            <p className="text-3xl font-bold text-blue-600">
              {stats.teachers.length > 0
                ? (
                    stats.teachers.reduce(
                      (sum, t) => sum + (t.experience || 0),
                      0,
                    ) / stats.teachers.length
                  ).toFixed(1)
                : 0}{" "}
              years
            </p>
          </Card>
          <Card className="text-center">
            <p className="text-gray-600 text-sm">Departments</p>
            <p className="text-3xl font-bold text-purple-600">
              {Object.keys(departmentDistribution).length}
            </p>
          </Card>
        </div>
      )}

      {reportType === "courses" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="text-center">
            <p className="text-gray-600 text-sm">Active Courses</p>
            <p className="text-3xl font-bold text-green-600">
              {stats.courses.filter((c) => c.isActive).length}
            </p>
          </Card>
          <Card className="text-center">
            <p className="text-gray-600 text-sm">Avg. Capacity Filled</p>
            <p className="text-3xl font-bold text-blue-600">
              {stats.courses.length > 0
                ? Math.round(
                    stats.courses.reduce(
                      (sum, c) =>
                        sum +
                        ((c.enrolledStudents?.length || 0) / c.capacity) * 100,
                      0,
                    ) / stats.courses.length,
                  )
                : 0}
              %
            </p>
          </Card>
          <Card className="text-center">
            <p className="text-gray-600 text-sm">Total Credits</p>
            <p className="text-3xl font-bold text-purple-600">
              {stats.courses.reduce((sum, c) => sum + (c.credits || 0), 0)}
            </p>
          </Card>
        </div>
      )}
    </div>
  );
};
