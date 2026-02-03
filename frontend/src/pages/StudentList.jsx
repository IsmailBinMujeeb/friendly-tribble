import { FiPlus } from "react-icons/fi";
import { Card } from "../components/Card";
import { Table } from "../components/Table";
import { Button } from "../components/Button";
import { Badge } from "../components/Badge";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../lib/api";

// ==================== Students List (Admin) ====================
export const StudentsList = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const { data } = await api.get("/students");
      setStudents(data.data);
    } catch (error) {
      console.error("Failed to fetch students:", error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { header: "Student ID", accessor: "studentId" },
    {
      header: "Name",
      render: (row) => `${row.userId?.firstName} ${row.userId?.lastName}`,
    },
    { header: "Email", render: (row) => row.userId?.email },
    { header: "Grade", accessor: "grade" },
    { header: "Section", accessor: "section" },
    {
      header: "Status",
      render: (row) => (
        <Badge variant={row.isActive ? "success" : "danger"}>
          {row.isActive ? "Active" : "Inactive"}
        </Badge>
      ),
    },
  ];

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Students</h1>
          <p className="text-gray-600 mt-1">Manage student records</p>
        </div>
        <Button onClick={() => navigate("/admin/students/new")}>
          <FiPlus /> Add Student
        </Button>
      </div>

      <Card>
        <Table columns={columns} data={students} />
      </Card>
    </div>
  );
};
