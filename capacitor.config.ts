import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'fancy-jewellers-app',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  },
  android: {
    backgroundColor: '#ffffff',
    adjustMarginsForEdgeToEdge: "force"
  }
};

export default config;
