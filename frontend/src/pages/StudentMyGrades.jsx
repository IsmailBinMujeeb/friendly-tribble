import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { Card } from "../components/Card";
import { FiAward } from "react-icons/fi";
import { LoadingSpinner } from "../components/LoadingSpinner";

export const StudentGrades = () => {
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGrades();
  }, []);

  const fetchGrades = async () => {
    try {
      const { data: userData } = await api.get("/auth/me");
      const studentId = userData.data.roleData._id;

      const { data } = await api.get(
        `/grades?studentId=${studentId}&isPublished=true`,
      );
      setGrades(data.data);
    } catch (error) {
      console.error("Failed to fetch grades:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateOverallGPA = () => {
    if (grades.length === 0) return "0.00";
    const totalGPA = grades.reduce((sum, grade) => sum + (grade.gpa || 0), 0);
    return (totalGPA / grades.length).toFixed(2);
  };

  const calculateOverallPercentage = () => {
    if (grades.length === 0) return "0.00";
    const totalPercentage = grades.reduce(
      (sum, grade) => sum + (grade.percentage || 0),
      0,
    );
    return (totalPercentage / grades.length).toFixed(2);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Grades</h1>
        <p className="text-gray-600 mt-1">View your academic performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="text-center bg-gradient-to-br from-primary-50 to-primary-100">
          <p className="text-sm text-gray-600 mb-2">Overall GPA</p>
          <p className="text-4xl font-bold text-primary-600">
            {calculateOverallGPA()}
          </p>
          <p className="text-xs text-gray-500 mt-1">out of 4.0</p>
        </Card>

        <Card className="text-center bg-gradient-to-br from-green-50 to-green-100">
          <p className="text-sm text-gray-600 mb-2">Average Score</p>
          <p className="text-4xl font-bold text-green-600">
            {calculateOverallPercentage()}%
          </p>
          <p className="text-xs text-gray-500 mt-1">across all courses</p>
        </Card>

        <Card className="text-center bg-gradient-to-br from-blue-50 to-blue-100">
          <p className="text-sm text-gray-600 mb-2">Courses Graded</p>
          <p className="text-4xl font-bold text-blue-600">{grades.length}</p>
          <p className="text-xs text-gray-500 mt-1">total courses</p>
        </Card>
      </div>

      <div className="grid gap-6">
        {grades.map((grade) => (
          <Card key={grade._id}>
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {grade.courseId?.courseName}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {grade.courseId?.courseCode}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-primary-600">
                    {grade.letterGrade}
                  </div>
                  <div className="text-sm text-gray-600">
                    GPA: {grade.gpa.toFixed(2)}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-xs text-gray-600">Total Marks</p>
                  <p className="text-lg font-semibold">{grade.totalMarks}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Percentage</p>
                  <p className="text-lg font-semibold">
                    {grade.percentage.toFixed(2)}%
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-3">
                  Assessment Breakdown
                </h4>
                <div className="space-y-2">
                  {grade.assessments?.map((assessment, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center p-3 bg-white border border-gray-200 rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          {assessment.name}
                        </p>
                        <p className="text-xs text-gray-500 capitalize">
                          {assessment.type}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          {assessment.obtainedMarks} / {assessment.maxMarks}
                        </p>
                        <p className="text-xs text-gray-600">
                          {(
                            (assessment.obtainedMarks / assessment.maxMarks) *
                            100
                          ).toFixed(1)}
                          %
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {grade.publishedDate && (
                <div className="text-xs text-gray-500 pt-2 border-t">
                  Published on{" "}
                  {format(new Date(grade.publishedDate), "MMM dd, yyyy")}
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      {grades.length === 0 && (
        <Card>
          <div className="text-center py-12">
            <FiAward className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-500 text-lg">No grades published yet</p>
            <p className="text-gray-400 text-sm mt-2">
              Grades will appear here once your teachers publish them
            </p>
          </div>
        </Card>
      )}
    </div>
  );
};
