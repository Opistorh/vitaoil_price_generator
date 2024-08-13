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
  Card,
  CardContent,
  CardActions,
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Autocomplete,
  Typography,
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
  ExpandMore as ExpandMoreIcon,
} from "@mui/icons-material";

function App() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [sliderValue, setSliderValue] = useState(50);
  const [switchChecked, setSwitchChecked] = useState(false);
  const [autocompleteValue, setAutocompleteValue] = useState("");
  const [bottomNavValue, setBottomNavValue] = useState("home");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("Dialog Title");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [accordionOpen, setAccordionOpen] = useState(false);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleAutocompleteChange = (event, newValue) => {
    setAutocompleteValue(newValue);
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <AppBar
        position="static"
        color="white"
        className="shadow-md border-b border-gray-200"
      >
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={() => setDrawerOpen(true)}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            className="flex-grow text-center font-semibold"
          >
            Demo UI
          </Typography>
        </Toolbar>
      </AppBar>

      <div className="flex flex-1">
        <main className="flex-1 p-6">
          <section className="bg-white p-6 rounded-xl shadow-md mb-8">
            <h2 className="text-2xl font-bold mb-4">Tabs & Switches</h2>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              aria-label="tabs example"
              centered
            >
              <Tab label="Tab 1" />
              <Tab label="Tab 2" />
              <Tab label="Tab 3" />
            </Tabs>
            <div className="mt-4">
              {activeTab === 0 && <div>Content for Tab 1</div>}
              {activeTab === 1 && <div>Content for Tab 2</div>}
              {activeTab === 2 && <div>Content for Tab 3</div>}
            </div>
            <Divider className="my-6" />
            <div className="flex items-center space-x-4">
              <Typography className="text-gray-700">Switch</Typography>
              <Switch
                checked={switchChecked}
                onChange={() => setSwitchChecked(!switchChecked)}
              />
            </div>
          </section>

          <section className="bg-white p-6 rounded-xl shadow-md mb-8">
            <h2 className="text-2xl font-bold mb-4">Accordions & Alerts</h2>
            <Accordion
              expanded={accordionOpen}
              onChange={() => setAccordionOpen(!accordionOpen)}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography className="text-lg font-semibold">
                  Accordion Header
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  Accordion content goes here. You can add more components here.
                </Typography>
              </AccordionDetails>
            </Accordion>
            <Divider className="my-6" />
            <Alert severity="info" variant="filled">
              This is an informational alert!
            </Alert>
            <Alert severity="error" variant="filled">
              This is an error alert!
            </Alert>
            <Alert severity="success" variant="filled">
              This is a success alert!
            </Alert>
          </section>

          <section className="bg-white p-6 rounded-xl shadow-md mb-8">
            <h2 className="text-2xl font-bold mb-4">Cards & Buttons</h2>
            <Card variant="outlined" className="mb-4">
              <CardContent>
                <Typography variant="h5" component="div">
                  Card Title
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Card content goes here.
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" color="primary">
                  Learn More
                </Button>
              </CardActions>
            </Card>
            <Divider className="my-6" />
            <div className="flex space-x-4">
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
              >
                Add
              </Button>
              <Button
                variant="contained"
                color="secondary"
                startIcon={<EditIcon />}
              >
                Edit
              </Button>
              <Button
                variant="contained"
                color="error"
                startIcon={<DeleteIcon />}
              >
                Delete
              </Button>
            </div>
          </section>

          <section className="bg-white p-6 rounded-xl shadow-md mb-8">
            <h2 className="text-2xl font-bold mb-4">Forms & Inputs</h2>
            <div className="space-y-4">
              <TextField
                label="Name"
                variant="outlined"
                fullWidth
                name="name"
                required
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                name="email"
                type="email"
                required
                InputLabelProps={{ shrink: true }}
              />
              <Autocomplete
                freeSolo
                options={["Option 1", "Option 2", "Option 3"]}
                value={autocompleteValue}
                onChange={handleAutocompleteChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Autocomplete"
                    variant="outlined"
                  />
                )}
              />
              <Slider
                value={sliderValue}
                onChange={(event, newValue) => setSliderValue(newValue)}
                aria-labelledby="continuous-slider"
                className="mt-4"
              />
            </div>
          </section>

          <section className="bg-white p-6 rounded-xl shadow-md mb-8">
            <h2 className="text-2xl font-bold mb-4">Snackbars & Progress</h2>
            <div className="space-y-4">
              <Button
                onClick={() => setOpenSnackbar(true)}
                variant="contained"
                color="primary"
              >
                Show Snackbar
              </Button>
              <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={() => setOpenSnackbar(false)}
              >
                <Alert
                  onClose={() => setOpenSnackbar(false)}
                  severity="success"
                  variant="filled"
                >
                  This is a success message!
                </Alert>
              </Snackbar>
              <div className="mt-4">
                <CircularProgress />
                <LinearProgress
                  className="mt-4"
                  variant="determinate"
                  value={50}
                />
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default App;
