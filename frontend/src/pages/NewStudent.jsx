import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../lib/api";
import { Button } from "../components/Button";
import {
  FiArrowLeft,
  FiCalendar,
  FiMail,
  FiMapPin,
  FiPhone,
  FiSave,
  FiUser,
  FiX,
} from "react-icons/fi";
import { Card } from "../components/Card";
import { Input } from "../components/Input";
import { Select } from "../components/Select";

export const NewStudentForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

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
    // Student data
    grade: "",
    section: "",
    enrollmentDate: new Date().toISOString().split("T")[0],
    parentName: "",
    parentEmail: "",
    parentPhone: "",
    emergencyContact: {
      name: "",
      relationship: "",
      phone: "",
    },
    medicalInfo: "",
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

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
      newErrors.email = "Invalid email format";
    if (!id && !formData.password.trim())
      newErrors.password = "Password is required";
    if (!id && formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (!formData.grade) newErrors.grade = "Grade is required";

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
      // First create the user
      const userPayload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password || "Student@123",
        role: "student",
        phone: formData.phone,
        dateOfBirth: formData.dateOfBirth,
        address: formData.address,
      };

      const { data: userData } = await api.post("/auth/register", userPayload);

      // Then create student profile
      const studentPayload = {
        userId: userData.data._id,
        grade: formData.grade,
        section: formData.section,
        enrollmentDate: formData.enrollmentDate,
        parentName: formData.parentName,
        parentEmail: formData.parentEmail,
        parentPhone: formData.parentPhone,
        emergencyContact: formData.emergencyContact,
        medicalInfo: formData.medicalInfo,
      };

      await api.post("/students", studentPayload);

      alert("Student created successfully!");
      navigate("/admin/students");
    } catch (error) {
      console.error("Failed to create student:", error);
      alert(error.response?.data?.message || "Failed to create student");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => navigate("/admin/students")}>
          <FiArrowLeft /> Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">New Student</h1>
          <p className="text-gray-600 mt-1">Add a new student to the system</p>
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
              placeholder="Doe"
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
              placeholder="student@school.com"
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

        {/* Academic Information */}
        <Card title="Academic Information">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

            <Input
              label="Section"
              name="section"
              value={formData.section}
              onChange={handleChange}
              placeholder="A, B, C..."
            />

            <Input
              label="Enrollment Date"
              name="enrollmentDate"
              type="date"
              value={formData.enrollmentDate}
              onChange={handleChange}
              required
            />
          </div>
        </Card>

        {/* Parent/Guardian Information */}
        <Card title="Parent/Guardian Information">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Input
              label="Parent Name"
              name="parentName"
              value={formData.parentName}
              onChange={handleChange}
              icon={FiUser}
              placeholder="Jane Doe"
            />

            <Input
              label="Parent Email"
              name="parentEmail"
              type="email"
              value={formData.parentEmail}
              onChange={handleChange}
              icon={FiMail}
              placeholder="parent@email.com"
            />

            <Input
              label="Parent Phone"
              name="parentPhone"
              type="tel"
              value={formData.parentPhone}
              onChange={handleChange}
              icon={FiPhone}
              placeholder="+1234567890"
            />
          </div>
        </Card>

        {/* Emergency Contact */}
        <Card title="Emergency Contact">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Input
              label="Contact Name"
              name="emergencyContact.name"
              value={formData.emergencyContact.name}
              onChange={handleChange}
              icon={FiUser}
              placeholder="Emergency contact name"
            />

            <Input
              label="Relationship"
              name="emergencyContact.relationship"
              value={formData.emergencyContact.relationship}
              onChange={handleChange}
              placeholder="Uncle, Aunt, etc."
            />

            <Input
              label="Contact Phone"
              name="emergencyContact.phone"
              type="tel"
              value={formData.emergencyContact.phone}
              onChange={handleChange}
              icon={FiPhone}
              placeholder="+1234567890"
            />
          </div>
        </Card>

        {/* Medical Information */}
        <Card title="Medical Information">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Medical Information / Allergies
            </label>
            <textarea
              name="medicalInfo"
              value={formData.medicalInfo}
              onChange={handleChange}
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Any medical conditions, allergies, or special needs..."
            />
          </div>
        </Card>

        {/* Form Actions */}
        <div className="flex gap-4">
          <Button
            type="submit"
            disabled={loading}
            className="flex-1 md:flex-initial"
          >
            <FiSave /> {loading ? "Creating..." : "Create Student"}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate("/admin/students")}
            className="flex-1 md:flex-initial"
          >
            <FiX /> Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};
