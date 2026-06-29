# Simulasi Omni Robot - Technocorner 2026

Aplikasi simulator berbasis web untuk menguji pergerakan fisik robot beroda **Omni-directional** untuk kompetisi **Technocorner 2026**.

🚀 **[Buka Live Simulator di sini!](https://triwahyu45.github.io/simulasi-omni-technocorner-2026/)**

---

## 🌟 Fitur Utama / Key Features

*   **Omni Kinematics Simulation**: Simulasi pergerakan roda Omni 3/4 arah secara fisik di layar.
*   **Virtual Control Pad**: Menguji respon gerak menggunakan virtual joystick di layar atau keyboard.
*   **Chassis Debugger**: Dilengkapi dengan `stick_test.html` untuk memetakan koordinat analog input stik.
*   **Responsive Web View**: Menggunakan HTML5 Canvas berkecepatan tinggi untuk penggambaran laju robot.

---

## 📂 Struktur Project / Project Structure

*   `simulator.html` - Layar utama simulasi pergerakan robot Omni.
*   `stick_test.html` - Alat kalibrasi dan debugger untuk input analog stik.
*   `index.html` - Halaman beranda navigasi simulator.
*   `js/` & `css/` - File logika fisika roda dan visualisasi tema gelap.
*   `local-server.cjs` - Server lokal untuk menghubungkan joystick fisik ke web browser.

---

## 🕹️ Panduan Kendali / Controls
*   **Gerakan (Translasi)**: Gunakan stik virtual kiri atau tombol keyboard untuk menggeser robot ke segala arah.
*   **Rotasi**: Gunakan stik kanan atau tombol keyboard untuk memutar robot di tempat.\n