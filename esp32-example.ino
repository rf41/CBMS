#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

// WiFi credentials
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// API endpoint - ganti dengan URL Vercel Anda setelah deploy
const char* serverName = "https://your-project.vercel.app/api/save-data";

// Device ID
const char* deviceId = "ESP32_001";

// Sensor pins (sesuaikan dengan hardware Anda)
const int heartRatePin = 34;
const int temperaturePin = 35;
const int touchPin = 32;
const int movementPin = 33;
const int soundPin = 36;

void setup() {
  Serial.begin(115200);
  
  // Connect to WiFi
  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  
  Serial.println("\nConnected to WiFi");
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());
}

void loop() {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    
    // Baca data sensor (contoh - sesuaikan dengan sensor real Anda)
    int heartRate = readHeartRate();
    float bodyTemperature = readTemperature();
    String touchIntensity = readTouchIntensity();
    String movementPattern = readMovementPattern();
    String soundActivity = readSoundActivity();
    
    // Buat JSON payload
    StaticJsonDocument<256> doc;
    doc["heartRate"] = heartRate;
    doc["bodyTemperature"] = bodyTemperature;
    doc["touchIntensity"] = touchIntensity;
    doc["movementPattern"] = movementPattern;
    doc["soundActivity"] = soundActivity;
    doc["deviceId"] = deviceId;
    
    String jsonString;
    serializeJson(doc, jsonString);
    
    Serial.println("Sending data: " + jsonString);
    
    // Kirim HTTP POST request
    http.begin(serverName);
    http.addHeader("Content-Type", "application/json");
    
    int httpResponseCode = http.POST(jsonString);
    
    if (httpResponseCode > 0) {
      String response = http.getString();
      Serial.println("HTTP Response code: " + String(httpResponseCode));
      Serial.println("Response: " + response);
    } else {
      Serial.println("Error on sending POST: " + String(httpResponseCode));
    }
    
    http.end();
  } else {
    Serial.println("WiFi Disconnected");
  }
  
  // Kirim data setiap 30 detik
  delay(30000);
}

// Fungsi untuk membaca sensor (contoh - sesuaikan dengan hardware Anda)
int readHeartRate() {
  // Simulasi - ganti dengan pembacaan sensor real
  // Contoh: baca dari MAX30100 atau sensor heart rate lainnya
  return random(70, 120);
}

float readTemperature() {
  // Simulasi - ganti dengan pembacaan sensor real
  // Contoh: baca dari MLX90614 atau sensor temperature lainnya
  return 36.5 + (random(0, 20) / 10.0);
}

String readTouchIntensity() {
  // Simulasi - ganti dengan pembacaan sensor real
  // Contoh: baca dari sensor sentuh kapasitif
  int val = random(0, 3);
  if (val == 0) return "low";
  if (val == 1) return "normal";
  return "high";
}

String readMovementPattern() {
  // Simulasi - ganti dengan pembacaan sensor real
  // Contoh: baca dari accelerometer/gyroscope MPU6050
  int val = random(0, 3);
  if (val == 0) return "normal";
  if (val == 1) return "repetitive";
  return "extreme";
}

String readSoundActivity() {
  // Simulasi - ganti dengan pembacaan sensor real
  // Contoh: baca dari microphone atau sound sensor
  int val = random(0, 3);
  if (val == 0) return "normal";
  if (val == 1) return "frequent";
  return "intense";
}
