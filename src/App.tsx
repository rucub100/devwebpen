import { useEffect } from "react";

import RootLayout from "./components/layout/RootLayout";
import { showWindow } from "./tauri/window";
import { useViewState } from "./hooks/useViewState";

function App() {
  const { isInitialized } = useViewState({ listenInit: true });

  useEffect(() => {
    if (isInitialized) {
      showWindow();
      console.debug("Initialization complete, showing window...");
    }
  }, [isInitialized]);

  return <RootLayout></RootLayout>;
}

export default App;
