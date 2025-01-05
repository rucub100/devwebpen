import { useEffect } from "react";

import RootLayout from "./components/layout/RootLayout";
import { showWindow } from "./tauri/window";

function App() {
  useEffect(() => {
    showWindow();
  }, []);

  return <RootLayout></RootLayout>;
}

export default App;
