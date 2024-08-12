import React, { useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  ArrowRightIcon,
  PlusIcon,
  UserIcon,
  GlobeIcon,
  ChevronDownIcon,
  ExclamationCircleIcon,
  XIcon,
} from "@heroicons/react/outline";

import { Pagination, TextField } from "@mui/material"; // Ensure you have @mui/material installed

function App() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", role: "" });
  const [notifications, setNotifications] = useState([
    { type: "info", message: "Information message" },
    { type: "success", message: "Success message" },
    { type: "error", message: "Error message" },
  ]);
  const [paginationPage, setPaginationPage] = useState(1);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate form submission
    setTimeout(() => {
      setLoading(false);
      setFormData({ name: "", email: "", role: "" });
      setNotifications([
        ...notifications,
        { type: "success", message: "User added successfully!" },
      ]);
    }, 2000);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDismissNotification = (index) => {
    setNotifications(notifications.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-gray-900 min-h-screen flex flex-col">
      <header className="bg-gray-800 p-4 shadow-md">
        <h1 className="text-2xl font-bold text-white">Defengate</h1>
      </header>
      <div className="flex flex-1">
        <aside className="w-64 bg-gray-800 p-4 space-y-4">
          <div className="text-white">
            <h4 className="text-lg font-semibold">WAF</h4>
          </div>
          <div className="text-white">
            <h4 className="text-lg font-semibold">AntiDDoS</h4>
          </div>
          <div className="text-white">
            <h4 className="text-lg font-semibold">CDN</h4>
          </div>
          <div className="text-white">
            <h4 className="text-lg font-semibold">Настройки ресурса</h4>
          </div>
        </aside>
        <main className="flex-1 p-6">
          <section className="bg-gray-800 p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Add User</h2>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-400 mb-2">Name</label>
                <TextField
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  variant="outlined"
                  className="w-full bg-gray-900 text-white"
                  placeholder="Enter name"
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-2">Email</label>
                <TextField
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  variant="outlined"
                  className="w-full bg-gray-900 text-white"
                  placeholder="Enter email"
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-2">Role</label>
                <TextField
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  variant="outlined"
                  className="w-full bg-gray-900 text-white"
                  placeholder="Enter role"
                />
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

          <section className="bg-gray-800 p-6 rounded-lg shadow-md mb-8">
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

          <section className="bg-gray-800 p-6 rounded-lg shadow-md mb-8">
            <h3 className="text-xl font-semibold text-white mb-4">
              Open Modal
            </h3>
            <button
              onClick={() => setDialogOpen(true)}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-300"
            >
              Open Modal
            </button>
            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
              <div className="bg-gray-800 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-white mb-4">
                  Modal Title
                </h3>
                <p className="text-gray-300 mb-4">This is a modal dialog.</p>
                <button
                  onClick={() => setDialogOpen(false)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300"
                >
                  Close
                </button>
              </div>
            </Dialog>
          </section>

          <section className="bg-gray-800 p-6 rounded-lg shadow-md mb-8">
            <h3 className="text-xl font-semibold text-white mb-4">
              Additional UI Elements
            </h3>
            <div className="space-y-4">
              {/* Add the additional UI elements here */}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default App;
