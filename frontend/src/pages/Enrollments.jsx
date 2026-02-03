import { FiPlus, FiTrash2 } from "react-icons/fi";
import { Button } from "../components/Button";
import { Modal } from "../components/Modal";
import { Select } from "../components/Select";
import { Table } from "../components/Table";
import { Card } from "../components/Card";
import { api } from "../lib/api";
import { useEffect, useState } from "react";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { format } from "date-fns";
import { Badge } from "../components/Badge";

// ==================== ENROLLMENTS PAGE ====================
export const EnrollmentsPage = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [enrollRes, studentRes, courseRes] = await Promise.all([
        api.get("/enrollments"),
        api.get("/students?limit=100"),
        api.get("/courses?limit=100"),
      ]);

      console.log(enrollRes.data.data);

      setEnrollments(enrollRes.data.data);
      setStudents(studentRes.data.data);
      setCourses(courseRes.data.data);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    if (!selectedStudent || !selectedCourse) {
      alert("Please select both student and course");
      return;
    }

    try {
      await api.post("/enrollments", {
        studentId: selectedStudent,
        courseId: selectedCourse,
      });
      setShowAddModal(false);
      setSelectedStudent("");
      setSelectedCourse("");
      fetchData();
      alert("Student enrolled successfully!");
    } catch (error) {
      console.error("Failed to enroll:", error);
      alert(error.response?.data?.message || "Failed to enroll student");
    }
  };

  const handleDropEnrollment = async (enrollmentId) => {
    if (!confirm("Are you sure you want to drop this enrollment?")) return;

    try {
      await api.delete(`/enrollments/${enrollmentId}`);
      fetchData();
      alert("Enrollment dropped successfully!");
    } catch (error) {
      console.error("Failed to drop enrollment:", error);
      alert("Failed to drop enrollment");
    }
  };

  const filteredEnrollments = filterStatus
    ? enrollments.filter((e) => e.status === filterStatus)
    : enrollments;

  const columns = [
    {
      header: "Student",
      render: (row) => (
        <div>
          <p className="font-medium">
            {row.studentId?.userId?.firstName} {row.studentId?.userId?.lastName}
          </p>
          <p className="text-xs text-gray-500">{row.studentId?.studentId}</p>
        </div>
      ),
    },
    {
      header: "Course",
      render: (row) => (
        <div>
          <p className="font-medium">{row.courseId?.courseName}</p>
          <p className="text-xs text-gray-500">{row.courseId?.courseCode}</p>
        </div>
      ),
    },
    {
      header: "Enrolled Date",
      render: (row) => format(new Date(row.enrollmentDate), "MMM dd, yyyy"),
    },
    {
      header: "Academic Year",
      accessor: "academicYear",
    },
    {
      header: "Semester",
      accessor: "semester",
    },
    {
      header: "Status",
      render: (row) => {
        const variants = {
          enrolled: "success",
          dropped: "danger",
          completed: "info",
        };
        return <Badge variant={variants[row.status]}>{row.status}</Badge>;
      },
    },
    {
      header: "Grade",
      render: (row) => row.finalGrade || "-",
    },
  ];

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Enrollments</h1>
          <p className="text-gray-600 mt-1">
            Manage student course enrollments
          </p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <FiPlus /> New Enrollment
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="text-center">
          <p className="text-gray-600 text-sm">Total Enrollments</p>
          <p className="text-3xl font-bold text-primary-600">
            {enrollments.length}
          </p>
        </Card>
        <Card className="text-center">
          <p className="text-gray-600 text-sm">Active</p>
          <p className="text-3xl font-bold text-green-600">
            {enrollments.filter((e) => e.status === "enrolled").length}
          </p>
        </Card>
        <Card className="text-center">
          <p className="text-gray-600 text-sm">Completed</p>
          <p className="text-3xl font-bold text-blue-600">
            {enrollments.filter((e) => e.status === "completed").length}
          </p>
        </Card>
        <Card className="text-center">
          <p className="text-gray-600 text-sm">Dropped</p>
          <p className="text-3xl font-bold text-red-600">
            {enrollments.filter((e) => e.status === "dropped").length}
          </p>
        </Card>
      </div>

      <Card>
        <div className="mb-6">
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="enrolled">Enrolled</option>
            <option value="completed">Completed</option>
            <option value="dropped">Dropped</option>
          </select>
        </div>

        <Table
          columns={columns}
          data={filteredEnrollments}
          actions={(row) => (
            <>
              {row.status === "enrolled" && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDropEnrollment(row._id);
                  }}
                  className="text-red-600 hover:text-red-900"
                  title="Drop Enrollment"
                >
                  <FiTrash2 size={18} />
                </button>
              )}
            </>
          )}
        />
      </Card>

      {/* Add Enrollment Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="New Enrollment"
        size="md"
      >
        <div className="space-y-4">
          <Select
            label="Student"
            value={selectedStudent}
            onChange={(e) => setSelectedStudent(e.target.value)}
            options={[
              { value: "", label: "Select Student" },
              ...students.map((s) => ({
                value: s._id,
                label: `${s.userId?.firstName} ${s.userId?.lastName} (${s.studentId})`,
              })),
            ]}
          />

          <Select
            label="Course"
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            options={[
              { value: "", label: "Select Course" },
              ...courses
                .filter((c) => c.isActive)
                .map((c) => ({
                  value: c._id,
                  label: `${c.courseName} (${c.courseCode}) - ${c.enrolledStudents?.length || 0}/${c.capacity} enrolled`,
                })),
            ]}
          />

          <div className="flex gap-3 pt-4">
            <Button onClick={handleEnroll} className="flex-1">
              Enroll Student
            </Button>
            <Button
              variant="secondary"
              onClick={() => setShowAddModal(false)}
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
