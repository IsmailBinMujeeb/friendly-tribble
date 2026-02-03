import {
  FiAward,
  FiBarChart2,
  FiBell,
  FiBook,
  FiCalendar,
  FiChevronRight,
  FiHome,
  FiLogOut,
  FiUser,
  FiUsers,
} from "react-icons/fi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

// ==================== Layout Components ====================
export const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = {
    admin: [
      { icon: FiHome, label: "Dashboard", path: "/admin/dashboard" },
      { icon: FiUsers, label: "Students", path: "/admin/students" },
      { icon: FiUsers, label: "Teachers", path: "/admin/teachers" },
      { icon: FiBook, label: "Courses", path: "/admin/courses" },
      { icon: FiCalendar, label: "Enrollments", path: "/admin/enrollments" },
      { icon: FiBell, label: "Announcements", path: "/admin/announcements" },
      { icon: FiBarChart2, label: "Reports", path: "/admin/reports" },
    ],
    teacher: [
      { icon: FiHome, label: "Dashboard", path: "/teacher/dashboard" },
      { icon: FiBook, label: "My Courses", path: "/teacher/courses" },
      { icon: FiCalendar, label: "Attendance", path: "/teacher/attendance" },
      { icon: FiAward, label: "Grades", path: "/teacher/grades" },
      { icon: FiBell, label: "Announcements", path: "/announcements" },
    ],
    student: [
      { icon: FiHome, label: "Dashboard", path: "/student/dashboard" },
      { icon: FiBook, label: "My Courses", path: "/student/courses" },
      { icon: FiCalendar, label: "Attendance", path: "/student/attendance" },
      { icon: FiAward, label: "Grades", path: "/student/grades" },
      { icon: FiBell, label: "Announcements", path: "/announcements" },
    ],
  };

  const items = menuItems[user?.role] || [];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={onClose}
        ></div>
      )}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-30 w-64 bg-gradient-to-b from-primary-800 to-primary-900 text-white transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-primary-700">
            <h1 className="text-2xl font-bold">FastClass</h1>
            <p className="text-primary-200 text-sm mt-1">Management System</p>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {items.map((item, idx) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={idx}
                  to={item.path}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? "bg-primary-700 text-white shadow-md"
                      : "text-primary-100 hover:bg-primary-700 hover:text-white"
                  }`}
                >
                  <item.icon size={20} />
                  <span className="font-medium">{item.label}</span>
                  {isActive && <FiChevronRight className="ml-auto" />}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-primary-700">
            <Link
              to="/profile"
              onClick={onClose}
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-primary-700 transition-all mb-2"
            >
              <FiUser size={20} />
              <span className="font-medium">Profile</span>
            </Link>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-600 transition-all text-left"
            >
              <FiLogOut size={20} />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
