(function () {
    const defaultHost = 'transporter-tc2026.local';

    function defaultCode(host) {
        return `/*
 * TECHNOCORNER UGM 2026 - TRANSPORTER ROBOT FIRMWARE SKELETON
 *
 * Web ini tidak compile Arduino langsung di browser.
 * Build firmware .bin dengan Arduino CLI / PlatformIO, flash awal via ESP Web Tools,
 * lalu update berikutnya bisa lewat OTA .bin ketika firmware ini sudah berjalan.
 *
 * Dashboard endpoint: http://${host}/data
 */

#include <WiFi.h>
#include <WebServer.h>
#include <ESPmDNS.h>
#include <ArduinoOTA.h>

const char* WIFI_SSID = "ISI_DI_FIRMWARE";
const char* WIFI_PASS = "ISI_DI_FIRMWARE";
const char* MDNS_NAME = "${host.replace(/^https?:\/\//, '').replace(/\.local\/?$/, '')}";

WebServer server(80);

struct RobotTelemetry {
  int tofFront = 999;
  int tofRight = 999;
  int tofBack = 999;
  int tofLeft = 999;
  long encFL = 0;
  long encFR = 0;
  long encRL = 0;
  long encRR = 0;
  int pwmFL = 0;
  int pwmFR = 0;
  int pwmRL = 0;
  int pwmRR = 0;
  float gyroRad = 0.0;
  float cmdX = 0.0;
  float cmdY = 0.0;
  float cmdTurn = 0.0;
} robot;

void sendCors() {
  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.sendHeader("Access-Control-Allow-Methods", "GET, OPTIONS, POST");
  server.sendHeader("Access-Control-Allow-Headers", "Content-Type");
}

void handleData() {
  sendCors();
  String json = "{";
  json += "\\"mode\\":\\"ESP32 MDNS OTA\\",";
  json += "\\"uptime\\":" + String(millis()) + ",";
  json += "\\"cmd\\":{\\"x\\":" + String(robot.cmdX, 3) + ",\\"y\\":" + String(robot.cmdY, 3) + ",\\"turn\\":" + String(robot.cmdTurn, 3) + "},";
  json += "\\"tof\\":{\\"front\\":" + String(robot.tofFront) + ",\\"right\\":" + String(robot.tofRight) + ",\\"back\\":" + String(robot.tofBack) + ",\\"left\\":" + String(robot.tofLeft) + "},";
  json += "\\"encoder\\":{\\"fl\\":" + String(robot.encFL) + ",\\"fr\\":" + String(robot.encFR) + ",\\"rl\\":" + String(robot.encRL) + ",\\"rr\\":" + String(robot.encRR) + "},";
  json += "\\"pwm\\":{\\"fl\\":" + String(robot.pwmFL) + ",\\"fr\\":" + String(robot.pwmFR) + ",\\"rl\\":" + String(robot.pwmRL) + ",\\"rr\\":" + String(robot.pwmRR) + "},";
  json += "\\"gyro\\":" + String(robot.gyroRad, 5);
  json += "}";
  server.send(200, "application/json", json);
}

void setup() {
  Serial.begin(115200);
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASS);

  while (WiFi.status() != WL_CONNECTED) {
    delay(300);
    Serial.print(".");
  }
  Serial.println();
  Serial.print("IP: ");
  Serial.println(WiFi.localIP());

  if (MDNS.begin(MDNS_NAME)) {
    MDNS.addService("http", "tcp", 80);
    Serial.print("mDNS: http://");
    Serial.print(MDNS_NAME);
    Serial.println(".local");
  }

  ArduinoOTA.setHostname(MDNS_NAME);
  ArduinoOTA.begin();

  server.on("/data", HTTP_GET, handleData);
  server.on("/data", HTTP_OPTIONS, []() {
    sendCors();
    server.send(204);
  });
  server.begin();
}

void loop() {
  ArduinoOTA.handle();
  server.handleClient();

  // TODO: isi dari sensor, motor, servo, dan algoritma robot asli.
}
`;
    }

    function getHost() {
        const input = document.getElementById('gen-ota-host');
        return (input && input.value.trim()) || defaultHost;
    }

    function getEditorCode() {
        if (window.editor && typeof window.editor.getValue === 'function') return window.editor.getValue();
        const textarea = document.getElementById('cpp-editor');
        return textarea ? textarea.value : '';
    }

    function setEditorCode(code) {
        if (window.editor && typeof window.editor.setValue === 'function') {
            const current = window.editor.getValue();
            if (!current || current.includes('ESP32 WIFI TETHERING MONITOR ENDPOINT')) window.editor.setValue(code);
            window.editor.refresh();
            return;
        }
        const textarea = document.getElementById('cpp-editor');
        if (textarea && (!textarea.value || textarea.value.includes('ESP32 WIFI TETHERING MONITOR ENDPOINT'))) textarea.value = code;
    }

    function setStatus(message) {
        const el = document.getElementById('generator-status');
        if (el) el.textContent = message;
    }

    async function copyCode() {
        try {
            await navigator.clipboard.writeText(getEditorCode());
            setStatus('Code copied. Build jadi .bin sebelum flash ke ESP32.');
        } catch (err) {
            setStatus('Clipboard blocked. Select code manual dari editor.');
        }
    }

    async function serialPrep() {
        if (!('serial' in navigator)) {
            setStatus('Web Serial butuh Chrome/Edge desktop dan HTTPS/localhost.');
            return;
        }
        setStatus('Web Serial tersedia. Tahap berikutnya: protocol provisioning untuk firmware awal.');
    }

    function otaReady() {
        setStatus(`OTA update butuh firmware .bin dan robot aktif di ${getHost()}. Browser tidak compile sketch langsung.`);
    }

    function init() {
        setEditorCode(defaultCode(getHost()));
        document.getElementById('copy-code-btn')?.addEventListener('click', copyCode);
        document.getElementById('serial-prep-btn')?.addEventListener('click', serialPrep);
        document.getElementById('ota-ready-btn')?.addEventListener('click', otaReady);
        document.getElementById('gen-ota-host')?.addEventListener('input', () => {
            setStatus(`mDNS target set to ${getHost()}.`);
        });
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
})();
