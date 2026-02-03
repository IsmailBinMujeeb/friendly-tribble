import {
  FiAlertCircle,
  FiCheckCircle,
  FiEdit,
  FiPlus,
  FiSave,
} from "react-icons/fi";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { Select } from "../components/Select";
import { Modal } from "../components/Modal";
import { Badge } from "../components/Badge";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { Card } from "../components/Card";
import { api } from "../lib/api";
import { useEffect, useState } from "react";

export const TeacherGrades = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [students, setStudents] = useState([]);
  const [grades, setGrades] = useState({});
  const [loading, setLoading] = useState(false);
  const [showGradeModal, setShowGradeModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [assessments, setAssessments] = useState([
    { name: "", type: "assignment", maxMarks: 100, obtainedMarks: 0 },
  ]);

  useEffect(() => {
    fetchMyCourses();
  }, []);

  useEffect(() => {
    if (selectedCourse) {
      fetchStudentsAndGrades();
    }
  }, [selectedCourse]);

  const fetchMyCourses = async () => {
    try {
      const { data: userData } = await api.get("/auth/me");
      const teacherId = userData.data.roleData._id;
      const { data } = await api.get(`/courses?teacherId=${teacherId}`);
      setCourses(data.data);

      if (data.data.length > 0) {
        setSelectedCourse(data.data[0]._id);
      }
    } catch (error) {
      console.error("Failed to fetch courses:", error);
    }
  };

  const fetchStudentsAndGrades = async () => {
    setLoading(true);
    try {
      const { data: enrollData } = await api.get(
        `/enrollments?courseId=${selectedCourse}&status=enrolled`,
      );
      setStudents(enrollData.data);

      const { data: gradeData } = await api.get(
        `/grades?courseId=${selectedCourse}`,
      );

      const gradeLookup = {};
      gradeData.data.forEach((grade) => {
        gradeLookup[grade.studentId._id] = grade;
      });
      setGrades(gradeLookup);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const openGradeModal = (enrollment) => {
    setSelectedStudent(enrollment);

    const existingGrade = grades[enrollment.studentId._id];
    if (existingGrade && existingGrade.assessments?.length > 0) {
      setAssessments(existingGrade.assessments);
    } else {
      setAssessments([
        { name: "", type: "assignment", maxMarks: 100, obtainedMarks: 0 },
      ]);
    }

    setShowGradeModal(true);
  };

  const addAssessment = () => {
    setAssessments([
      ...assessments,
      { name: "", type: "assignment", maxMarks: 100, obtainedMarks: 0 },
    ]);
  };

  const removeAssessment = (index) => {
    setAssessments(assessments.filter((_, i) => i !== index));
  };

  const updateAssessment = (index, field, value) => {
    const updated = [...assessments];
    updated[index][field] =
      field === "maxMarks" || field === "obtainedMarks"
        ? parseFloat(value) || 0
        : value;
    setAssessments(updated);
  };

  const saveGrade = async () => {
    if (!selectedStudent || assessments.length === 0) {
      alert("Please add at least one assessment");
      return;
    }

    try {
      const payload = {
        enrollmentId: selectedStudent._id,
        studentId: selectedStudent.studentId._id,
        courseId: selectedCourse,
        assessments: assessments.filter((a) => a.name.trim() !== ""),
      };

      const existingGrade = grades[selectedStudent.studentId._id];

      if (existingGrade) {
        await api.put(`/grades/${existingGrade._id}`, payload);
      } else {
        await api.post("/grades", payload);
      }

      setShowGradeModal(false);
      fetchStudentsAndGrades();
      alert("Grade saved successfully!");
    } catch (error) {
      console.error("Failed to save grade:", error);
      alert("Failed to save grade");
    }
  };

  const publishGrade = async (gradeId) => {
    if (
      !confirm(
        "Are you sure you want to publish this grade? Students will be able to see it.",
      )
    )
      return;

    try {
      await api.put(`/grades/${gradeId}/publish`);
      fetchStudentsAndGrades();
      alert("Grade published successfully!");
    } catch (error) {
      console.error("Failed to publish grade:", error);
      alert("Failed to publish grade");
    }
  };

  const calculateTotal = () => {
    const total = assessments.reduce(
      (sum, a) => sum + (parseFloat(a.obtainedMarks) || 0),
      0,
    );
    const max = assessments.reduce(
      (sum, a) => sum + (parseFloat(a.maxMarks) || 0),
      0,
    );
    const percentage = max > 0 ? ((total / max) * 100).toFixed(2) : 0;
    return { total, max, percentage };
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Grade Management</h1>
        <p className="text-gray-600 mt-1">Create and manage student grades</p>
      </div>

      <Card>
        <div className="mb-6">
          <Select
            label="Select Course"
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            options={[
              { value: "", label: "Choose a course..." },
              ...courses.map((c) => ({
                value: c._id,
                label: `${c.courseName} (${c.courseCode})`,
              })),
            ]}
          />
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : students.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Total Marks
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Percentage
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Grade
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {students.map((enrollment) => {
                  const grade = grades[enrollment.studentId._id];

                  return (
                    <tr key={enrollment._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {enrollment.studentId.userId?.firstName}{" "}
                            {enrollment.studentId.userId?.lastName}
                          </p>
                          <p className="text-xs text-gray-500">
                            {enrollment.studentId.studentId}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {grade ? `${grade.totalMarks}` : "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {grade ? `${grade.percentage.toFixed(2)}%` : "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {grade ? (
                          <Badge
                            variant={
                              grade.letterGrade.startsWith("A")
                                ? "success"
                                : grade.letterGrade.startsWith("B")
                                  ? "info"
                                  : grade.letterGrade.startsWith("C")
                                    ? "warning"
                                    : "danger"
                            }
                          >
                            {grade.letterGrade}
                          </Badge>
                        ) : (
                          <Badge variant="default">Not Graded</Badge>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {grade ? (
                          grade.isPublished ? (
                            <Badge variant="success">Published</Badge>
                          ) : (
                            <Badge variant="warning">Draft</Badge>
                          )
                        ) : (
                          <Badge variant="default">-</Badge>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => openGradeModal(enrollment)}
                            className="text-primary-600 hover:text-primary-900"
                          >
                            <FiEdit size={18} />
                          </button>
                          {grade && !grade.isPublished && (
                            <button
                              onClick={() => publishGrade(grade._id)}
                              className="text-green-600 hover:text-green-900"
                            >
                              <FiCheckCircle size={18} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <FiAlertCircle className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-500">
              {selectedCourse
                ? "No students enrolled in this course"
                : "Please select a course"}
            </p>
          </div>
        )}
      </Card>

      {/* Grade Entry Modal */}
      <Modal
        isOpen={showGradeModal}
        onClose={() => setShowGradeModal(false)}
        title={`Grade Entry - ${selectedStudent?.studentId.userId?.firstName} ${selectedStudent?.studentId.userId?.lastName}`}
        size="lg"
      >
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">
              Student ID: {selectedStudent?.studentId.studentId}
            </p>
            <p className="text-sm text-gray-600">
              Email: {selectedStudent?.studentId.userId?.email}
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Assessments</h3>
              <Button size="sm" onClick={addAssessment}>
                <FiPlus /> Add Assessment
              </Button>
            </div>

            {assessments.map((assessment, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4 space-y-3"
              >
                <div className="flex justify-between items-center">
                  <h4 className="font-medium text-gray-900">
                    Assessment {index + 1}
                  </h4>
                  {assessments.length > 1 && (
                    <button
                      onClick={() => removeAssessment(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Assessment Name"
                    placeholder="e.g., Midterm Exam"
                    value={assessment.name}
                    onChange={(e) =>
                      updateAssessment(index, "name", e.target.value)
                    }
                  />

                  <Select
                    label="Type"
                    value={assessment.type}
                    onChange={(e) =>
                      updateAssessment(index, "type", e.target.value)
                    }
                    options={[
                      { value: "assignment", label: "Assignment" },
                      { value: "quiz", label: "Quiz" },
                      { value: "midterm", label: "Midterm" },
                      { value: "final", label: "Final" },
                      { value: "project", label: "Project" },
                      { value: "other", label: "Other" },
                    ]}
                  />

                  <Input
                    label="Max Marks"
                    type="number"
                    min="0"
                    value={assessment.maxMarks}
                    onChange={(e) =>
                      updateAssessment(index, "maxMarks", e.target.value)
                    }
                  />

                  <Input
                    label="Obtained Marks"
                    type="number"
                    min="0"
                    max={assessment.maxMarks}
                    value={assessment.obtainedMarks}
                    onChange={(e) =>
                      updateAssessment(index, "obtainedMarks", e.target.value)
                    }
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="bg-primary-50 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Total:</span>
              <span className="text-lg font-bold text-gray-900">
                {calculateTotal().total} / {calculateTotal().max}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">
                Percentage:
              </span>
              <span className="text-lg font-bold text-primary-600">
                {calculateTotal().percentage}%
              </span>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button onClick={saveGrade} className="flex-1">
              <FiSave /> Save Grade
            </Button>
            <Button
              variant="secondary"
              onClick={() => setShowGradeModal(false)}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
