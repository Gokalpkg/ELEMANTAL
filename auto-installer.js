const { spawn } = require('child_process');
const path = require('path');
const os = require('os');

const adbPath = path.join(os.homedir(), 'AppData', 'Local', 'Android', 'Sdk', 'platform-tools', 'adb.exe');
const apkPath = path.join(os.homedir(), 'Desktop', 'Elementer-Yeni.apk');

console.log('Sürekli Otomatik Kurucu Servisi Aktif (Elementer-Yeni.apk)...');

function loopWait() {
  const waitProc = spawn(adbPath, ['wait-for-device']);
  waitProc.on('close', (code) => {
    console.log('Cihaz algılandı! Yükleniyor...');
    const installProc = spawn(adbPath, ['install', '-r', apkPath]);
    installProc.stdout.on('data', (d) => console.log('INSTALL:', d.toString()));
    installProc.stderr.on('data', (d) => console.log('INSTALL ERR:', d.toString()));
    installProc.on('close', (c) => {
      console.log('Yükleme tamamlandı! Kod:', c);
      spawn(adbPath, ['shell', 'am', 'start', '-n', 'com.elementer.savas/com.elementer.savas.MainActivity']);
      // 3 saniye sonra tekrar dinlemeye geç
      setTimeout(loopWait, 3000);
    });
  });
}

loopWait();
