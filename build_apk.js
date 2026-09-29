const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const jbrPath = 'C:\\Program Files\\Android\\Android Studio\\jbr';
const env = {
  ...process.env,
  JAVA_HOME: jbrPath,
  PATH: path.join(jbrPath, 'bin') + ';' + process.env.PATH
};

console.log('[Build APK] Starting Gradle assembleDebug with Java 21...');
const gradlewPath = path.join(__dirname, 'android', 'gradlew.bat');

const child = spawn(gradlewPath, ['assembleDebug', '-p', 'android'], {
  cwd: __dirname,
  env,
  shell: true,
  stdio: 'inherit'
});

child.on('close', (code) => {
  if (code !== 0) {
    console.error(`[Build APK] Gradle build failed with exit code: ${code}`);
    process.exit(code);
  }
  console.log('[Build APK] Gradle build successful!');

  const srcApk = path.join(__dirname, 'android', 'app', 'build', 'outputs', 'apk', 'debug', 'app-debug.apk');
  if (!fs.existsSync(srcApk)) {
    console.error(`[Build APK] Output APK not found at: ${srcApk}`);
    process.exit(1);
  }

  const stat = fs.statSync(srcApk);
  console.log(`[Build APK] Source APK built: ${stat.size} bytes (${(stat.size / 1024 / 1024).toFixed(2)} MB)`);

  const desktopDir = path.join(require('os').homedir(), 'Desktop');
  const targets = [
    path.join(desktopDir, 'Elementer-Yeni.apk'),
    path.join(desktopDir, 'ElementSavas-debug.apk')
  ];

  targets.forEach((dst) => {
    try {
      fs.copyFileSync(srcApk, dst);
      console.log(`[Build APK] Copied to: ${dst}`);
    } catch (e) {
      console.error(`[Build APK] Failed to copy to ${dst}:`, e.message);
    }
  });

  console.log('[Build APK] All done successfully!');
});
