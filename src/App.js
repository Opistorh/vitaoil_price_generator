import React, { useState } from "react";
import {
  Button,
  TextField,
  Dialog,
  Breadcrumbs,
  Avatar,
  Badge,
  Chip,
  Tooltip,
  Pagination,
  Slider,
  Switch,
  Divider,
  Menu,
  AppBar,
  Toolbar,
  IconButton,
  Snackbar,
  Alert,
  CircularProgress,
  LinearProgress,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Home as HomeIcon,
  Info as InfoIcon,
  Settings as SettingsIcon,
  Visibility as VisibilityIcon,
  FileCopy as FileCopyIcon,
  CalendarToday as CalendarTodayIcon,
  Clock as ClockIcon,
} from "@mui/icons-material";

function App() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [rating, setRating] = useState(0);
  const [sliderValue, setSliderValue] = useState(50);
  const [switchChecked, setSwitchChecked] = useState(false);
  const [autocompleteValue, setAutocompleteValue] = useState("");
  const [bottomNavValue, setBottomNavValue] = useState("home");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("Dialog Title");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
  };

  const handleInputChange = (e) => {
    setAutocompleteValue(e.target.value);
  };

  const handleDismissNotification = (index) => {
    setNotifications(notifications.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <AppBar position="static" color="primary">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={() => setDrawerOpen(true)}
          >
            <MenuIcon />
          </IconButton>
          <h1 className="text-2xl font-bold text-white">Demo UI</h1>
        </Toolbar>
      </AppBar>

      <div className="flex flex-1">
        <Drawer
          anchor="left"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
        >
          <div className="w-64 bg-gray-800 text-white p-4">
            <IconButton onClick={() => setDrawerOpen(false)} className="mb-4">
              <CloseIcon />
            </IconButton>
            <div>
              <Button
                onClick={() => setBottomNavValue("home")}
                color={bottomNavValue === "home" ? "secondary" : "inherit"}
                startIcon={<HomeIcon />}
              >
                Home
              </Button>
              <Button
                onClick={() => setBottomNavValue("info")}
                color={bottomNavValue === "info" ? "secondary" : "inherit"}
                startIcon={<InfoIcon />}
              >
                Info
              </Button>
              <Button
                onClick={() => setBottomNavValue("settings")}
                color={bottomNavValue === "settings" ? "secondary" : "inherit"}
                startIcon={<SettingsIcon />}
              >
                Settings
              </Button>
            </div>
          </div>
        </Drawer>

        <main className="flex-1 p-6">
          <section className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-2xl font-bold mb-4">Forms</h2>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <TextField
                label="Name"
                variant="outlined"
                fullWidth
                name="name"
                required
              />
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                name="email"
                type="email"
                required
              />
              <TextField
                label="Role"
                variant="outlined"
                fullWidth
                name="role"
                required
              />
              <Button type="submit" variant="contained" color="primary">
                Submit
              </Button>
            </form>
          </section>

          <section className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-2xl font-bold mb-4">Interactive Elements</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Checkbox</label>
                <Checkbox />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Radio</label>
                <FormControlLabel control={<Radio />} label="Option 1" />
                <FormControlLabel control={<Radio />} label="Option 2" />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Rating</label>
                <Rating
                  name="rating"
                  value={rating}
                  onChange={(event, newValue) => setRating(newValue)}
                  icon={<StarIcon />}
                  emptyIcon={<StarBorderIcon />}
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Slider</label>
                <Slider
                  value={sliderValue}
                  onChange={(event, newValue) => setSliderValue(newValue)}
                  aria-labelledby="continuous-slider"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Switch</label>
                <Switch
                  checked={switchChecked}
                  onChange={() => setSwitchChecked(!switchChecked)}
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Autocomplete</label>
                <TextField
                  value={autocompleteValue}
                  onChange={handleInputChange}
                  placeholder="Type to autocomplete"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">
                  Multiline Input
                </label>
                <TextField
                  multiline
                  rows={4}
                  placeholder="Type your text here..."
                  fullWidth
                />
              </div>
            </div>
          </section>

          <section className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-2xl font-bold mb-4">Navigation</h2>
            <div className="space-y-4">
              <BottomNavigation
                showLabels
                value={bottomNavValue}
                onChange={(event, newValue) => setBottomNavValue(newValue)}
              >
                <BottomNavigationAction
                  label="Home"
                  value="home"
                  icon={<HomeIcon />}
                />
                <BottomNavigationAction
                  label="Info"
                  value="info"
                  icon={<InfoIcon />}
                />
                <BottomNavigationAction
                  label="Settings"
                  value="settings"
                  icon={<SettingsIcon />}
                />
              </BottomNavigation>
              <Breadcrumbs aria-label="breadcrumb">
                <Link href="#" color="inherit">
                  Home
                </Link>
                <Link href="#" color="inherit">
                  Projects
                </Link>
                <Typography color="textPrimary">Current Page</Typography>
              </Breadcrumbs>
              <Pagination count={10} color="primary" />
            </div>
          </section>

          <section className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-2xl font-bold mb-4">Dialogs & Alerts</h2>
            <div className="space-y-4">
              <div className="flex justify-end">
                <Button
                  onClick={() => setDialogOpen(true)}
                  variant="contained"
                  color="primary"
                >
                  Open Dialog
                </Button>
              </div>
              <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold mb-4">{dialogTitle}</h3>
                  <p className="mb-4">This is a dialog content.</p>
                  <Button
                    onClick={() => setDialogOpen(false)}
                    variant="contained"
                    color="secondary"
                  >
                    Close
                  </Button>
                </div>
              </Dialog>
              <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={() => setOpenSnackbar(false)}
              >
                <Alert
                  onClose={() => setOpenSnackbar(false)}
                  severity="success"
                >
                  This is a success message!
                </Alert>
              </Snackbar>
              <div className="bg-red-100 p-4 rounded-lg border border-red-300 text-red-800">
                <p className="text-sm font-medium">Error Alert</p>
              </div>
              <div className="bg-yellow-100 p-4 rounded-lg border border-yellow-300 text-yellow-800">
                <p className="text-sm font-medium">Warning Alert</p>
              </div>
              <div className="bg-green-100 p-4 rounded-lg border border-green-300 text-green-800">
                <p className="text-sm font-medium">Success Alert</p>
              </div>
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
          </section>

          <section className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-2xl font-bold mb-4">Tooltips & Skeletons</h2>
            <div className="space-y-4">
              <Tooltip title="Tooltip Content" arrow>
                <Button variant="contained" color="primary">
                  Hover me
                </Button>
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
