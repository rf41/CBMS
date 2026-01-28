import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.teddytalk.cbms',
  appName: 'TeddyTalk CBMS',
  webDir: 'app',
  server: {
    // Allow CORS and external API calls
    allowNavigation: ['*'],
    // Allow cleartext (HTTP) traffic - needed for some APIs
    androidScheme: 'https'
  },
  android: {
    allowMixedContent: true,
    backgroundColor: '#f5f1e8',
    // Allow cleartext traffic for HTTP APIs
    // Note: Untuk production, gunakan HTTPS
    useLegacyBridge: false
  }
};

export default config;
