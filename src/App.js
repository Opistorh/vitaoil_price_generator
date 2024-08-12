import React, { useState } from 'react';
import {
  MenuIcon,
  XIcon,
  UserIcon,
  GlobeIcon,
  CogIcon,
  RefreshIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  CheckIcon,
  ExclamationCircleIcon,
  CalendarIcon,
  TrashIcon,
  ArrowRightIcon,
  PlusIcon,
  MinusIcon,
  StarIcon,
  SparklesIcon,
} from '@heroicons/react/outline';
import { Transition } from '@headlessui/react';
import { Dialog } from '@headlessui/react';
import Tooltip from '@mui/material/Tooltip';
import Slider from '@mui/material/Slider';
import Switch from '@mui/material/Switch';
import Checkbox from '@mui/material/Checkbox';
import Radio from '@mui/material/Radio';
import Rating from '@mui/material/Rating';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { Pagination } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

const menuItems = ['WAF', 'AntiDDoS', 'CDN', 'Настройки ресурса'];
const sampleUsers = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'Inactive' },
  { id: 3, name: 'Sam Wilson', email: 'sam@example.com', role: 'Editor', status: 'Active' },
];

function App() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', role: '' });
  const [notifications, setNotifications] = useState([]);
  const [users, setUsers] = useState(sampleUsers);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [sliderValue, setSliderValue] = useState(50);
  const [switchChecked, setSwitchChecked] = useState(false);
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const [radioValue, setRadioValue] = useState('option1');
  const [ratingValue, setRatingValue] = useState(2);
  const [autocompleteValue, setAutocompleteValue] = useState(null);
  const [paginationPage, setPaginationPage] = useState(1);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setUsers([...users, { id: users.length + 1, ...formData, status: 'Active' }]);
      setFormData({ name: '', email: '', role: '' });
    }, 1000);
  };

  const handleDismissNotification = (index) => {
    setNotifications(notifications.filter((_, i) => i !== index));
  };

  const handleSliderChange = (event, newValue) => {
    setSliderValue(newValue);
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
              {menuItems.map((item) => (
                <li key={item}>
                  <a href="#" className="flex items-center text-white hover:bg-gray-700 p-2 rounded-lg transition-colors duration-300">
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

        <main className="flex-1">
  <div className="p-6">
    {/* Form Section */}
    <section className="bg-dark-card p-6 rounded-lg shadow-md mb-8">
      <h2 className="text-2xl font-bold text-white mb-4">Add User</h2>
      <form onSubmit={handleFormSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-400 mb-2">Name</label>
          <TextField
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            variant="outlined"
            className="w-full bg-dark-bg text-white"
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
            className="w-full bg-dark-bg text-white"
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
            className="w-full bg-dark-bg text-white"
            placeholder="Enter role"
          />
        </div>
        <button
          type="submit"
          className={`w-full px-4 py-2 rounded-lg ${loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'} text-white transition-colors duration-300`}
          disabled={loading}
        >
          {loading ? 'Adding User...' : 'Add User'}
        </button>
      </form>
    </section>

    {/* Notifications Example */}
    <section className="bg-dark-card p-6 rounded-lg shadow-md mb-8">
      <h3 className="text-xl font-semibold text-white mb-4">Notifications</h3>
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
              className={`flex items-center justify-between p-4 rounded-lg ${notification.type === 'info' ? 'bg-blue-500' : notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white`}
            >
              <span>{notification.message}</span>
              <button className="text-white hover:text-gray-200" onClick={() => handleDismissNotification(index)}>
                <XIcon className="h-5 w-5" />
              </button>
            </div>
          </Transition>
        ))}
      </div>
    </section>

    {/* Modal Example */}
    <section className="mb-8">
      <h3 className="text-xl font-semibold text-white mb-4">Open Modal</h3>
      <button
        onClick={() => setDialogOpen(true)}
        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-300"
      >
        Open Modal
      </button>
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <div className="bg-dark-card p-6 rounded-lg">
          <h3 className="text-xl font-semibold text-white mb-4">Modal Title</h3>
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

    {/* Additional UI Elements */}
    <section className="bg-dark-card p-6 rounded-lg shadow-md mb-8">
      <h3 className="text-xl font-semibold text-white mb-4">Additional UI Elements</h3>
      <div className="space-y-4">
        {/* Add the additional UI elements here */}
      </div>
    </section>
  </div>
</main>

              {/* Icon Button */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">Icon Button</h4>
                <button className="p-2 bg-gray-700 rounded-full hover:bg-gray-600 transition-colors duration-300">
                  <PlusIcon className="h-6 w-6 text-white" />
                </button>
              </div>

              {/* Floating Action Button (FAB) */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">FAB</h4>
                <button className="fixed bottom-4 right-4 p-4 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-colors duration-300">
                  <PlusIcon className="h-8 w-8" />
                </button>
              </div>

              {/* Checkbox */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">Checkbox</h4>
                <Checkbox checked={checkboxChecked} onChange={(e) => setCheckboxChecked(e.target.checked)} />
              </div>

              {/* Radio */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">Radio</h4>
                <div className="flex space-x-4">
                  <label>
                    <Radio
                      checked={radioValue === 'option1'}
                      onChange={() => setRadioValue('option1')}
                    />
                    Option 1
                  </label>
                  <label>
                    <Radio
                      checked={radioValue === 'option2'}
                      onChange={() => setRadioValue('option2')}
                    />
                    Option 2
                  </label>
                </div>
              </div>

              {/* Rating */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">Rating</h4>
                <Rating
                  name="rating"
                  value={ratingValue}
                  onChange={(event, newValue) => setRatingValue(newValue)}
                />
              </div>

              {/* Slider */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">Slider</h4>
                <Slider
                  value={sliderValue}
                  onChange={handleSliderChange}
                  aria-labelledby="continuous-slider"
                />
              </div>

              {/* Switch */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">Switch</h4>
                <Switch checked={switchChecked} onChange={(e) => setSwitchChecked(e.target.checked)} />
              </div>

              {/* Autocomplete */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">Autocomplete</h4>
                <Autocomplete
                  value={autocompleteValue}
                  onChange={(event, newValue) => setAutocompleteValue(newValue)}
                  options={['Option 1', 'Option 2', 'Option 3']}
                  renderInput={(params) => <TextField {...params} label="Autocomplete" variant="outlined" />}
                />
              </div>

              {/* Text Field */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">Text Field</h4>
                <TextField variant="outlined" label="Text Field" className="w-full bg-dark-bg text-white" />
              </div>

              {/* Multiline Text Field */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">Multiline Text Field</h4>
                <TextField
                  variant="outlined"
                  label="Multiline"
                  multiline
                  rows={4}
                  className="w-full bg-dark-bg text-white"
                />
              </div>

              {/* Bottom Navigation */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">Bottom Navigation</h4>
                <div className="fixed bottom-0 left-0 right-0 bg-dark-card p-2 flex justify-around">
                  <button className="text-white">Home</button>
                  <button className="text-white">Search</button>
                  <button className="text-white">Profile</button>
                </div>
              </div>

              {/* Breadcrumbs */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">Breadcrumbs</h4>
                <nav className="text-gray-400">
                  <a href="#" className="hover:text-white">Home</a> &gt; 
                  <a href="#" className="hover:text-white">Library</a> &gt; 
                  <a href="#" className="hover:text-white">Data</a>
                </nav>
              </div>

              {/* Drawer */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">Drawer</h4>
                <button onClick={() => setSidebarOpen(true)} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300">
                  Open Drawer
                </button>
              </div>

              {/* Link */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">Link</h4>
                <a href="#" className="text-blue-400 hover:text-blue-600">This is a link</a>
              </div>

              {/* Menu */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">Menu</h4>
                <div className="relative inline-block text-left">
                  <button className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors duration-300">
                    Menu
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-dark-card rounded-lg shadow-lg">
                    <a href="#" className="block px-4 py-2 text-white hover:bg-gray-700">Item 1</a>
                    <a href="#" className="block px-4 py-2 text-white hover:bg-gray-700">Item 2</a>
                    <a href="#" className="block px-4 py-2 text-white hover:bg-gray-700">Item 3</a>
                  </div>
                </div>
              </div>

              {/* Pagination */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">Pagination</h4>
                <Pagination
                  count={10}
                  page={paginationPage}
                  onChange={(event, page) => setPaginationPage(page)}
                />
              </div>

              {/* Speed Dial */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">Speed Dial</h4>
                <div className="fixed bottom-4 right-4">
                  <button className="p-4 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-colors duration-300">
                    <PlusIcon className="h-8 w-8" />
                  </button>
                </div>
              </div>

              {/* Stepper */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">Stepper</h4>
                <div className="flex space-x-4">
                  {[1, 2, 3].map((step) => (
                    <div key={step} className="flex items-center space-x-2">
                      <div className={`w-8 h-8 flex items-center justify-center rounded-full ${step <= 2 ? 'bg-blue-500' : 'bg-gray-500'} text-white`}>
                        {step}
                      </div>
                      {step < 3 && <ArrowRightIcon className="h-6 w-6 text-gray-500" />}
                    </div>
                  ))}
                </div>
              </div>

              {/* Tabs */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">Tabs</h4>
                <div className="border-b border-gray-700">
                  <button className="px-4 py-2 text-white border-b-2 border-blue-500">Tab 1</button>
                  <button className="px-4 py-2 text-gray-400 hover:text-white">Tab 2</button>
                  <button className="px-4 py-2 text-gray-400 hover:text-white">Tab 3</button>
                </div>
                <div className="p-4 bg-dark-card rounded-lg mt-2">
                  <p className="text-white">Content for selected tab.</p>
                </div>
              </div>

              {/* Accordion */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">Accordion</h4>
                <div className="border border-gray-700 rounded-lg">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="border-b border-gray-700">
                      <button className="w-full px-4 py-2 text-white flex justify-between items-center focus:outline-none">
                        <span>Accordion Item {item}</span>
                        <ChevronDownIcon className="h-5 w-5 text-white" />
                      </button>
                      <div className="p-4 bg-dark-card hidden">
                        <p className="text-gray-400">Content for Accordion Item {item}.</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* App Bar */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">App Bar</h4>
                <header className="bg-dark-card p-4 rounded-lg shadow-md">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-white">App Bar</h2>
                    <div className="flex items-center space-x-4">
                      <button className="p-2 bg-gray-700 rounded-full hover:bg-gray-600 transition-colors duration-300">
                        <UserIcon className="h-6 w-6 text-white" />
                      </button>
                      <button className="p-2 bg-gray-700 rounded-full hover:bg-gray-600 transition-colors duration-300">
                        <GlobeIcon className="h-6 w-6 text-white" />
                      </button>
                    </div>
                  </div>
                </header>
              </div>

              {/* Card */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">Card</h4>
                <div className="bg-dark-card p-4 rounded-lg shadow-lg">
                  <h3 className="text-xl font-semibold text-white mb-2">Card Title</h3>
                  <p className="text-gray-400">This is a card with some content.</p>
                </div>
              </div>

              {/* Paper / Elevation */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">Paper / Elevation</h4>
                <div className="bg-dark-card p-6 rounded-lg shadow-lg">
                  <p className="text-gray-400">This is a paper element with elevation.</p>
                </div>
              </div>

              {/* Alert */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">Alert</h4>
                <div className="bg-red-500 text-white p-4 rounded-lg flex items-center">
                  <ExclamationCircleIcon className="h-6 w-6 mr-2" />
                  <span>This is an alert message.</span>
                </div>
              </div>

              {/* Backdrop */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">Backdrop</h4>
                <div className="relative">
                  <button onClick={() => setDialogOpen(true)} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300">
                    Open Backdrop
                  </button>
                  <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
                    <div className="bg-dark-card p-6 rounded-lg">
                      <h3 className="text-xl font-semibold text-white mb-4">Backdrop</h3>
                      <p className="text-gray-300 mb-4">This is a backdrop example.</p>
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

              {/* Dialog */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">Dialog</h4>
                <button onClick={() => setDialogOpen(true)} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-300">
                  Open Dialog
                </button>
                <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
                  <div className="bg-dark-card p-6 rounded-lg">
                    <h3 className="text-xl font-semibold text-white mb-4">Dialog Title</h3>
                    <p className="text-gray-300 mb-4">This is a dialog box.</p>
                    <button
                      onClick={() => setDialogOpen(false)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300"
                    >
                      Close
                    </button>
                  </div>
                </Dialog>
              </div>

              {/* Progress */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">Progress</h4>
                <div className="relative pt-1">
                  <div className="flex mb-2 items-center justify-between">
                    <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-teal-600 bg-teal-200">
                      Progress
                    </span>
                  </div>
                  <div className="flex">
                    <div className="relative w-full flex-grow">
                      <div className="flex h-2 overflow-hidden text-xs relative pt-1">
                        <div className="flex flex-col">
                          <div className="bg-blue-600 text-xs leading-none py-1 text-center text-white" style={{ width: '70%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default App;
