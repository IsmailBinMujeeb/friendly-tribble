import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { Card } from "../components/Card";
import { Badge } from "../components/Badge";
import { FiBook, FiCalendar, FiUsers } from "react-icons/fi";
import { Button } from "../components/Button";
import { Modal } from "../components/Modal";
import { LoadingSpinner } from "../components/LoadingSpinner";

export const TeacherCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showStudentsModal, setShowStudentsModal] = useState(false);
  const [students, setStudents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyCourses();
  }, []);

  const fetchMyCourses = async () => {
    try {
      // Get teacher ID first
      const { data: userData } = await api.get("/auth/me");
      const teacherId = userData.data.roleData._id;

      // Get courses taught by this teacher
      const { data } = await api.get(`/courses?teacherId=${teacherId}`);
      setCourses(data.data);
    } catch (error) {
      console.error("Failed to fetch courses:", error);
    } finally {
      setLoading(false);
    }
  };

  const viewStudents = async (course) => {
    setSelectedCourse(course);
    try {
      // Get enrolled students for this course
      const { data } = await api.get(
        `/enrollments?courseId=${course._id}&status=enrolled`,
      );
      setStudents(data.data);
      setShowStudentsModal(true);
    } catch (error) {
      console.error("Failed to fetch students:", error);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Courses</h1>
        <p className="text-gray-600 mt-1">
          Courses you're teaching this semester
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <Card key={course._id} className="hover:shadow-lg transition-shadow">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {course.courseName}
                  </h3>
                  <Badge variant="primary">{course.courseCode}</Badge>
                </div>
                <p className="text-sm text-gray-600">{course.department}</p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Grade:</span>
                  <span className="font-medium">{course.grade}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Credits:</span>
                  <span className="font-medium">{course.credits}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Students:</span>
                  <span className="font-medium">
                    {course.enrolledStudents?.length || 0} / {course.capacity}
                  </span>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    className="bg-primary-600 h-2 rounded-full transition-all"
                    style={{
                      width: `${((course.enrolledStudents?.length || 0) / course.capacity) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t">
                <p className="text-sm font-medium text-gray-700">Schedule:</p>
                {course.schedule?.map((slot, idx) => (
                  <div
                    key={idx}
                    className="text-xs text-gray-600 flex items-center gap-2"
                  >
                    <FiCalendar size={12} />
                    <span>
                      {slot.day} • {slot.startTime} - {slot.endTime} •{" "}
                      {slot.room}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={() => viewStudents(course)}
                >
                  <FiUsers size={16} /> View Students
                </Button>
                <Button
                  size="sm"
                  className="flex-1"
                  onClick={() =>
                    navigate(`/teacher/attendance?course=${course._id}`)
                  }
                >
                  <FiCalendar size={16} /> Take Attendance
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {courses.length === 0 && (
        <Card>
          <div className="text-center py-12">
            <FiBook className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-500 text-lg">No courses assigned</p>
            <p className="text-gray-400 text-sm mt-2">
              Contact admin to get courses assigned to you
            </p>
          </div>
        </Card>
      )}

      {/* Students Modal */}
      <Modal
        isOpen={showStudentsModal}
        onClose={() => setShowStudentsModal(false)}
        title={`Students - ${selectedCourse?.courseName}`}
        size="lg"
      >
        <div className="space-y-4">
          {students.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Student ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {students.map((enrollment) => (
                    <tr key={enrollment._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {enrollment.studentId?.studentId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {enrollment.studentId?.userId?.firstName}{" "}
                        {enrollment.studentId?.userId?.lastName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {enrollment.studentId?.userId?.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant="success">{enrollment.status}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">
              No students enrolled yet
            </p>
          )}
        </div>
      </Modal>
    </div>
  );
};
