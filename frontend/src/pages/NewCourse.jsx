import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { FiArrowLeft, FiBook, FiSave, FiX } from "react-icons/fi";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { Input } from "../components/Input";
import { Select } from "../components/Select";
import { useEffect } from "react";

export const NewCourseForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [teachers, setTeachers] = useState([]);
  const [errors, setErrors] = useState({});
  const [schedule, setSchedule] = useState([
    { day: "Monday", startTime: "09:00", endTime: "10:00", room: "" },
  ]);

  const [formData, setFormData] = useState({
    courseCode: "",
    courseName: "",
    description: "",
    grade: "",
    department: "",
    credits: 3,
    teacherId: "",
    capacity: 30,
    academicYear: "2024-2025",
    semester: "Fall",
  });

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const { data } = await api.get("/teachers?limit=100");
      setTeachers(data.data);
    } catch (error) {
      console.error("Failed to fetch teachers:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const addScheduleSlot = () => {
    setSchedule([
      ...schedule,
      { day: "Monday", startTime: "09:00", endTime: "10:00", room: "" },
    ]);
  };

  const removeScheduleSlot = (index) => {
    setSchedule(schedule.filter((_, i) => i !== index));
  };

  const updateSchedule = (index, field, value) => {
    const updated = [...schedule];
    updated[index][field] = value;
    setSchedule(updated);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.courseCode.trim())
      newErrors.courseCode = "Course code is required";
    if (!formData.courseName.trim())
      newErrors.courseName = "Course name is required";
    if (!formData.grade) newErrors.grade = "Grade is required";
    if (!formData.teacherId) newErrors.teacherId = "Teacher is required";
    if (!formData.department) newErrors.department = "Department is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      alert("Please fix the errors in the form");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        ...formData,
        schedule: schedule.filter((s) => s.day && s.startTime && s.endTime),
        credits: parseInt(formData.credits),
        capacity: parseInt(formData.capacity),
      };

      await api.post("/courses", payload);

      alert("Course created successfully!");
      navigate("/admin/courses");
    } catch (error) {
      console.error("Failed to create course:", error);
      alert(error.response?.data?.message || "Failed to create course");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => navigate("/admin/courses")}>
          <FiArrowLeft /> Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">New Course</h1>
          <p className="text-gray-600 mt-1">Create a new course</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card title="Basic Information">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Course Code"
              name="courseCode"
              value={formData.courseCode}
              onChange={handleChange}
              error={errors.courseCode}
              icon={FiBook}
              required
              placeholder="MATH101"
            />

            <Input
              label="Course Name"
              name="courseName"
              value={formData.courseName}
              onChange={handleChange}
              error={errors.courseName}
              icon={FiBook}
              required
              placeholder="Algebra I"
            />

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Course description..."
              />
            </div>
          </div>
        </Card>

        {/* Course Details */}
        <Card title="Course Details">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Select
              label="Grade"
              name="grade"
              value={formData.grade}
              onChange={handleChange}
              error={errors.grade}
              required
              options={[
                { value: "", label: "Select Grade" },
                { value: "9", label: "Grade 9" },
                { value: "10", label: "Grade 10" },
                { value: "11", label: "Grade 11" },
                { value: "12", label: "Grade 12" },
              ]}
            />

            <Select
              label="Department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              error={errors.department}
              required
              options={[
                { value: "", label: "Select Department" },
                { value: "Mathematics", label: "Mathematics" },
                { value: "Science", label: "Science" },
                { value: "English", label: "English" },
                { value: "History", label: "History" },
                { value: "Computer Science", label: "Computer Science" },
              ]}
            />

            <Input
              label="Credits"
              name="credits"
              type="number"
              min="1"
              max="10"
              value={formData.credits}
              onChange={handleChange}
              required
              placeholder="3"
            />

            <Input
              label="Capacity"
              name="capacity"
              type="number"
              min="1"
              value={formData.capacity}
              onChange={handleChange}
              required
              placeholder="30"
            />

            <Select
              label="Teacher"
              name="teacherId"
              value={formData.teacherId}
              onChange={handleChange}
              error={errors.teacherId}
              required
              options={[
                { value: "", label: "Select Teacher" },
                ...teachers.map((t) => ({
                  value: t._id,
                  label: `${t.userId?.firstName} ${t.userId?.lastName} (${t.department})`,
                })),
              ]}
            />

            <Select
              label="Semester"
              name="semester"
              value={formData.semester}
              onChange={handleChange}
              required
              options={[
                { value: "Fall", label: "Fall" },
                { value: "Spring", label: "Spring" },
                { value: "Summer", label: "Summer" },
              ]}
            />

            <Input
              label="Academic Year"
              name="academicYear"
              value={formData.academicYear}
              onChange={handleChange}
              required
              placeholder="2024-2025"
            />
          </div>
        </Card>

        {/* Schedule */}
        <Card title="Class Schedule">
          <div className="space-y-4">
            {schedule.map((slot, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border border-gray-200 rounded-lg"
              >
                <Select
                  label="Day"
                  value={slot.day}
                  onChange={(e) => updateSchedule(index, "day", e.target.value)}
                  options={[
                    { value: "Monday", label: "Monday" },
                    { value: "Tuesday", label: "Tuesday" },
                    { value: "Wednesday", label: "Wednesday" },
                    { value: "Thursday", label: "Thursday" },
                    { value: "Friday", label: "Friday" },
                    { value: "Saturday", label: "Saturday" },
                  ]}
                />

                <Input
                  label="Start Time"
                  type="time"
                  value={slot.startTime}
                  onChange={(e) =>
                    updateSchedule(index, "startTime", e.target.value)
                  }
                />

                <Input
                  label="End Time"
                  type="time"
                  value={slot.endTime}
                  onChange={(e) =>
                    updateSchedule(index, "endTime", e.target.value)
                  }
                />

                <Input
                  label="Room"
                  value={slot.room}
                  onChange={(e) =>
                    updateSchedule(index, "room", e.target.value)
                  }
                  placeholder="101"
                />

                <div className="flex items-end">
                  {schedule.length > 1 && (
                    <Button
                      type="button"
                      variant="danger"
                      onClick={() => removeScheduleSlot(index)}
                      className="w-full"
                    >
                      <FiX /> Remove
                    </Button>
                  )}
                </div>
              </div>
            ))}

            <Button type="button" variant="outline" onClick={addScheduleSlot}>
              + Add Time Slot
            </Button>
          </div>
        </Card>

        {/* Form Actions */}
        <div className="flex gap-4">
          <Button
            type="submit"
            disabled={loading}
            className="flex-1 md:flex-initial"
          >
            <FiSave /> {loading ? "Creating..." : "Create Course"}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate("/admin/courses")}
            className="flex-1 md:flex-initial"
          >
            <FiX /> Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};
