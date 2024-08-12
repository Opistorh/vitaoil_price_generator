import React, { useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  ChevronDownIcon,
  PlusIcon,
  XIcon,
  MenuIcon,
  SearchIcon,
  UserIcon,
  BadgeCheckIcon,
} from "@heroicons/react/outline";
import {
  TextField,
  Button,
  Pagination,
  Breadcrumbs,
  Avatar,
  Badge,
  Chip,
  Tooltip,
} from "@mui/material"; // Ensure you have @mui/material installed

function App() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", role: "" });
  const [notifications, setNotifications] = useState([]);
  const [rating, setRating] = useState(0);
  const [sliderValue, setSliderValue] = useState(50);
  const [switchChecked, setSwitchChecked] = useState(false);
  const [autocompleteValue, setAutocompleteValue] = useState("");
  const [bottomNavValue, setBottomNavValue] = useState("home");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("Dialog Title");

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDismissNotification = (index) => {
    setNotifications(notifications.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <header className="bg-gray-800 p-4 shadow-md">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Demo UI</h1>
          <MenuIcon
            className="h-6 w-6 text-white cursor-pointer"
            onClick={() => setDrawerOpen(true)}
          />
        </div>
      </header>
      <div className="flex flex-1">
        <aside
          className={`fixed inset-0 bg-gray-800 bg-opacity-75 transition-transform transform ${
            drawerOpen ? "translate-x-0" : "-translate-x-full"
          } z-50`}
        >
          <div className="w-64 bg-gray-800 p-4 space-y-4">
            <button className="text-white">Dashboard</button>
            <button className="text-white">Projects</button>
            <button className="text-white">Settings</button>
            <button className="text-white">Help</button>
            <button
              onClick={() => setDrawerOpen(false)}
              className="text-white absolute top-4 right-4"
            >
              <XIcon className="h-6 w-6" />
            </button>
          </div>
        </aside>
        <main className="flex-1 p-6">
          <section className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-2xl font-bold mb-4">Forms</h2>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <TextField
                  label="Name"
                  variant="outlined"
                  fullWidth
                  value={formData.name}
                  onChange={handleInputChange}
                  name="name"
                />
              </div>
              <div>
                <TextField
                  label="Email"
                  variant="outlined"
                  fullWidth
                  value={formData.email}
                  onChange={handleInputChange}
                  name="email"
                />
              </div>
              <div>
                <TextField
                  label="Role"
                  variant="outlined"
                  fullWidth
                  value={formData.role}
                  onChange={handleInputChange}
                  name="role"
                />
              </div>
              <Button type="submit" variant="contained" color="primary">
                Submit
              </Button>
            </form>
          </section>

          <section className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-2xl font-bold mb-4">Buttons</h2>
            <div className="space-y-4">
              <Button variant="contained" color="primary">
                Primary Button
              </Button>
              <Button variant="outlined" color="secondary">
                Outlined Button
              </Button>
              <Button variant="text" color="default">
                Text Button
              </Button>
              <div className="flex space-x-2">
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<PlusIcon className="h-5 w-5" />}
                >
                  With Icon
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  className="fixed right-4 bottom-4"
                >
                  <PlusIcon className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </section>

          <section className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-2xl font-bold mb-4">Interactive Elements</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Checkbox</label>
                <input
                  type="checkbox"
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Radio</label>
                <input
                  type="radio"
                  name="radio"
                  className="form-radio h-5 w-5 text-blue-600"
                />{" "}
                Option 1
                <input
                  type="radio"
                  name="radio"
                  className="form-radio h-5 w-5 text-blue-600 ml-4"
                />{" "}
                Option 2
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Rating</label>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      onClick={() => setRating(value)}
                      className={`h-6 w-6 ${
                        rating >= value ? "text-yellow-400" : "text-gray-300"
                      }`}
                    >
                      &#9733;
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Slider</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={sliderValue}
                  onChange={(e) => setSliderValue(e.target.value)}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Switch</label>
                <input
                  type="checkbox"
                  checked={switchChecked}
                  onChange={() => setSwitchChecked(!switchChecked)}
                  className="form-switch h-5 w-10 text-blue-600"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Autocomplete</label>
                <input
                  type="text"
                  value={autocompleteValue}
                  onChange={(e) => setAutocompleteValue(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Type to autocomplete..."
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">
                  Multiline Input
                </label>
                <textarea
                  rows="4"
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Type your text here..."
                />
              </div>
            </div>
          </section>

          <section className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-2xl font-bold mb-4">Navigation</h2>
            <div className="space-y-4">
              <div className="flex space-x-2">
                <button
                  onClick={() => setBottomNavValue("home")}
                  className={`p-2 rounded ${
                    bottomNavValue === "home"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  Home
                </button>
                <button
                  onClick={() => setBottomNavValue("projects")}
                  className={`p-2 rounded ${
                    bottomNavValue === "projects"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  Projects
                </button>
                <button
                  onClick={() => setBottomNavValue("settings")}
                  className={`p-2 rounded ${
                    bottomNavValue === "settings"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  Settings
                </button>
                <button
                  onClick={() => setBottomNavValue("help")}
                  className={`p-2 rounded ${
                    bottomNavValue === "help"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  Help
                </button>
              </div>
              <div>
                <Breadcrumbs
                  separator={
                    <ChevronDownIcon className="h-5 w-5 text-gray-600" />
                  }
                  aria-label="breadcrumb"
                >
                  <a href="#" className="text-blue-500">
                    Home
                  </a>
                  <a href="#" className="text-blue-500">
                    Projects
                  </a>
                  <span className="text-gray-500">Current Page</span>
                </Breadcrumbs>
              </div>
              <div>
                <Pagination count={10} color="primary" />
              </div>
              <div>
                <div className="flex justify-end">
                  <button
                    onClick={() => setDialogOpen(true)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300"
                  >
                    Open Dialog
                  </button>
                </div>
                <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold mb-4">
                      {dialogTitle}
                    </h3>
                    <p className="mb-4">This is a dialog content.</p>
                    <button
                      onClick={() => setDialogOpen(false)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300"
                    >
                      Close
                    </button>
                  </div>
                </Dialog>
              </div>
            </div>
          </section>

          <section className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-2xl font-bold mb-4">Cards & Paper</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-2">Card Title</h3>
                <p className="mb-4">Card content goes here.</p>
                <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300">
                  Action
                </button>
              </div>
              <div className="bg-gray-200 p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-2">Paper Title</h3>
                <p className="mb-4">Paper content goes here.</p>
                <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300">
                  Action
                </button>
              </div>
            </div>
          </section>

          <section className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-2xl font-bold mb-4">Data Tables</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">John Doe</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      john.doe@example.com
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">Admin</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">Jane Smith</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      jane.smith@example.com
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">User</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-2xl font-bold mb-4">Avatar & Badges</h2>
            <div className="flex space-x-4 items-center">
              <Avatar
                alt="User Avatar"
                src="/path/to/avatar.jpg"
                className="h-16 w-16"
              />
              <Badge badgeContent={4} color="primary">
                <UserIcon className="h-16 w-16 text-gray-500" />
              </Badge>
              <Chip label="Chip Label" color="primary" />
            </div>
          </section>

          <section className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-2xl font-bold mb-4">Alerts & Progress</h2>
            <div className="space-y-4">
              <div className="p-4 bg-red-100 border border-red-300 text-red-800 rounded-lg">
                <p className="text-sm font-medium">Error Alert</p>
              </div>
              <div className="p-4 bg-yellow-100 border border-yellow-300 text-yellow-800 rounded-lg">
                <p className="text-sm font-medium">Warning Alert</p>
              </div>
              <div className="p-4 bg-green-100 border border-green-300 text-green-800 rounded-lg">
                <p className="text-sm font-medium">Success Alert</p>
              </div>
              <div>
                <div className="relative pt-1">
                  <div className="flex mb-2 items-center justify-between">
                    <div className="text-xs font-semibold inline-block py-1 px-2 rounded text-blue-600 bg-blue-200">
                      Progress
                    </div>
                  </div>
                  <div className="flex">
                    <div className="relative flex-grow w-full bg-gray-200 rounded">
                      <div
                        className="absolute top-0 left-0 h-full bg-blue-600 rounded"
                        style={{ width: "50%" }}
                      />
                    </div>
                    <span className="text-xs font-semibold inline-block px-2 py-1 rounded text-blue-600 bg-blue-200 ml-2">
                      50%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-2xl font-bold mb-4">Tooltips & Skeletons</h2>
            <div className="space-y-4">
              <Tooltip title="Tooltip Content" arrow>
                <button className="px-4 py-2 bg-blue-500 text-white rounded-lg">
                  Hover me
                </button>
              </Tooltip>
              <div className="bg-gray-200 p-6 rounded-lg">
                <div className="animate-pulse flex space-x-4">
                  <div className="flex-1 space-y-6 py-1">
                    <div className="h-4 bg-gray-300 rounded"></div>
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default App;
