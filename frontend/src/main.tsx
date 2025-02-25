import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import requestNotificationPermission from "@/services/fcm.ts";
import { Capacitor } from "@capacitor/core";

const Main = () => {
  useEffect(() => {
    const initializeFcm = async () => {
      if (typeof Capacitor !== "undefined" && Capacitor.getPlatform() === "web") {
        await requestNotificationPermission();
      } else {
        console.warn("Mobile app suspected.");
      }
    }

    initializeFcm().then(r => r);
  }, []);

  return <App />;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Main />
  </StrictMode>,
);
