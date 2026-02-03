import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { Button } from "../components/Button";
import { FiEdit, FiSave, FiX } from "react-icons/fi";
import { Card } from "../components/Card";
import { Input } from "../components/Input";
import { format } from "date-fns";

export const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [roleData, setRoleData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await api.get("/auth/me");
      setUser(data.data.user);
      setRoleData(data.data.roleData);
      setFormData(data.data.user);
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.put(`/users/${user._id}`, formData);
      alert("Profile updated successfully!");
      setEditing(false);
      fetchProfile();
    } catch (error) {
      console.error("Failed to update profile:", error);
      alert("Failed to update profile");
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600 mt-1">Manage your personal information</p>
        </div>
        <Button onClick={() => setEditing(!editing)}>
          {editing ? (
            <>
              <FiX /> Cancel
            </>
          ) : (
            <>
              <FiEdit /> Edit Profile
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="lg:col-span-1">
          <div className="text-center">
            <div className="w-32 h-32 bg-primary-100 rounded-full mx-auto flex items-center justify-center mb-4">
              <span className="text-4xl font-bold text-primary-600">
                {user?.firstName?.[0]}
                {user?.lastName?.[0]}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              {user?.firstName} {user?.lastName}
            </h2>
            <p className="text-gray-600 capitalize mt-1">{user?.role}</p>
            <p className="text-sm text-gray-500 mt-2">{user?.email}</p>

            {roleData && (
              <div className="mt-6 pt-6 border-t">
                {user.role === "student" && (
                  <>
                    <div className="text-sm text-gray-600">Student ID</div>
                    <div className="font-semibold text-gray-900">
                      {roleData.studentId}
                    </div>
                    <div className="text-sm text-gray-600 mt-3">Grade</div>
                    <div className="font-semibold text-gray-900">
                      {roleData.grade}
                    </div>
                  </>
                )}
                {user.role === "teacher" && (
                  <>
                    <div className="text-sm text-gray-600">Teacher ID</div>
                    <div className="font-semibold text-gray-900">
                      {roleData.teacherId}
                    </div>
                    <div className="text-sm text-gray-600 mt-3">Department</div>
                    <div className="font-semibold text-gray-900">
                      {roleData.department}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </Card>

        {/* Details Card */}
        <Card title="Personal Information" className="lg:col-span-2">
          {editing ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />

                <Input
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />

                <Input
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled
                />

                <Input
                  label="Phone"
                  name="phone"
                  value={formData.phone || ""}
                  onChange={handleChange}
                />
              </div>

              <div className="flex gap-4">
                <Button type="submit">
                  <FiSave /> Save Changes
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setEditing(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600">Full Name</p>
                  <p className="font-medium text-gray-900">
                    {user?.firstName} {user?.lastName}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium text-gray-900">{user?.email}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-medium text-gray-900">
                    {user?.phone || "Not provided"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Date of Birth</p>
                  <p className="font-medium text-gray-900">
                    {user?.dateOfBirth
                      ? format(new Date(user.dateOfBirth), "MMM dd, yyyy")
                      : "Not provided"}
                  </p>
                </div>
              </div>

              {user?.address && (
                <div className="pt-4 border-t">
                  <p className="text-sm text-gray-600 mb-2">Address</p>
                  <p className="font-medium text-gray-900">
                    {user.address.street && `${user.address.street}, `}
                    {user.address.city && `${user.address.city}, `}
                    {user.address.state} {user.address.zipCode}
                  </p>
                </div>
              )}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
