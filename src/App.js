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
      main: "#007aff",
    },
    secondary: {
      main: "#ff3b30",
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
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "12px",
          backgroundColor: "#1e1e1e",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "12px",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#1e1e1e",
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
      <div className="min-h-screen flex flex-col bg-background-default text-text-primary">
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
              <h2 className="text-2xl font-bold mb-4">
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
              <div className="mt-4">
                {activeTab === 0 && <div>Содержимое для вкладки 1</div>}
                {activeTab === 1 && <div>Содержимое для вкладки 2</div>}
                {activeTab === 2 && <div>Содержимое для вкладки 3</div>}
              </div>
              <Divider className="my-6" />
              <div className="flex items-center space-x-4">
                <Typography className="text-gray-300">Переключатель</Typography>
                <Switch
                  checked={switchChecked}
                  onChange={() => setSwitchChecked(!switchChecked)}
                />
              </div>
            </section>

            <section className="bg-paper p-6 rounded-lg shadow-md mb-8">
              <h2 className="text-2xl font-bold mb-4">Аккордеоны и Алерты</h2>
              <Accordion
                expanded={accordionOpen}
                onChange={() => setAccordionOpen(!accordionOpen)}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography className="text-lg font-semibold">
                    Заголовок аккордеона
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                    Содержимое аккордеона. Здесь можно добавить другие
                    компоненты.
                  </Typography>
                </AccordionDetails>
              </Accordion>
              <Divider className="my-6" />
              <Alert severity="info" variant="filled">
                Это информационное сообщение!
              </Alert>
              <Alert severity="error" variant="filled">
                Это сообщение об ошибке!
              </Alert>
              <Alert severity="success" variant="filled">
                Это сообщение об успехе!
              </Alert>
            </section>

            <section className="bg-paper p-6 rounded-lg shadow-md mb-8">
              <h2 className="text-2xl font-bold mb-4">Карты и Кнопки</h2>
              <Card variant="outlined" className="mb-4">
                <CardContent>
                  <Typography variant="h5" component="div">
                    Заголовок карты
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Содержимое карты.
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" color="primary">
                    Узнать больше
                  </Button>
                </CardActions>
              </Card>
              <Divider className="my-6" />
              <div className="flex flex-wrap gap-4">
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                >
                  Добавить
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  startIcon={<EditIcon />}
                >
                  Редактировать
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  startIcon={<DeleteIcon />}
                >
                  Удалить
                </Button>
              </div>
            </section>

            <section className="bg-paper p-6 rounded-lg shadow-md mb-8">
              <h2 className="text-2xl font-bold mb-4">
                Формы и Входные данные
              </h2>
              <div className="space-y-4">
                <TextField
                  label="Имя"
                  variant="outlined"
                  fullWidth
                  name="name"
                  required
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  label="Электронная почта"
                  variant="outlined"
                  fullWidth
                  name="email"
                  required
                  InputLabelProps={{ shrink: true }}
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
              <h2 className="text-2xl font-bold mb-4">Список и Таблица</h2>
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
              <h2 className="text-2xl font-bold mb-4">Иконки и Аватары</h2>
              <div className="flex items-center space-x-4">
                <Avatar alt="Пользователь" src="/path/to/avatar.jpg" />
                <Typography className="text-lg">Пользователь</Typography>
                <Badge badgeContent={4} color="primary">
                  <NotificationsIcon />
                </Badge>
              </div>
            </section>

            <section className="bg-paper p-6 rounded-lg shadow-md mb-8">
              <h2 className="text-2xl font-bold mb-4">Снекбары и Прогресс</h2>
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
