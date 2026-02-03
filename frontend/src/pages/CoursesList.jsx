import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { Badge } from "../components/Badge";
import { Button } from "../components/Button";
import { FiEdit, FiFilter, FiPlus, FiSearch, FiTrash2 } from "react-icons/fi";
import { Card } from "../components/Card";
import { Table } from "../components/Table";
import { LoadingSpinner } from "../components/LoadingSpinner";

export const CoursesList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const { data } = await api.get("/courses?limit=100");
      setCourses(data.data);
    } catch (error) {
      console.error("Failed to fetch courses:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      searchTerm === "" ||
      course.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.courseCode.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesGrade = selectedGrade === "" || course.grade === selectedGrade;

    return matchesSearch && matchesGrade;
  });

  const grades = [...new Set(courses.map((c) => c.grade))];

  const columns = [
    { header: "Course Code", accessor: "courseCode" },
    {
      header: "Course Name",
      render: (row) => (
        <div>
          <p className="font-medium">{row.courseName}</p>
          <p className="text-xs text-gray-500">{row.department}</p>
        </div>
      ),
    },
    { header: "Grade", accessor: "grade" },
    {
      header: "Teacher",
      render: (row) =>
        row.teacherId?.userId
          ? `${row.teacherId.userId.firstName} ${row.teacherId.userId.lastName}`
          : "Not Assigned",
    },
    {
      header: "Enrollment",
      render: (row) => (
        <div className="text-center">
          <p className="font-medium">
            {row.enrolledStudents?.length || 0}/{row.capacity}
          </p>
          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
            <div
              className="bg-primary-600 h-1.5 rounded-full"
              style={{
                width: `${((row.enrolledStudents?.length || 0) / row.capacity) * 100}%`,
              }}
            ></div>
          </div>
        </div>
      ),
    },
    { header: "Credits", accessor: "credits" },
    {
      header: "Status",
      render: (row) => (
        <Badge variant={row.isActive ? "success" : "danger"}>
          {row.isActive ? "Active" : "Inactive"}
        </Badge>
      ),
    },
  ];

  const handleDelete = async (courseId) => {
    if (!confirm("Are you sure you want to delete this course?")) return;

    try {
      await api.delete(`/courses/${courseId}`);
      fetchCourses();
    } catch (error) {
      console.error("Failed to delete course:", error);
      alert("Failed to delete course");
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Courses</h1>
          <p className="text-gray-600 mt-1">Manage course offerings</p>
        </div>
        <Button onClick={() => navigate("/admin/courses/new")}>
          <FiPlus /> Add Course
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="text-center">
          <p className="text-gray-600 text-sm">Total Courses</p>
          <p className="text-3xl font-bold text-primary-600">
            {courses.length}
          </p>
        </Card>
        <Card className="text-center">
          <p className="text-gray-600 text-sm">Active Courses</p>
          <p className="text-3xl font-bold text-green-600">
            {courses.filter((c) => c.isActive).length}
          </p>
        </Card>
        <Card className="text-center">
          <p className="text-gray-600 text-sm">Total Enrollment</p>
          <p className="text-3xl font-bold text-blue-600">
            {courses.reduce(
              (sum, c) => sum + (c.enrolledStudents?.length || 0),
              0,
            )}
          </p>
        </Card>
        <Card className="text-center">
          <p className="text-gray-600 text-sm">Avg. Capacity</p>
          <p className="text-3xl font-bold text-purple-600">
            {courses.length > 0
              ? Math.round(
                  courses.reduce(
                    (sum, c) =>
                      sum +
                      ((c.enrolledStudents?.length || 0) / c.capacity) * 100,
                    0,
                  ) / courses.length,
                )
              : 0}
            %
          </p>
        </Card>
      </div>

      <Card>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by course name or code..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
          >
            <option value="">All Grades</option>
            {grades.map((grade) => (
              <option key={grade} value={grade}>
                Grade {grade}
              </option>
            ))}
          </select>

          <Button
            variant="outline"
            onClick={() => {
              setSearchTerm("");
              setSelectedGrade("");
            }}
          >
            <FiFilter /> Clear Filters
          </Button>
        </div>

        <Table
          columns={columns}
          data={filteredCourses}
          actions={(row) => (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/admin/courses/${row._id}/edit`);
                }}
                className="text-blue-600 hover:text-blue-900"
              >
                <FiEdit size={18} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(row._id);
                }}
                className="text-red-600 hover:text-red-900"
              >
                <FiTrash2 size={18} />
              </button>
            </>
          )}
        />
      </Card>
    </div>
  );
};
