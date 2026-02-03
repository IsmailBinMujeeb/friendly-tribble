import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { Card } from "../components/Card";
import { Badge } from "../components/Badge";
import { FiBook, FiCalendar } from "react-icons/fi";

export const StudentCourses = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyCourses();
  }, []);

  const fetchMyCourses = async () => {
    try {
      const { data: userData } = await api.get("/auth/me");
      const studentId = userData.data.roleData._id;

      const { data } = await api.get(
        `/enrollments?studentId=${studentId}&status=enrolled`,
      );
      setEnrollments(data.data);
    } catch (error) {
      console.error("Failed to fetch courses:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Courses</h1>
        <p className="text-gray-600 mt-1">
          Courses you're enrolled in this semester
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {enrollments.map((enrollment) => {
          const course = enrollment.courseId;

          return (
            <Card
              key={enrollment._id}
              className="hover:shadow-lg transition-shadow"
            >
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
                    <span className="text-gray-600">Credits:</span>
                    <span className="font-medium">
                      {enrollment.credits || course.credits}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Teacher:</span>
                    <span className="font-medium text-xs">
                      {course.teacherId?.userId?.firstName}{" "}
                      {course.teacherId?.userId?.lastName}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Semester:</span>
                    <span className="font-medium">{enrollment.semester}</span>
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
                        {slot.day} • {slot.startTime} - {slot.endTime}
                      </span>
                    </div>
                  ))}
                  {course.schedule?.length > 0 && (
                    <p className="text-xs text-gray-500 mt-1">
                      Room: {course.schedule[0].room}
                    </p>
                  )}
                </div>

                <div className="pt-2 border-t">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Status:</span>
                    <Badge variant="success">{enrollment.status}</Badge>
                  </div>
                  {enrollment.finalGrade && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Final Grade:</span>
                      <span className="font-bold text-primary-600">
                        {enrollment.finalGrade}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {enrollments.length === 0 && (
        <Card>
          <div className="text-center py-12">
            <FiBook className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-500 text-lg">No courses enrolled</p>
            <p className="text-gray-400 text-sm mt-2">
              Contact your advisor to enroll in courses
            </p>
          </div>
        </Card>
      )}
    </div>
  );
};
