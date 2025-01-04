import { getCurrentWindow } from "@tauri-apps/api/window";

import { useEffect } from "react";

import RootLayout from "./components/RootLayout";

function App() {
  useEffect(() => {
    const showWindow = async () => {
      await getCurrentWindow().show();
    };

    showWindow();
  }, []);

  return <RootLayout></RootLayout>;
}

export default App;
