# 🎮 Element Savaşı - Flutter & Flame Projesi

Bu dizin, **Element Savaşı**'nın Flutter ve Flame oyun motoru (`flame: ^1.18.0`) mimarisine taşınmış temiz, modüler Dart kod tabanıdır.

## 🏗️ Proje Mimarisi

- `lib/main.dart`: Flutter & Flame başlangıç noktası ve arayüz overlay kayıtları.
- `lib/game/element_game.dart`: Ana FlameGame sınıfı, oyun döngüsü ve kamera yönetimi.
- `lib/game/components/`:
  - `player/`: Oyuncu FSM (`player_fsm.dart`), atılma ve kombo sistemleri.
  - `bosses/`: Tüm 10 boss için soyut sınıf (`base_boss.dart`) ve boss modelleri (`stone_titan.dart`, vb.).
- `lib/game/systems/`:
  - `hit_stop_system.dart`: Vuruş ağırlığı ve mikroduraksama (Hades stili hit-stop).
  - `localization_system.dart`: Türkçe ve İngilizce çift dilli metinler ve dinamik boss replikleri.
  - `accessibility_settings.dart`: Ekran sarsıntısı ve hasar sayıları tercihleri.
- `lib/ui/`: Flutter tabanlı Asra Sığınağı (`asra_sanctuary_hub.dart`) ve Ayarlar arayüzü (`settings_overlay.dart`).

## 🤖 VS Code + Cline / OpenRouter ile Geliştirme

1. **Projeyi Açma:** VS Code içinde doğrudan `flutter_element_savas` klasörünü açın.
2. **Paketleri İndirme:** Terminalde `flutter pub get` komutunu çalıştırın.
3. **AI Destekli Yeni Boss Ekleme:**
   Cline veya OpenRouter'a şu promptu verebilirsiniz:
   > "lib/game/components/bosses/base_boss.dart sınıfından türeyen, Lava Lord Ifrit bossunu oluştur. 2. faza geçtiğinde lav püskürtme saldırısı ekle."
