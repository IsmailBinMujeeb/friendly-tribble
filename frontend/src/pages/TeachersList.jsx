import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { Badge } from "../components/Badge";
import { Button } from "../components/Button";
import {
  FiEdit,
  FiEye,
  FiFilter,
  FiPlus,
  FiSearch,
  FiTrash2,
} from "react-icons/fi";
import { Card } from "../components/Card";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { Table } from "../components/Table";

export const TeachersList = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const { data } = await api.get("/teachers?limit=100");
      setTeachers(data.data);
    } catch (error) {
      console.error("Failed to fetch teachers:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTeachers = teachers.filter((teacher) => {
    const matchesSearch =
      searchTerm === "" ||
      `${teacher.userId?.firstName} ${teacher.userId?.lastName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      teacher.userId?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.teacherId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDepartment =
      selectedDepartment === "" || teacher.department === selectedDepartment;

    return matchesSearch && matchesDepartment;
  });

  const departments = [...new Set(teachers.map((t) => t.department))];

  const columns = [
    { header: "Teacher ID", accessor: "teacherId" },
    {
      header: "Name",
      render: (row) => (
        <div>
          <p className="font-medium">
            {row.userId?.firstName} {row.userId?.lastName}
          </p>
          <p className="text-xs text-gray-500">{row.userId?.email}</p>
        </div>
      ),
    },
    { header: "Department", accessor: "department" },
    {
      header: "Subjects",
      render: (row) => (
        <div className="flex flex-wrap gap-1">
          {row.subjects?.slice(0, 2).map((subject, idx) => (
            <Badge key={idx} variant="info">
              {subject}
            </Badge>
          ))}
          {row.subjects?.length > 2 && (
            <Badge variant="default">+{row.subjects.length - 2}</Badge>
          )}
        </div>
      ),
    },
    {
      header: "Experience",
      render: (row) => `${row.experience || 0} years`,
    },
    {
      header: "Status",
      render: (row) => (
        <Badge variant={row.isActive ? "success" : "danger"}>
          {row.isActive ? "Active" : "Inactive"}
        </Badge>
      ),
    },
  ];

  const handleDelete = async (teacherId) => {
    if (!confirm("Are you sure you want to deactivate this teacher?")) return;

    try {
      await api.put(`/teachers/${teacherId}`, { isActive: false });
      fetchTeachers();
    } catch (error) {
      console.error("Failed to delete teacher:", error);
      alert("Failed to delete teacher");
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Teachers</h1>
          <p className="text-gray-600 mt-1">Manage faculty members</p>
        </div>
        <Button onClick={() => navigate("/admin/teachers/new")}>
          <FiPlus /> Add Teacher
        </Button>
      </div>

      <Card>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or ID..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
          >
            <option value="">All Departments</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>

          <Button
            variant="outline"
            onClick={() => {
              setSearchTerm("");
              setSelectedDepartment("");
            }}
          >
            <FiFilter /> Clear Filters
          </Button>
        </div>

        <Table
          columns={columns}
          data={filteredTeachers}
          actions={(row) => (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/admin/teachers/${row._id}`);
                }}
                className="text-primary-600 hover:text-primary-900"
              >
                <FiEye size={18} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/admin/teachers/${row._id}/edit`);
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

      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <p className="text-sm text-gray-600">
          Showing{" "}
          <span className="font-semibold">{filteredTeachers.length}</span> of{" "}
          <span className="font-semibold">{teachers.length}</span> teachers
        </p>
      </div>
    </div>
  );
};
