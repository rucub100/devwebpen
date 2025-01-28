import { useEffect, useState } from "react";

import RootLayout from "./components/layout/RootLayout";
import { showWindow } from "./tauri/window";
import { initializeViewState } from "./hooks/useViewState";
import { initializeEphemeralSession } from "./hooks/useEphemeralSession";
import { initializeProject } from "./hooks/useProject";
import { initializeDaemon } from "./hooks/useDaemon";

function App() {
  const [isInitialized, setInitialized] = useState(false);

  useEffect(() => {
    const init = async function () {
      await initializeViewState();
      await initializeEphemeralSession();
      await initializeProject();
      await initializeDaemon();
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
