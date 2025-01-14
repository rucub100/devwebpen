import { useEffect } from "react";

import RootLayout from "./components/layout/RootLayout";
import { showWindow } from "./tauri/window";
import { useViewState } from "./hooks/useViewState";

function App() {
  const { viewInitialized } = useViewState();

  useEffect(() => {
    if (viewInitialized) {
      console.debug("Initialization complete, showing window...");
      showWindow();
    }
  }, [viewInitialized]);

  return <RootLayout></RootLayout>;
}

export default App;
