import React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Rive from "@rive-app/react-canvas";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#1e90ff",
    },
    secondary: {
      main: "#ff5722",
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
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <div className="min-h-screen flex justify-center items-center bg-background-default text-text-primary">
        <Rive src="./src/untitled.riv" stateMachines="bumpy" />
      </div>
    </ThemeProvider>
  );
}

export default App;
