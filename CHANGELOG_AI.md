# CHANGELOG_AI

Tarih: 2026-09-07  
Kapsam: mevcut mimari korunarak temizlik, arayüz ve performans iyileştirmesi.

## `index.html`

### 1. Kod ve hata temizliği
- Canvas veya 2D context yoksa oyun IIFE’si erken çıkıyor; `getContext` null çökmesi kesildi.
- `onTap` / `toggleClass` / `setText` ile DOM dinleyicileri ve overlay class işlemleri null-safe hale getirildi (`giveUpBtn`, menü, SFX, ağaç, görünüm, duraklatma, reklam, rehber, yükleme düğmesi).
- `currentBiome()` boş veya negatif indeks durumunda varsayılan kar diyarına düşüyor.
- `clampEntity` yarıçapı tanımsız veya geçersizse 12 kullanıyor.
- `hitFlashEl`, `skillBar`, yetenek ikon/fill düğümleri ve `ELEMENTS[pendingElement]` erişimleri korundu.
- `spawnWave` dalga yazısını `setText` ile güncelliyor.
- `finishRun`, `closeReward`, `showLevelUp`, `openLook`/`closeLook`, `openTree`/`closeTree`, `continueFromAd` overlay çağrıları korumalı.
- `refreshSkillUI` skill durumu yoksa (`st`) çökmeden çıkıyor.

Gerekçe: Android WebView’de eksik düğüm veya yarım HUD, `Cannot read properties of null` ile turu öldürüyordu.

### 2. Arayüz ve ergonomi
- Overlay’lere `overflow-y: auto`, `max-height: 100%` ve daha tutarlı safe-area padding eklendi; kart seçimi küçük ekranda taşmıyor.
- HUD `overflow: hidden` kaldırıldı (can çubuğu ve yazılar kesilmesin); `max-width` ile kenar taşması kesildi.
- Dar ekranda (`max-width: 380px`) bilgi satırı sarılıyor, kart/menü padding küçültüldü.
- Kısa ekranda (`max-height: 640px` / `560px`) HUD, skill tuşları, görev ve boss barı sıkıştı; basınç şeridi 560px altında gizlendi.
- Yatay ve alçak (`landscape` + `max-height: 480px`) için HUD/skill ölçeği küçültüldü.
- Seçim kartı ipuçları `overflow-wrap: anywhere`; menü etiketi `max-width: min(260px, 100%)`.
- Yenile (reroll) tuşu safe-area inset kullanıyor.

Gerekçe: çentikli telefon ve yatay kullanımda HUD/overlay metinleri kesiliyor, butonlar birbirine biniyordu.

### 3. Oynanış ve performans
- Gökyüzü (`drawBiomeWorld`) aynı diyar ve çözünürlükte offscreen cache’ten çiziliyor; her karede dağ/glow yeniden hesaplanmıyor.
- `shadowBlur` telefon DPI’sında (`viewDpr >= 1.6`) mermi, kıvılcım, neon ve ilmek çiziminde kapatıldı; masaüstünde düşük DPI’da duruyor.
- Boss HUD her kare `render` içinde güncellenmiyor (yalnızca `updateHud`).
- `render` her kare `imageSmoothingEnabled` yazmıyor.
- Kamera dışı düşman ve mermiler çizilmiyor (`inCam`).
- Hasar yazıları `getBoundingClientRect`’i kare başına bir kez alıyor; yüzen yazı sayısı 10 ile sınırlı.
- Oyun döngüsü `overlayBusy()` sonucunu karede bir kez okuyor; hit-stop sırasında menüde gereksiz `render` yok.
- Yetenek HUD’u zaten imza anahtarıyla erken çıkıyordu; null koruması eklendi.

Gerekçe: Android’de `shadowBlur` ve her kare gökyüzü çizimi FPS düşürüp joystick gecikmesi yaratıyordu. Mekanik (vuruş, hareket, dalga) değişmedi.

## `version.txt`

- `BUILD_ID` `20260907k` ile eşitlendi.

Gerekçe: telefonda eski `www` önbelleğinin yeni derlemeyi yüklemesi.

## Notlar

- Capacitor `flatDir` Gradle uyarısı eklenti şablonundan geliyor; uygulama kodu değil, dokunulmadı.
- `android/` üretilen dosyalarına ve `www/` kopyasına el ile müdahale edilmedi; `copy-www.js` + `assembleDebug` ile doğrulanır.
