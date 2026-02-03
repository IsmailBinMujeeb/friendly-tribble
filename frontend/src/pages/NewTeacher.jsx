import { useState } from "react";
import {
  FiArrowLeft,
  FiCalendar,
  FiMail,
  FiMapPin,
  FiPhone,
  FiSave,
  FiUser,
  FiX,
  FiBook,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { Input } from "../components/Input";
import { Select } from "../components/Select";
import { api } from "../lib/api";

export const NewTeacherForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [subjects, setSubjects] = useState([""]);

  const [formData, setFormData] = useState({
    // User data
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    dateOfBirth: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
    },
    // Teacher data
    department: "",
    joiningDate: new Date().toISOString().split("T")[0],
    qualification: "",
    specialization: "",
    experience: 0,
    employeeId: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const addSubject = () => {
    setSubjects([...subjects, ""]);
  };

  const removeSubject = (index) => {
    setSubjects(subjects.filter((_, i) => i !== index));
  };

  const updateSubject = (index, value) => {
    const updated = [...subjects];
    updated[index] = value;
    setSubjects(updated);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
      newErrors.email = "Invalid email format";
    if (!formData.password.trim()) newErrors.password = "Password is required";
    if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
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
      // Create user
      const userPayload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        role: "teacher",
        phone: formData.phone,
        dateOfBirth: formData.dateOfBirth,
        address: formData.address,
      };

      const { data: userData } = await api.post("/auth/register", userPayload);

      // Create teacher profile
      const teacherPayload = {
        userId: userData.data._id,
        department: formData.department,
        joiningDate: formData.joiningDate,
        qualification: formData.qualification,
        specialization: formData.specialization,
        experience: parseInt(formData.experience) || 0,
        employeeId: formData.employeeId,
        subjects: subjects.filter((s) => s.trim() !== ""),
      };

      await api.post("/teachers", teacherPayload);

      alert("Teacher created successfully!");
      navigate("/admin/teachers");
    } catch (error) {
      console.log(error);
      console.error("Failed to create teacher:", error);
      alert(error.response?.data?.message || "Failed to create teacher");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => navigate("/admin/teachers")}>
          <FiArrowLeft /> Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">New Teacher</h1>
          <p className="text-gray-600 mt-1">Add a new teacher to the system</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <Card title="Personal Information">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              error={errors.firstName}
              icon={FiUser}
              required
              placeholder="John"
            />

            <Input
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              error={errors.lastName}
              icon={FiUser}
              required
              placeholder="Smith"
            />

            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              icon={FiMail}
              required
              placeholder="teacher@school.com"
            />

            <Input
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              required
              placeholder="Min. 6 characters"
            />

            <Input
              label="Phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              icon={FiPhone}
              placeholder="+1234567890"
            />

            <Input
              label="Date of Birth"
              name="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={handleChange}
              icon={FiCalendar}
            />
          </div>
        </Card>

        {/* Address */}
        <Card title="Address">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <Input
                label="Street Address"
                name="address.street"
                value={formData.address.street}
                onChange={handleChange}
                icon={FiMapPin}
                placeholder="123 Main St"
              />
            </div>

            <Input
              label="City"
              name="address.city"
              value={formData.address.city}
              onChange={handleChange}
              placeholder="New York"
            />

            <Input
              label="State"
              name="address.state"
              value={formData.address.state}
              onChange={handleChange}
              placeholder="NY"
            />

            <Input
              label="ZIP Code"
              name="address.zipCode"
              value={formData.address.zipCode}
              onChange={handleChange}
              placeholder="10001"
            />
          </div>
        </Card>

        {/* Professional Information */}
        <Card title="Professional Information">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                { value: "Physical Education", label: "Physical Education" },
                { value: "Arts", label: "Arts" },
              ]}
            />

            <Input
              label="Employee ID"
              name="employeeId"
              value={formData.employeeId}
              onChange={handleChange}
              placeholder="EMP001 (Optional)"
            />

            <Input
              label="Qualification"
              name="qualification"
              value={formData.qualification}
              onChange={handleChange}
              icon={FiBook}
              placeholder="Masters, PhD, etc."
            />

            <Input
              label="Specialization"
              name="specialization"
              value={formData.specialization}
              onChange={handleChange}
              placeholder="Algebra, Physics, etc."
            />

            <Input
              label="Years of Experience"
              name="experience"
              type="number"
              min="0"
              value={formData.experience}
              onChange={handleChange}
              placeholder="5"
            />

            <Input
              label="Joining Date"
              name="joiningDate"
              type="date"
              value={formData.joiningDate}
              onChange={handleChange}
              required
            />
          </div>
        </Card>

        {/* Subjects */}
        <Card title="Subjects">
          <div className="space-y-4">
            {subjects.map((subject, index) => (
              <div key={index} className="flex gap-3">
                <Input
                  placeholder={`Subject ${index + 1}`}
                  value={subject}
                  onChange={(e) => updateSubject(index, e.target.value)}
                  icon={FiBook}
                  className="flex-1"
                />
                {subjects.length > 1 && (
                  <Button
                    type="button"
                    variant="danger"
                    onClick={() => removeSubject(index)}
                  >
                    <FiX />
                  </Button>
                )}
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addSubject}>
              + Add Subject
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
            <FiSave /> {loading ? "Creating..." : "Create Teacher"}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate("/admin/teachers")}
            className="flex-1 md:flex-initial"
          >
            <FiX /> Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};
