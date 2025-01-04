import "./styles.css";
import { useRive, Layout, Fit, Alignment } from "@rive-app/react-canvas";

export default function App() {
  const stateMachineName = "State Machine 1";
  const { rive, RiveComponent } = useRive({
    src: "untitled.riv",
    stateMachines: stateMachineName,
    // TODO: Set stateMachines
    autoplay: true,
    layout: new Layout({
      fit: Fit.Cover,
      alignment: Alignment.Center,
    }),
  });

  return (
    <div className="App">
      <div className="container">
        <RiveComponent />
      </div>
    </div>
  );
}
