// API Configuration
// GANTI URL INI dengan URL Vercel deployment Anda

const CONFIG = {
    // URL Vercel production Anda
    API_URL: 'https://cbms-iota.vercel.app',
    
    // Atau ganti dengan custom domain jika ada
    // API_URL: 'https://yourdomain.com',
    
    // Untuk testing dengan local server (jalankan: vercel dev)
    // API_URL: 'http://192.168.1.100:3000',  // Ganti dengan IP lokal PC Anda
    
    // Settings
    DEFAULT_PIN: '1234',
    APP_NAME: 'TeddyTalk CBMS',
    
    // Build info untuk verify APK version
    BUILD_TIME: '2026-01-27 23:35',
    API_VERSION: 'v2.4-compact-header'
};

// Export untuk digunakan di file lain
if (typeof window !== 'undefined') {
    window.CONFIG = CONFIG;
}
