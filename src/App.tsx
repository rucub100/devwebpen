import { useEffect, useState } from "react";

import RootLayout from "./components/layout/RootLayout";
import { showWindow } from "./tauri/window";
import { initializeViewState } from "./hooks/useViewState";
import { initializeEphemeralSession } from "./hooks/useEphemeralSession";
import { initializeProject } from "./hooks/useProject";

function App() {
  const [isInitialized, setInitialized] = useState(false);

  useEffect(() => {
    const init = async function () {
      console.debug("Initializing app...");
      await initializeViewState();
      await initializeEphemeralSession();
      await initializeProject();
      console.debug("App initialized");
    };

    init().then(() => {
      setInitialized(true);
      setTimeout(showWindow);
      console.debug("Initialization complete, showing window...");
    });
  }, []);

  return isInitialized && <RootLayout></RootLayout>;
}

export default App;
