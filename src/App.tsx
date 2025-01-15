import { useEffect } from "react";

import RootLayout from "./components/layout/RootLayout";
import { showWindow } from "./tauri/window";
import { useViewState } from "./hooks/useViewState";

function App() {
  const { viewInitialized } = useViewState({ listen: false });

  useEffect(() => {
    if (viewInitialized) {
      showWindow();
      console.debug("Initialization complete, showing window...");
    }
  }, [viewInitialized]);

  return <RootLayout></RootLayout>;
}

export default App;
