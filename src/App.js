// src/App.js
import React, { useState } from "react";
import { MenuIcon, BellIcon, SearchIcon } from "@heroicons/react/outline";

function App() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-dark-bg">
      {/* Sidebar */}
      <aside
        className={`w-full md:w-64 bg-dark-card p-4 ${
          isSidebarOpen ? "block" : "hidden"
        } md:block`}
      >
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white">Info System</h1>
          <button className="md:hidden" onClick={() => setSidebarOpen(false)}>
            <MenuIcon className="h-6 w-6 text-white" />
          </button>
        </div>
        <nav>
          <ul className="space-y-4">
            <li>
              <a
                href="#"
                className="flex items-center text-white hover:bg-gray-700 p-2 rounded-lg"
              >
                <span className="ml-3">Dashboard</span>
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center text-white hover:bg-gray-700 p-2 rounded-lg"
              >
                <span className="ml-3">Users</span>
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center text-white hover:bg-gray-700 p-2 rounded-lg"
              >
                <span className="ml-3">Reports</span>
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center text-white hover:bg-gray-700 p-2 rounded-lg"
              >
                <span className="ml-3">Settings</span>
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="flex items-center justify-between bg-dark-card p-4 shadow-md">
          <button className="md:hidden" onClick={() => setSidebarOpen(true)}>
            <MenuIcon className="h-6 w-6 text-white" />
          </button>
          <h2 className="text-xl font-bold text-white">Dashboard</h2>
          <div className="flex items-center space-x-4">
            <SearchIcon className="h-6 w-6 text-white" />
            <BellIcon className="h-6 w-6 text-white" />
          </div>
        </header>

        <main className="p-4 flex-1">
          {/* Stats Cards */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-dark-card p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-white mb-2">
                Total Users
              </h3>
              <p className="text-2xl font-bold text-white">12,345</p>
            </div>
            <div className="bg-dark-card p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-white mb-2">Sales</h3>
              <p className="text-2xl font-bold text-white">$34,567</p>
            </div>
            <div className="bg-dark-card p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-white mb-2">
                New Signups
              </h3>
              <p className="text-2xl font-bold text-white">456</p>
            </div>
            <div className="bg-dark-card p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-white mb-2">
                Active Sessions
              </h3>
              <p className="text-2xl font-bold text-white">789</p>
            </div>
          </section>

          {/* User Table */}
          <section className="bg-dark-card p-6 rounded-lg shadow-md mb-8">
            <h3 className="text-xl font-semibold text-white mb-4">User List</h3>
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
                <tr className="border-b border-dark-border">
                  <td className="py-2">John Doe</td>
                  <td className="py-2">john@example.com</td>
                  <td className="py-2">Admin</td>
                  <td className="py-2">Active</td>
                </tr>
                <tr className="border-b border-dark-border">
                  <td className="py-2">Jane Smith</td>
                  <td className="py-2">jane@example.com</td>
                  <td className="py-2">User</td>
                  <td className="py-2">Inactive</td>
                </tr>
                <tr>
                  <td className="py-2">Sam Wilson</td>
                  <td className="py-2">sam@example.com</td>
                  <td className="py-2">Editor</td>
                  <td className="py-2">Active</td>
                </tr>
              </tbody>
            </table>
          </section>

          {/* Form Example */}
          <section className="bg-dark-card p-6 rounded-lg shadow-md mb-8">
            <h3 className="text-xl font-semibold text-white mb-4">
              Add New User
            </h3>
            <form className="space-y-4">
              <div>
                <label className="block text-gray-400 mb-2">Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-white"
                  placeholder="Enter name"
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-2">Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-white"
                  placeholder="Enter email"
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-2">Role</label>
                <select className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-white">
                  <option value="">Select role</option>
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                  <option value="editor">Editor</option>
                </select>
              </div>
              <button className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                Add User
              </button>
            </form>
          </section>

          {/* Notifications Example */}
          <section className="bg-dark-card p-6 rounded-lg shadow-md mb-8">
            <h3 className="text-xl font-semibold text-white mb-4">
              Notifications
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-blue-500 text-white px-4 py-3 rounded-lg">
                <span>New user registered</span>
                <button className="text-white hover:text-gray-200">
                  Dismiss
                </button>
              </div>
              <div className="flex items-center justify-between bg-green-500 text-white px-4 py-3 rounded-lg">
                <span>New sale completed</span>
                <button className="text-white hover:text-gray-200">
                  Dismiss
                </button>
              </div>
              <div className="flex items-center justify-between bg-red-500 text-white px-4 py-3 rounded-lg">
                <span>Server error reported</span>
                <button className="text-white hover:text-gray-200">
                  Dismiss
                </button>
              </div>
            </div>
          </section>

          {/* Modal Example */}
          <section className="mb-8">
            <h3 className="text-xl font-semibold text-white mb-4">
              Open Modal
            </h3>
            <button
              onClick={() => alert("Modal Opened")}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
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
