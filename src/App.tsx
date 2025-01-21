import { useEffect, useState } from "react";

import RootLayout from "./components/layout/RootLayout";
import { showWindow } from "./tauri/window";
import { useViewState } from "./hooks/useViewState";
import { useEphemeralSession } from "./hooks/useEphemeralSession";
import { useProject } from "./hooks/useProject";

function App() {
  const [isInitialized, setInitialized] = useState(false);

  const { isInitialized: isViewStateInitialized } = useViewState({
    listenInit: true,
  });
  const { isInitialized: isEphemeralSessionInitialized } = useEphemeralSession({
    listenInit: true,
  });
  const { isInitialized: isProjectInitialized } = useProject({
    listenInit: true,
  });

  useEffect(() => {
    if (
      isViewStateInitialized &&
      isEphemeralSessionInitialized &&
      isProjectInitialized
    ) {
      setInitialized(true);
      setTimeout(showWindow);
      console.debug("Initialization complete, showing window...");
    }
  }, [
    isViewStateInitialized,
    isEphemeralSessionInitialized,
    isProjectInitialized,
  ]);

  return isInitialized && <RootLayout></RootLayout>;
}

export default App;
