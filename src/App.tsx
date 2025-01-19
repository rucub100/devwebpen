import { useEffect } from "react";

import RootLayout from "./components/layout/RootLayout";
import { showWindow } from "./tauri/window";
import { useViewState } from "./hooks/useViewState";
import { useEphemeralSession } from "./hooks/useEphemeralSession";

function App() {
  const { isInitialized: isViewStateInitialized } = useViewState({
    listenInit: true,
  });
  const { isInitialized: isEphemeralSessionInitialized } = useEphemeralSession({
    listenInit: true,
  });

  useEffect(() => {
    if (isViewStateInitialized && isEphemeralSessionInitialized) {
      showWindow();
      console.debug("Initialization complete, showing window...");
    }
  }, [isViewStateInitialized, isEphemeralSessionInitialized]);

  return <RootLayout></RootLayout>;
}

export default App;
