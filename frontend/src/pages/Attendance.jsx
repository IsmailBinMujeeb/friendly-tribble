import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { Card } from "../components/Card";
import { Select } from "../components/Select";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { FiAlertCircle, FiSave, FiX } from "react-icons/fi";
import { format } from "date-fns";

export const TeacherAttendance = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    format(new Date(), "yyyy-MM-dd"),
  );
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchMyCourses();
  }, []);

  useEffect(() => {
    if (selectedCourse) {
      fetchStudentsAndAttendance();
    }
  }, [selectedCourse, selectedDate]);

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

  const fetchStudentsAndAttendance = async () => {
    setLoading(true);
    try {
      // Get enrolled students
      const { data: enrollData } = await api.get(
        `/enrollments?courseId=${selectedCourse}&status=enrolled`,
      );
      setStudents(enrollData.data);

      // Get existing attendance for this date
      const { data: attData } = await api.get(
        `/attendance?courseId=${selectedCourse}&date=${selectedDate}`,
      );

      // Convert to lookup object
      const attLookup = {};
      attData.data.forEach((record) => {
        attLookup[record.studentId._id] = {
          status: record.status,
          remarks: record.remarks || "",
        };
      });
      setAttendance(attLookup);

      // Initialize attendance for students without records
      enrollData.data.forEach((enrollment) => {
        const studentId = enrollment.studentId._id;
        if (!attLookup[studentId]) {
          attLookup[studentId] = { status: "present", remarks: "" };
        }
      });
      setAttendance(attLookup);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateAttendance = (studentId, field, value) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: value,
      },
    }));
  };

  const markAll = (status) => {
    const updated = {};
    students.forEach((enrollment) => {
      updated[enrollment.studentId._id] = {
        status,
        remarks: attendance[enrollment.studentId._id]?.remarks || "",
      };
    });
    setAttendance(updated);
  };

  const saveAttendance = async () => {
    if (!selectedCourse) {
      alert("Please select a course");
      return;
    }

    setSaving(true);
    try {
      const records = students.map((enrollment) => ({
        studentId: enrollment.studentId._id,
        status: attendance[enrollment.studentId._id]?.status || "present",
        remarks: attendance[enrollment.studentId._id]?.remarks || "",
      }));

      await api.post("/attendance", {
        courseId: selectedCourse,
        date: selectedDate,
        records,
      });

      alert("Attendance saved successfully!");
    } catch (error) {
      console.error("Failed to save attendance:", error);
      alert("Failed to save attendance. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Mark Attendance</h1>
        <p className="text-gray-600 mt-1">
          Record student attendance for your courses
        </p>
      </div>

      <Card>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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

          <Input
            label="Date"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            max={format(new Date(), "yyyy-MM-dd")}
          />

          <div className="flex items-end gap-2">
            <Button
              onClick={() => markAll("present")}
              variant="success"
              size="sm"
              className="flex-1"
            >
              All Present
            </Button>
            <Button
              onClick={() => markAll("absent")}
              variant="danger"
              size="sm"
              className="flex-1"
            >
              All Absent
            </Button>
          </div>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : students.length > 0 ? (
          <>
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
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Remarks
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {students.map((enrollment) => {
                    const studentId = enrollment.studentId._id;
                    const status = attendance[studentId]?.status || "present";

                    return (
                      <tr key={enrollment._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {enrollment.studentId.studentId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {enrollment.studentId.userId?.firstName}{" "}
                          {enrollment.studentId.userId?.lastName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <select
                            value={status}
                            onChange={(e) =>
                              updateAttendance(
                                studentId,
                                "status",
                                e.target.value,
                              )
                            }
                            className={`px-3 py-1 rounded-full text-xs font-medium border-0 focus:ring-2 focus:ring-primary-500 ${
                              status === "present"
                                ? "bg-green-100 text-green-800"
                                : status === "absent"
                                  ? "bg-red-100 text-red-800"
                                  : status === "late"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            <option value="present">Present</option>
                            <option value="absent">Absent</option>
                            <option value="late">Late</option>
                            <option value="excused">Excused</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="text"
                            value={attendance[studentId]?.remarks || ""}
                            onChange={(e) =>
                              updateAttendance(
                                studentId,
                                "remarks",
                                e.target.value,
                              )
                            }
                            placeholder="Optional remarks..."
                            className="w-full px-3 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <Button variant="secondary" onClick={fetchStudentsAndAttendance}>
                <FiX /> Reset
              </Button>
              <Button onClick={saveAttendance} disabled={saving}>
                <FiSave /> {saving ? "Saving..." : "Save Attendance"}
              </Button>
            </div>
          </>
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
    </div>
  );
};
