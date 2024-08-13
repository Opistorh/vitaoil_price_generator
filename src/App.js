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
  Radio,
  RadioGroup,
  FormControlLabel,
  Checkbox,
  FormControl,
  FormLabel,
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
  Notifications as NotificationsIcon,
} from "@mui/icons-material";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#1e90ff", // A bright blue for primary actions
    },
    secondary: {
      main: "#ff5722", // A vibrant orange for secondary actions
    },
    background: {
      default: "#121212",
      paper: "#1e1e1e",
    },
    text: {
      primary: "#e0e0e0",
      secondary: "#b0b0b0",
    },
  },
  typography: {
    fontFamily: "Inter, sans-serif",
    h1: { fontWeight: 700, fontSize: "2.5rem" },
    h2: { fontWeight: 600, fontSize: "2rem" },
    h3: { fontWeight: 600, fontSize: "1.75rem" },
    body1: { fontWeight: 400, fontSize: "1rem" },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "12px",
          backgroundColor: "#1e1e1e",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          transition: "all 0.3s ease",
          "&:hover": {
            boxShadow: "0 6px 12px rgba(0, 0, 0, 0.2)",
            transform: "scale(1.05)",
          },
        },
        containedPrimary: {
          backgroundColor: "#1e90ff",
          "&:hover": {
            backgroundColor: "#1c86ee",
          },
        },
        containedSecondary: {
          backgroundColor: "#ff5722",
          "&:hover": {
            backgroundColor: "#e64a19",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          backgroundColor: "#2c2c2c",
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "#333",
            },
            "&:hover fieldset": {
              borderColor: "#1e90ff",
            },
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#1e1e1e",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          backgroundColor: "#333",
        },
      },
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: {
          backgroundColor: "#2c2c2c",
          borderBottom: "1px solid #333",
          borderRadius: "8px",
          "&:hover": {
            backgroundColor: "#3c3c3c",
          },
        },
      },
    },
    MuiAccordionDetails: {
      styleOverrides: {
        root: {
          backgroundColor: "#2c2c2c",
          borderRadius: "8px",
        },
      },
    },
    MuiSnackbar: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: "12px",
          backgroundColor: "#1e1e1e",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
        },
      },
    },
  },
});

function App() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [sliderValue, setSliderValue] = useState(50);
  const [switchChecked, setSwitchChecked] = useState(false);
  const [autocompleteValue, setAutocompleteValue] = useState("");
  const [bottomNavValue, setBottomNavValue] = useState("home");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("Заголовок диалога");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [accordionOpen, setAccordionOpen] = useState(false);
  const [selectedRadio, setSelectedRadio] = useState("option1");
  const [checkedCheckboxes, setCheckedCheckboxes] = useState({
    checkbox1: false,
    checkbox2: false,
  });

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleAutocompleteChange = (event, newValue) => {
    setAutocompleteValue(newValue);
  };

  const handleCheckboxChange = (event) => {
    setCheckedCheckboxes({
      ...checkedCheckboxes,
      [event.target.name]: event.target.checked,
    });
  };

  const handleRadioChange = (event) => {
    setSelectedRadio(event.target.value);
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="min-h-screen flex flex-col bg-background-default text-text-primary font-sans">
        <AppBar position="static" color="primary" className="shadow-md">
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={() => setDrawerOpen(true)}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" className="flex-grow text-center">
              Defengate
            </Typography>
          </Toolbar>
        </AppBar>

        <div className="flex flex-1 flex-col sm:flex-row">
          <main className="flex-1 p-6">
            <section className="bg-paper p-6 rounded-lg shadow-md mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                Вкладки и переключатели
              </h2>
              <Tabs
                value={activeTab}
                onChange={handleTabChange}
                aria-label="tabs example"
                centered
              >
                <Tab label="Вкладка 1" />
                <Tab label="Вкладка 2" />
                <Tab label="Вкладка 3" />
              </Tabs>
              {activeTab === 0 && (
                <Typography className="mt-4">Содержимое вкладки 1</Typography>
              )}
              {activeTab === 1 && (
                <Typography className="mt-4">Содержимое вкладки 2</Typography>
              )}
              {activeTab === 2 && (
                <Typography className="mt-4">Содержимое вкладки 3</Typography>
              )}
            </section>

            <section className="bg-paper p-6 rounded-lg shadow-md mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                Актуальные элементы
              </h2>
              <div className="flex flex-wrap gap-4">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setOpenSnackbar(true)}
                >
                  Показать Snackbar
                </Button>
                <Button variant="outlined" color="secondary">
                  Outlined Button
                </Button>
                <Button variant="text" color="primary" startIcon={<AddIcon />}>
                  Icon Button
                </Button>
                <Button variant="contained" color="secondary" className="fab">
                  FAB
                </Button>
                <ButtonGroup variant="contained" color="primary">
                  <Button>Button 1</Button>
                  <Button>Button 2</Button>
                  <Button>Button 3</Button>
                </ButtonGroup>
                <Tooltip title="Информация">
                  <IconButton color="primary">
                    <InfoIcon />
                  </IconButton>
                </Tooltip>
                <Switch
                  checked={switchChecked}
                  onChange={() => setSwitchChecked(!switchChecked)}
                />
                <Slider
                  value={sliderValue}
                  onChange={(e, newValue) => setSliderValue(newValue)}
                />
                <Autocomplete
                  options={["Опция 1", "Опция 2", "Опция 3"]}
                  value={autocompleteValue}
                  onChange={handleAutocompleteChange}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Автозаполнение"
                      variant="outlined"
                    />
                  )}
                />
                <FormControl component="fieldset">
                  <FormLabel component="legend">Радиокнопки</FormLabel>
                  <RadioGroup
                    value={selectedRadio}
                    onChange={handleRadioChange}
                  >
                    <FormControlLabel
                      value="option1"
                      control={<Radio />}
                      label="Опция 1"
                    />
                    <FormControlLabel
                      value="option2"
                      control={<Radio />}
                      label="Опция 2"
                    />
                  </RadioGroup>
                </FormControl>
                <FormControl component="fieldset">
                  <FormLabel component="legend">Чекбоксы</FormLabel>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={checkedCheckboxes.checkbox1}
                        onChange={handleCheckboxChange}
                        name="checkbox1"
                      />
                    }
                    label="Чекбокс 1"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={checkedCheckboxes.checkbox2}
                        onChange={handleCheckboxChange}
                        name="checkbox2"
                      />
                    }
                    label="Чекбокс 2"
                  />
                </FormControl>
              </div>
            </section>

            <section className="bg-paper p-6 rounded-lg shadow-md mb-8">
              <h2 className="text-2xl font-semibold mb-4">Список и Таблица</h2>
              <Typography className="mb-2">Список:</Typography>
              <ul className="list-disc pl-6">
                <li>Пункт 1</li>
                <li>Пункт 2</li>
                <li>Пункт 3</li>
              </ul>
              <Divider className="my-6" />
              <Typography className="mb-2">Таблица:</Typography>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-600">
                  <thead className="bg-gray-800">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Колонка 1
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Колонка 2
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Колонка 3
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-gray-900 divide-y divide-gray-700">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                        Данные 1
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                        Данные 2
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                        Данные 3
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                        Данные 4
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                        Данные 5
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                        Данные 6
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section className="bg-paper p-6 rounded-lg shadow-md mb-8">
              <h2 className="text-2xl font-semibold mb-4">Иконки и Аватары</h2>
              <div className="flex items-center space-x-4">
                <Avatar alt="Пользователь" src="/path/to/avatar.jpg" />
                <Typography className="text-lg">Пользователь</Typography>
                <Badge badgeContent={4} color="primary">
                  <NotificationsIcon />
                </Badge>
              </div>
            </section>

            <section className="bg-paper p-6 rounded-lg shadow-md mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                Снекбары и Прогресс
              </h2>
              <div className="space-y-4">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setOpenSnackbar(true)}
                >
                  Показать Snackbar
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
                    Это сообщение об успехе!
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

        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
          <div className="p-4">
            <IconButton
              edge="end"
              color="inherit"
              onClick={() => setDialogOpen(false)}
            >
              <CloseIcon />
            </IconButton>
            <Typography variant="h6">{dialogTitle}</Typography>
          </div>
        </Dialog>
      </div>
    </ThemeProvider>
  );
}

export default App;
