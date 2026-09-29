# Element Savaşı - Flutter / Flame Oyun Mimarisi & State Machine Rehberi

Bu dizin, kullanıcının talep ettiği **Flutter ve Flame (Dart)** oyun motoru entegrasyonu için State Machine (FSM), Hit-Stop sistemi ve sprite dilimleme mimarisini barındırır.

---

## 🏗️ 1. Mimari Bileşenleri

### `player_fsm.dart` (Ana Karakter Durum Makinesi)
- `PlayerState` enum: `idle`, `run`, `attack`, `hurt`.
- **Girdi Kilitleme (Input Locking):**
  - Karakter saldırırken (`attack`) veya hasar alıp geriye sekerken (`hurt`), yürüme animasyonunun veya diğer girdilerin çakışması engellenir.
  - 3. kombo karesi bittiğinde hız vektörüne göre `idle` veya `run` durumuna pürüzsüz geri dönülür.
  - Moonwalk (ayak kayması) sorunu tamamen çözülmüştür.

### `boss_fsm.dart` (Boss Durum Makinesi & Telegraf Senkronizasyonu)
- `BossState` enum: `idle`, `chase`, `windup`, `swing`, `recovery`, `hurt`, `enraged`.
- **Kare Bazlı Vuruş (Frame Callbacks):**
  - `windup` fazında boss silahını kaldırır, yerdeki uyarı daireleri (telegraflar) görünür.
  - `swing` fazının tam salınım karesinde hasar veren mermiler/hitbox'lar ortaya çıkar.
  - `recovery` fazında oyuncuya vuruş fırsatı tanıyan kısa bir açık bırakılır.

### `hit_stop_system.dart` (Hit-Stop / Mikro Donma Yöneticisi)
- Hades, Dead Cells ve Soul Knight tarzı **0.08 saniyelik mikro donma** (Hit-Stop).
- Kritik vuruşlarda ve oyuncunun darbe aldığı anlarda oyun karesini çok kısa dondurarak vuruş hissiyatını (game feel) dramatik biçimde artırır.

---

## 🎨 2. Sprite Dilimleme (Slicing) Eşleşmesi

| Görsel Varlık | Dosya Yolu | İlgili FSM Bileşeni |
| :--- | :--- | :--- |
| **Ana Karakter (Hero Assets)** | `img/hero-art.jpg` & `media_1790028339940.jpg` | `PlayerHeroFSM` (Yürüme, Koşma, 3-Hit Kombo, Recoil) |
| **Yetenek Ağacı & Envanter** | `img/ui-skill-tree-inventory.jpg` | Envanter ızgarası & Dairesel yetenek düğümleri |
| **Diyalog Sistemi (Gökalp & Asra)** | `img/ui-dialogue-system.jpg` | `DialogueBoxComponent` (Portreler & Metin akışı) |
| **Dünya Haritası (Biyomlar)** | `img/ui-world-map.jpg` | `WorldMapComponent` (Kan Vadisi, Buz, Orman düğümleri) |
| **Ana Menü (Kamp Ateşi & Logo)** | `img/ui-main-menu.jpg` | `MainMenuScene` (Start, Settings, Quit butonları) |
