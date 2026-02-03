import { FiAlertCircle, FiPlus, FiTrash2 } from "react-icons/fi";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { Input } from "../components/Input";
import { Modal } from "../components/Modal";
import { Select } from "../components/Select";
import { format } from "date-fns";
import { api } from "../lib/api";
import { useEffect, useState } from "react";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { Badge } from "../components/Badge";

export const AnnouncementsPage = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    targetAudience: ["all"],
    priority: "medium",
    expiryDate: "",
  });

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const { data } = await api.get("/announcements");
      setAnnouncements(data.data);
    } catch (error) {
      console.error("Failed to fetch announcements:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/announcements", formData);
      setShowAddModal(false);
      setFormData({
        title: "",
        content: "",
        targetAudience: ["all"],
        priority: "medium",
        expiryDate: "",
      });
      fetchAnnouncements();
      alert("Announcement created successfully!");
    } catch (error) {
      console.error("Failed to create announcement:", error);
      alert("Failed to create announcement");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this announcement?")) return;

    try {
      await api.delete(`/announcements/${id}`);
      fetchAnnouncements();
    } catch (error) {
      console.error("Failed to delete announcement:", error);
      alert("Failed to delete announcement");
    }
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: "bg-gray-100 text-gray-800",
      medium: "bg-blue-100 text-blue-800",
      high: "bg-red-100 text-red-800",
    };
    return colors[priority] || colors.medium;
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Announcements</h1>
          <p className="text-gray-600 mt-1">Create and manage announcements</p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <FiPlus /> New Announcement
        </Button>
      </div>

      <div className="grid gap-4">
        {announcements.map((announcement) => (
          <Card key={announcement._id}>
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {announcement.title}
                  </h3>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(announcement.priority)}`}
                  >
                    {announcement.priority}
                  </span>
                  <div className="flex gap-1">
                    {announcement.targetAudience.map((audience, idx) => (
                      <Badge key={idx} variant="primary">
                        {audience}
                      </Badge>
                    ))}
                  </div>
                </div>

                <p className="text-gray-700 mb-3">{announcement.content}</p>

                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>
                    By: {announcement.createdBy?.firstName}{" "}
                    {announcement.createdBy?.lastName}
                  </span>
                  <span>•</span>
                  <span>
                    {format(
                      new Date(announcement.createdAt),
                      "MMM dd, yyyy HH:mm",
                    )}
                  </span>
                  {announcement.expiryDate && (
                    <>
                      <span>•</span>
                      <span className="text-red-600">
                        Expires:{" "}
                        {format(
                          new Date(announcement.expiryDate),
                          "MMM dd, yyyy",
                        )}
                      </span>
                    </>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleDelete(announcement._id)}
                  className="text-red-600 hover:text-red-900 p-2"
                >
                  <FiTrash2 size={18} />
                </button>
              </div>
            </div>
          </Card>
        ))}

        {announcements.length === 0 && (
          <Card>
            <div className="text-center py-12">
              <FiAlertCircle className="mx-auto text-gray-400 mb-4" size={48} />
              <p className="text-gray-500 text-lg">No announcements yet</p>
              <p className="text-gray-400 text-sm mt-2">
                Create your first announcement to get started
              </p>
            </div>
          </Card>
        )}
      </div>

      {/* Add Announcement Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Create Announcement"
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            required
            placeholder="Enter announcement title"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content
            </label>
            <textarea
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              rows="5"
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
              required
              placeholder="Enter announcement content"
            ></textarea>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Priority"
              value={formData.priority}
              onChange={(e) =>
                setFormData({ ...formData, priority: e.target.value })
              }
              options={[
                { value: "low", label: "Low" },
                { value: "medium", label: "Medium" },
                { value: "high", label: "High" },
              ]}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Audience
              </label>
              <div className="space-y-2">
                {["all", "students", "teachers", "admin"].map((audience) => (
                  <label key={audience} className="flex items-center">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      checked={formData.targetAudience.includes(audience)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({
                            ...formData,
                            targetAudience: [
                              ...formData.targetAudience,
                              audience,
                            ],
                          });
                        } else {
                          setFormData({
                            ...formData,
                            targetAudience: formData.targetAudience.filter(
                              (a) => a !== audience,
                            ),
                          });
                        }
                      }}
                    />
                    <span className="ml-2 capitalize">{audience}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <Input
            label="Expiry Date (Optional)"
            type="date"
            value={formData.expiryDate}
            onChange={(e) =>
              setFormData({ ...formData, expiryDate: e.target.value })
            }
          />

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">
              Create Announcement
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowAddModal(false)}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
