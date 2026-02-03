import { useEffect, useState } from "react";
import { api } from "../lib/api";
import {
  FiAlertCircle,
  FiCalendar,
  FiCheckCircle,
  FiXCircle,
} from "react-icons/fi";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { Card } from "../components/Card";
import { Badge } from "../components/Badge";
import { format } from "date-fns";

export const StudentAttendance = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [attendance, setAttendance] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEnrollments();
  }, []);

  useEffect(() => {
    if (selectedCourse) {
      fetchAttendance();
    }
  }, [selectedCourse]);

  const fetchEnrollments = async () => {
    try {
      const { data: userData } = await api.get("/auth/me");
      const studentId = userData.data.roleData._id;

      const { data } = await api.get(
        `/enrollments?studentId=${studentId}&status=enrolled`,
      );
      setEnrollments(data.data);

      if (data.data.length > 0) {
        setSelectedCourse(data.data[0].courseId._id);
      }
    } catch (error) {
      console.error("Failed to fetch enrollments:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAttendance = async () => {
    try {
      const { data: userData } = await api.get("/auth/me");
      const studentId = userData.data.roleData._id;

      // Get attendance records
      const { data: attData } = await api.get(
        `/attendance?courseId=${selectedCourse}&studentId=${studentId}`,
      );
      setAttendance(attData.data);

      // Get summary
      const { data: summaryData } = await api.get(
        `/attendance/summary?courseId=${selectedCourse}&studentId=${studentId}`,
      );
      setSummary(summaryData.data);
    } catch (error) {
      console.error("Failed to fetch attendance:", error);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "present":
        return <FiCheckCircle className="text-green-600" />;
      case "absent":
        return <FiXCircle className="text-red-600" />;
      case "late":
        return <FiAlertCircle className="text-yellow-600" />;
      case "excused":
        return <FiCheckCircle className="text-blue-600" />;
      default:
        return null;
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Attendance</h1>
        <p className="text-gray-600 mt-1">View your attendance records</p>
      </div>

      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card className="text-center bg-gradient-to-br from-primary-50 to-primary-100">
            <p className="text-sm text-gray-600 mb-1">Attendance Rate</p>
            <p className="text-3xl font-bold text-primary-600">
              {summary.percentage}%
            </p>
          </Card>

          {summary.statusCounts?.map((stat) => (
            <Card key={stat._id} className="text-center">
              <p className="text-sm text-gray-600 mb-1 capitalize">
                {stat._id}
              </p>
              <p className="text-2xl font-bold text-gray-900">{stat.count}</p>
            </Card>
          ))}
        </div>
      )}

      <Card>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Course
          </label>
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">Choose a course...</option>
            {enrollments.map((e) => (
              <option key={e._id} value={e.courseId._id}>
                {e.courseId.courseName} ({e.courseId.courseCode})
              </option>
            ))}
          </select>
        </div>

        {selectedCourse && attendance.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Remarks
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {attendance.map((record) => (
                  <tr key={record._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {format(new Date(record.date), "MMM dd, yyyy")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(record.status)}
                        <Badge
                          variant={
                            record.status === "present"
                              ? "success"
                              : record.status === "absent"
                                ? "danger"
                                : record.status === "late"
                                  ? "warning"
                                  : "info"
                          }
                        >
                          {record.status}
                        </Badge>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {record.remarks || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : selectedCourse ? (
          <div className="text-center py-12">
            <FiAlertCircle className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-500">No attendance records yet</p>
          </div>
        ) : (
          <div className="text-center py-12">
            <FiCalendar className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-500">
              Please select a course to view attendance
            </p>
          </div>
        )}
      </Card>
    </div>
  );
};
