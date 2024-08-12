import React, { useState, useEffect } from "react";
import {
  MenuIcon,
  XIcon,
  UserIcon,
  GlobeIcon,
  CogIcon,
  RefreshIcon,
} from "@heroicons/react/outline";
import { Transition } from "@headlessui/react";

function App() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", role: "" });
  const [notifications, setNotifications] = useState([]);
  const [users, setUsers] = useState([
    {
      name: "John Doe",
      email: "john@example.com",
      role: "Admin",
      status: "Active",
    },
    {
      name: "Jane Smith",
      email: "jane@example.com",
      role: "User",
      status: "Inactive",
    },
    {
      name: "Sam Wilson",
      email: "sam@example.com",
      role: "Editor",
      status: "Active",
    },
  ]);

  useEffect(() => {
    // Simulate data fetching
    const fetchData = async () => {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setNotifications([
          { type: "info", message: "New user registered" },
          { type: "success", message: "New sale completed" },
          { type: "error", message: "Server error reported" },
        ]);
      }, 2000);
    };
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setUsers([...users, { ...formData, status: "Active" }]);
      setFormData({ name: "", email: "", role: "" });
    }, 1000);
  };

  const handleDismissNotification = (index) => {
    setNotifications(notifications.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-dark-bg">
      {/* Sidebar */}
      <Transition
        show={isSidebarOpen}
        enter="transition-transform duration-300 transform"
        enterFrom="-translate-x-full"
        enterTo="translate-x-0"
        leave="transition-transform duration-300 transform"
        leaveFrom="translate-x-0"
        leaveTo="-translate-x-full"
      >
        <aside className="w-full md:w-64 bg-dark-card p-4">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-white">Defengate</h1>
            <button className="md:hidden" onClick={() => setSidebarOpen(false)}>
              <XIcon className="h-6 w-6 text-white" />
            </button>
          </div>
          <nav>
            <ul className="space-y-4">
              {["WAF", "AntiDDoS", "CDN", "Настройки ресурса"].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="flex items-center text-white hover:bg-gray-700 p-2 rounded-lg transition-colors duration-300"
                  >
                    <UserIcon className="h-6 w-6 text-white" />
                    <span className="ml-3">{item}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
      </Transition>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="flex items-center justify-between bg-dark-card p-4 shadow-md">
          <button className="md:hidden" onClick={() => setSidebarOpen(true)}>
            <MenuIcon className="h-6 w-6 text-white" />
          </button>
          <h2 className="text-xl font-bold text-white">Dashboard</h2>
          <div className="flex items-center space-x-4">
            <button className="p-2 bg-gray-700 rounded-full hover:bg-gray-600 transition-colors duration-300">
              <RefreshIcon className="h-6 w-6 text-white" />
            </button>
            <button className="p-2 bg-gray-700 rounded-full hover:bg-gray-600 transition-colors duration-300">
              <CogIcon className="h-6 w-6 text-white" />
            </button>
          </div>
        </header>

        <main className="p-4 flex-1">
          {/* Stats Cards */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {["Total Users", "Sales", "New Signups", "Active Sessions"].map(
              (title, index) => (
                <div
                  key={index}
                  className="bg-dark-card p-6 rounded-lg shadow-md transition-transform transform hover:scale-105"
                >
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {title}
                  </h3>
                  <p className="text-2xl font-bold text-white">
                    {index === 0
                      ? "12,345"
                      : index === 1
                      ? "$34,567"
                      : index === 2
                      ? "456"
                      : "789"}
                  </p>
                </div>
              )
            )}
          </section>

          {/* User Table */}
          <section className="bg-dark-card p-6 rounded-lg shadow-md mb-8">
            <h3 className="text-xl font-semibold text-white mb-4">User List</h3>
            {loading ? (
              <div className="flex items-center justify-center h-48">
                <svg
                  className="w-8 h-8 text-white animate-spin"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 0 1 8-8v8H4zm16 0a8 8 0 0 0-8 8v-8h8z"
                  ></path>
                </svg>
              </div>
            ) : (
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="text-gray-400">
                    <th className="pb-2">Name</th>
                    <th className="pb-2">Email</th>
                    <th className="pb-2">Role</th>
                    <th className="pb-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <tr
                      key={index}
                      className="border-b border-dark-border transition-transform hover:bg-gray-800"
                    >
                      <td className="py-2">{user.name}</td>
                      <td className="py-2">{user.email}</td>
                      <td className="py-2">{user.role}</td>
                      <td className="py-2">{user.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>

          {/* Form Example */}
          <section className="bg-dark-card p-6 rounded-lg shadow-md mb-8">
            <h3 className="text-xl font-semibold text-white mb-4">
              Add New User
            </h3>
            <form className="space-y-4" onSubmit={handleFormSubmit}>
              <div>
                <label className="block text-gray-400 mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                  placeholder="Enter name"
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                  placeholder="Enter email"
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-2">Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                >
                  <option value="">Select role</option>
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                  <option value="editor">Editor</option>
                </select>
              </div>
              <button
                type="submit"
                className={`w-full px-4 py-2 rounded-lg ${
                  loading
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600"
                } text-white transition-colors duration-300`}
                disabled={loading}
              >
                {loading ? "Adding User..." : "Add User"}
              </button>
            </form>
          </section>

          {/* Notifications Example */}
          <section className="bg-dark-card p-6 rounded-lg shadow-md mb-8">
            <h3 className="text-xl font-semibold text-white mb-4">
              Notifications
            </h3>
            <div className="space-y-4">
              {notifications.map((notification, index) => (
                <Transition
                  key={index}
                  show={true}
                  enter="transition-opacity duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="transition-opacity duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div
                    className={`flex items-center justify-between p-4 rounded-lg ${
                      notification.type === "info"
                        ? "bg-blue-500"
                        : notification.type === "success"
                        ? "bg-green-500"
                        : "bg-red-500"
                    } text-white`}
                  >
                    <span>{notification.message}</span>
                    <button
                      className="text-white hover:text-gray-200"
                      onClick={() => handleDismissNotification(index)}
                    >
                      <XIcon className="h-5 w-5" />
                    </button>
                  </div>
                </Transition>
              ))}
            </div>
          </section>

          {/* Modal Example */}
          <section className="mb-8">
            <h3 className="text-xl font-semibold text-white mb-4">
              Open Modal
            </h3>
            <button
              onClick={() => alert("Modal Opened")}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-300"
            >
              Open Modal
            </button>
          </section>
        </main>
      </div>
    </div>
  );
}

export default App;
