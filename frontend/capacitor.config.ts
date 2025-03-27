import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.sportganise.app',
  appName: 'Sportganise',
  webDir: 'dist',
  plugins: {
    Keyboard: {
      resize: true,
      style: 'docked'
    }
  },
  server: {
    allowNavigation: [
      "https://onibad.sportganise.com",
      "capacitor://localhost"
    ]
  }
};

export default config;
