# Elementel Yetenek Ağacı ve Sinerji Sistemi

Tarih: 2026-09-14  
Kapsam: Elementer (6 element) — run içi kök/füzyon kilidi, Saf Yol, Hibrit Yol, özel kaynak barları, Tier 3 efsanevi graft.  
Kaynak kod eşlemesi: `index.html` → `ELEMENTS`, `COMBO_KITS`, `COMBO_NAMES`, `lockedCombos`, `pendingElement`, `restartRun`, `SIGNATURES`.

Bu belge **hedef mimaridir**. Mevcut kod 3 kilitli kombo + 6 element çiftine izin verir. Aşağıdaki kurallar o yapıyı sadeleştirir: **run başına en fazla 2 element**, geri kalanı kilitlenir.

---

## 0. Sert Kurallar (tasarım sözleşmesi)

1. **Altı kök:** `fire` Ateş, `water` Su, `storm` Elektrik, `nature` Doğa, `earth` Toprak, `void` Karanlık.
2. **Run başı:** oyuncu 6’dan **tam 1 kök** seçer. Bu kök, run bitene veya restart’a kadar değişmez.
3. **İkincil hakkı:** diğer 5’ten **en fazla 1** element alınır (Hibrit) veya hiç alınmaz (Saf Yol). Üçüncü element **asla** açılmaz.
4. **Kilidin anlamı:** seçilmeyen 4 (veya Saf’ta 5) element o run’da auto, skill, status ve biyom paktı olarak **yoktur**. Tekrar oynanabilirlik buradan gelir.
5. **Restart sözleşmesi:** `restartRun()` → `startRun()` → `beginRunWithKit`. `lockedCombos`, `pendingElement`, `playerSig`, path, özel barlar, taretler, sis/gizlilik, basınç **sıfırlanır**. Meta ağacı (`META_TREE`) ve kristal kalır.
6. **Sıra önemlidir:** `A→B` ile `B→A` aynı füzyon sınıfını açar ama **imza yeteneğinin şekli** mevcut `COMBO_KITS` yönüne göre değişir (ör. `fire_water` koni, `water_fire` kaynar dalga). Sınıf aynı, silah farklı.
7. **Tier 3 üçüncü element değildir.** Nadir graft kartı, kilitli bir elementin **mekaniğini** (taret, gübre, iyon, çöküş) senin sınıfına taşır; o elementin auto’sunu ve status’unu vermez.

---

## 1. Sistem Mekaniği ve UI/UX Mantığı

### 1.1 Seviye / karar döngüsü

```
Run başı
  └─ Kök Seçimi (6 kart, 1 seç)
       └─ Temel auto kilitlenir (düz mermi + kök status)
Lv 2–4  Çekirdek: auto evrimi, eklenti, küçük Saf düğümler
Lv 5    KAVŞAK (zorunlu, atlanamaz)
          ├─ Saf Yol: kökü saflaştır (2. element hakkı yanar)
          └─ Hibrit: 5 karttan 1 ikincil seç → Füzyon sınıfı kilitlenir
Lv 6–12 Sınıf düğümleri (3’ten 1), eklenti, biyom paktı
Lv 7 / 13 / 20  İmza yetenek teklifi (mevcut SKILL_OFFER_LEVELS)
Lv 14+  Nadir graft havuzu açılır (Tier 3, run’da en fazla 1)
Lv 18   İmza (playerSig) — sınıfın kind’ına bağlı
Ölüm    Reklamla devam (combolar ve path korunur) veya Restart (tam sıfır)
```

### 1.2 Yetenek ağacı ekranı (`elTreeOverlay`)

Üç katman, soldan sağa:

| Katman | İçerik | Etkileşim |
|---|---|---|
| Kök şeridi | 6 element chip. Seçilen `on`, ikincil `owned`, diğerleri `fog` | Fog olanlara tıklanınca “Bu run kilitli” |
| Sınıf omurgası | Saf evrim **veya** füzyon adı + 4 düğüm (T1 çekirdek, T2 imza, T3 graft yuvası, Sig) | Dolu düğüm yeşil, sıradaki sarı, kilitli soluk |
| Kart ızgarası | O an teklif edilen 3 yükseltme | Seçim ağacı ve HUD’u anında günceller |

HUD yolu (tek satır): `Ateş → Lav` veya `Toprak + Elektrik → Manyetizma`.  
Restart / Ana Menü bu satırı siler. Duraklatmadan “Baştan Başla” aynı işi yapar.

### 1.3 Auto evrimi (mevcut `autoRoots` ile uyum)

- Kök seçilince auto = o elementin `AUTO_BASE` mermisi.
- Saf Yol’da her Saf düğümü auto’yu **şeklen** evrimleştirir (aynı element, farklı özel).
- Hibrit’te auto **kökün** kalır; ikincil yalnızca her N. atışta “leke” (status veya mikro şekil) ekler. Mevcut “her kombo ilk elementi auto’ya eklenir” kuralı **kapatılır** — aksi halde 2 elementten 3. his doğar.
- İmza yetenek (`COMBO_KITS[root_secondary]` veya `COMBO_KITS[root_root]` Saf’ta) ayrı skill tuşu olarak kalır.

### 1.4 Teklif filtresi (tekrar oynanabilirlik)

Kart havuzu üç süzgeçten geçer:

1. **Element kilidi:** kilitli element id’si taşıyan kart düşmez.
2. **Sınıf havuzu:** yalnızca aktif path id’sinin düğümleri + evrensel eklentiler.
3. **Graft kapısı:** Lv14+ ve run’da graft yoksa, %12 (nadir) ile 1 graft kartı 3’lü teklife girer.

Aynı run’da aynı düğüm iki kez gelmez. Reroll sınıf havuzunu karıştırır, kilidi açmaz.

---

## 2. Detaylı Element ve Sınıf Tablosu

### 2.1 Altı kök — başlangıç auto

| Id | Ad | Status | Auto his | Aralık / tempo | Her N. özel | Zayıf kalkan (`SHIELD_WEAK`) |
|---|---|---|---|---|---|---|
| fire | Ateş | Yakma | Hızlı, orta hasar, kısa menzil | 250 / interval 17 | 5: burst (küçük nova) | Su |
| water | Su | Yavaş | Orta tempo, uzun menzil | 310 / 22 | 4: freeze (kısa don) | Elektrik |
| storm | Elektrik | Şok | En hızlı, ince mermi | 285 / 15 | 4: chain (1 sıçrama) | Toprak |
| nature | Doğa | Can çalma | Dengeli, sap | 265 / 21 | 4: sap (küçük can) | Ateş |
| earth | Toprak | Stun | Yavaş, kalın, kısa | 215 / 28 | 4: heavy (ezme) | Doğa |
| void | Karanlık | Çekme | Orta, ağır his | 255 / 20 | 4: blackhole (mikro çekim) | Elektrik |

Hepsi run başında **düz mermi**. Özel atışlar Saf/Hibrit düğümleriyle şişer, kök değişmez.

### 2.2 Altı Saf Yol (ikincil yok)

Kavşakta Saf seçilirse ikincil hakkı **yanar**. Sınıf adı HUD’da kökün evrim adıdır.

#### Lav — Ateş Saf

- Rol: DPS + sınırlı lifesteal.
- Omurga: Alev Püf (`fire_fire`) imza skill. Yakma stack tavanı 5 → 8. 8. stack’te küçük patlama.
- Auto evrimi: mermi “kül topu”; her 5. atış 3’lü burst.
- Savunma: vuruşta %4 can (tavan %10, boss’ta %2). Kan Sözü eklentisiyle çifte dip: yüksek hasar, yenileme kesilir.
- Zayıf: su biyomu ve Su kalkanı. Uzun menzilde erir.

#### Okyanus / Buz — Su Saf

- Rol: kitle kontrol, itme, tempo kesme.
- Omurga: Tsunami İtme (`water_water`). Knock 95, stun 2.6s (mevcut kit).
- Auto evrimi: mermi “dolu”; yavaş stack 3’te don (1.1s, elite 0.45s, boss yok).
- Alan: kısa süreli su tabakası. Islak işaret = Elektrik graft’ına kapı (ama Saf’ta elektrik yok; işaret yalnızca Buz kırılınca ekstra yavaş).
- Zayıf: kuma / hızlı tek hedeflere. Tek boss’ta itme 0.05 çarpanı (mevcut `punchEnemy`).

#### Yıldırım — Elektrik Saf

- Rol: harita AoE, zincir.
- Omurga: Yıldırım Oku (`storm_storm`, range 900). Haritadaki herkese ince şok.
- Auto evrimi: her 4. atış 2 sıçrama. Saf T2’de sıçrama 4, hasar her sıçramada ×0.72.
- Risk: tek hedef DPS düşük. CD uzun. Cam Top lanetiyle “cam ADC” olur.

#### Filiz — Doğa Saf (taret)

- Rol: yerleşik baskı, infaz, sürdürülebilirlik.
- Omurga: Sarmaşık İnfaz (`nature_nature`, exec 0.36).
- **Taret:** ilk Saf düğümünde 1 tohum. Max 2 taret (T2’de 3). Taret auto’su doğa mermisi, oyuncunun %45 hasarı, menzil 180. Taret canı 40; 12s yaşar, yenilenir.
- Auto evrimi: seken spor yok; düz mermi + yakın sap.
- Zayıf: ateş biyomu ve alan yakma. Taretler lav havuzunda 2× hasar yer.

#### Taş — Toprak Saf

- Rol: tank, CC, yakın ezme.
- Omurga: Kaya Sarma (`earth_earth`, zırh + deprem).
- Auto evrimi: taş parçası; her 4. atış kısa stun (0.35s).
- Savunma: max can +18 / Saf düğümü (2 düğüm). Hız −6% / düğüm. Ayna / kaya eklentisiyle duvar.
- Zayıf: kiting. Doğa kalkanı ve diken.

#### Gölge — Karanlık Saf

- Rol: suikast, infaz, çekim.
- Omurga: Olay Ufku (`void_void`, r 125, pull 6.8, exec 0.25).
- Auto evrimi: gölge iğnesi. Canı %35 altındaki hedefe +%40 hasar.
- **Sis (hafif):** Saf T2’de 1.2s gizlilik, 14s CD. Hasar gizliliği kırar. Tam Kül sis’i değildir (bkz. §3.2).
- Zayıf: Elektrik kalkanı, tesla, zincir (gizliliği deşifre).

### 2.3 Altı Temel Füzyon (imza sınıflar)

Sıralı çift aynı sınıfı açar. Skill yönü `COMBO_KITS[root_secondary]` ile gelir.

| Sınıf | Çift (ikisinden biri kök) | Oynanış | İmza skill (kök→ikincil) | Ters yön skill |
|---|---|---|---|---|
| **Buhar** | Ateş + Su | Basınç yönetimi, koni / kaynar dalga, mermi silme | `fire_water` Buhar Konisi | `water_fire` Kaynar Dalga |
| **Manyetizma** | Toprak + Elektrik | Çek / it / çarpıştır | `earth_storm` Manyetik Çekim | `storm_earth` Demir Çekiş (oyuncuya) |
| **Kül** | Toprak + Ateş | Sis, suikast, lav havuzu | `fire_earth` Lav Havuzu | `earth_fire` Magma Patlama |
| **Plazma** | Ateş + Elektrik | Delici çizgi, yüksek tek hedef | `fire_storm` Plazma Çizgisi | `storm_fire` İnce Yıldırım |
| **Girdap** | Su + Karanlık | Çek + boğma, abyssal alan | `water_void` / `void_water` Abyssal Girdap | aynı kind |
| **Bataklık Filizi** | Toprak + Su | Yavaş alan + ezme, “bitki” taret kapısı | `water_earth` Çamur | `earth_water` Sel Ezmesi |

“Bitki” kullanıcı dilinde iki yerde durur: **Saf Doğa = taret omurgası**, **Toprak+Su = Bataklık Filizi** (çamur + tohum). Tier 3 “Kül + Bitki gübre” Doğa graft’ıdır, üçüncü element değil.

### 2.4 Destek füzyonları (sınıf değil, leke)

2 element kilitliyken temel 6’ya düşmeyen çiftler **destek leke** olarak skill verir, yeni sınıf HUD’u açmaz. Kavşakta bu çiftlerden biri seçilirse en yakın temel sınıfa **map** edilir:

| Çift | Skill (mevcut ad) | Map edilen sınıf | Neden |
|---|---|---|---|
| Ateş + Doğa | Kıvılcım Zıplat / Yanan Orman | Kül (ateş ağır) veya Filiz leke | Yakıcı bitki |
| Ateş + Karanlık | Entropi / Kara Alev | Gölge veya Kül | İnfaz |
| Su + Elektrik | İletken / Zincir Şok | Buhar (ıslak) veya Yıldırım | Süperiletken |
| Su + Doğa | Şifalı Yağmur / Su Işın | Okyanus veya Filiz | Sürdürülebilirlik |
| Toprak + Doğa | Diken / Kök | Taş veya Filiz | CC taret |
| Toprak + Karanlık | Yerçekimi / Meteor | Girdap (çekim) veya Taş | Ezme |
| Doğa + Elektrik | Polen / Statik Diken | Yıldırım veya Filiz | AoE hız |
| Doğa + Karanlık | Ruh Paraziti / Gölge Filiz | Gölge veya Filiz | Can + kalkan |
| Elektrik + Karanlık | Kozmik Ark / Yarık | Plazma veya Girdap | Delici yarık |

Map kuralı: **kökün Saf omurgası + ikincilin leke seti**. Örnek: kök Ateş, ikincil Doğa → sınıf **Kül değil**, HUD “Lav + Filiz leke” olmaz; kök Ateş + ikincil Doğa = destek yolu **Kıvılcım**, oynanış Lav auto + zıplayan spor skill. Temel 6 sınıf yalnızca tablodaki 6 çiftte açılır.

---

## 3. Özel Mekanik Tasarımları

### 3.1 Buhar — Basınç Barı

**Kaynak:** `pressure` 0–100. HUD’da ince yatay bar, skill’in üstünde.

| Olay | Δ basınç |
|---|---|
| Kök auto vuruşu | +3 |
| Yakma tick (ateş leke) | +1 |
| Islak / yavaş uygulandı | +2 |
| İmza skill (koni / dalga) | +14 |
| 1.5s hasar almadan | +4 / s |
| Hasar alındı | −8 |
| Aşırı yük (100) 3s sürer, sonra | −40 (boşalma) |

**Eşikler**

- 0–39 **Buhar:** koni mermi siler (mevcut), yavaş + yakma ayrı ayrı.
- 40–79 **Sıkışık:** koni genişliği ×1.25, ıslak hedeflere +%20. Auto her 3. atışta kısa koni (skill değil).
- 80–99 **Kritik:** bir sonraki skill **patlamalı buhar** — 90px daire, mermileri siler, 0.6s stun. Bar 25’e düşer.
- 100 **Aşırı kaynama:** 3s boyunca auto interval ×0.7 ve self-hasar 2 / 0.5s (cam top riski). Bitince 40’a düşer.

Saf Su veya Saf Ateş bu barı **almaz**. Yalnızca Buhar sınıfı.

Uygulama notu: `player.pressure`, `update` içinde; restart’ta 0. Boss itme bağışıklığı basıncı etkilemez.

### 3.2 Kül — Gizlilik / Sis

İki katman. Karışmasın diye Saf Gölge’nin kısa gizliliği `shadowStep`, Kül’ünkü `ashVeil`.

**Sis alanı:** Lav Havuzu veya Magma Patlama yere **kül sis’i** bırakır (r 86–92, life 260 tick — mevcut zone). Sis içinde:

- Oyuncu: düşman nişan yarıçapı −45%, ilk vuruş **gizlilikten çıkış** +%55 hasar (boss +%20).
- Düşman: görüş konisi daralır; shooter menzili −30.
- Ateş tick: sis içindeki düşmanlar saniyede 3 yanma hasarı (havuz hasarına ek, tavan ayrı).

**Gizlilik (ashVeil):** T2 düğümü. 1.6s tam gizlilik, 16s CD. Şu işler bozar: hasar almak, skill, auto. Hareket bozmaz. Gizlilikte hız +%10.

**Suikast sözleşmesi:** gizlilik veya sis içinden çıkan ilk auto, hedefe `exec` benzeri bonus uygulamaz; düz çarpan verir. İnfaz Gölge / Entropi işidir. Kül cam top + tek hedefdir.

**Deşifre:** Elektrik zinciri, Tesla eklentisi, fırtına biyomu sis yarıçapını −25% yapar.

### 3.3 Manyetizma — Çek / İt / Çarpıştırma

Mevcut `kind:'pull'` (`earth_storm` str 46, `storm_earth` str 48 + `toPlayer`). Üzerine fizik katmanı:

**Kutup durumu** (düşman bayrağı, 5s):

- Skill vuruşu hedefe **N** (kuzey) veya **S** (güney) basar. Ardışık skill kutbu **tersler**.
- Aynı kutup: birbirini **iter** (force 10, elite 6, boss 0).
- Zıt kutup: birbirini **çeker**; mesafe < 28px ise **çarpışma**: her iki hedefe `0.55 * skill.dmg`, kısa stun 0.25s, 40px knock birbirinden dışarı.

**Oyuncu alanı:** `storm_earth` (kök Elektrik) düşmanları **oyuncuya** çeker — tank kırılması. `earth_storm` (kök Toprak) düşmanları **alan merkezine** çeker — çarpışma ocağı.

**Kural:** aynı anda en fazla 8 kutuplu düşman. Fazlasında en eski bayrak düşer. Taret ve boss kutup almaz (boss yalnızca hafif çekim, çarpışma yok).

**Görsel:** N sarı ark, S mavi ark — mevcut neon sarı / su mavisi.

### 3.4 Ortak kaynak sıfırlama

| Kaynak | Kimde | Restart | Reklamla devam |
|---|---|---|---|
| pressure | Buhar | 0 | korunur |
| ashVeil CD | Kül | 0 | korunur |
| poles[] | Manyetizma | silinir | korunur |
| turrets[] | Filiz / graft | silinir | korunur |
| lockedCombos / path | herkes | silinir | korunur |

---

## 4. Tier 3 Efsanevi Sinerjiler (graft)

Run’da **en fazla 1** graft. Lv14+ nadir teklif. Graft, kilitli bir elementin mekaniğini taşır; o elementi açmaz.

### 4.1 Gübreleşmiş Taretler — Kül + Filiz graft

- Koşul: aktif sınıf **Kül** (Ateş+Toprak).
- Graft adı: **Kül Gübre**.
- Etki: Lav / magma zone’unun merkezine 1 **yanmaz tohum** ekilir. Tohum taret değildir; 3s sonra 1 **kül taret** çıkar (max 2). Taret kül mermisi atar (yakma), oyuncu hasarının %40’ı. Sis içinde taret atış hızı +%35 (“gübre”).
- Risk: taret sis dışında %30 yavaş ateş eder. Su zone taret canını 2× eritir.
- UI: omurgada T3 yuvası “Gübre” olur. Doğa chip’i **açılmaz**.

### 4.2 İyon Kazanı — Buhar + Manyetizma graft

- Koşul: **Buhar**.
- Graft: **İyon Çekirdeği**.
- Etki: basınç ≥ 40 iken imza koni/dalga düşmana Manyetizma kutbu basar (N/S dönüşümlü). Kritik basınçta (80+) çarpışma hasarı ×1.35.
- Risk: kutup + ıslak, tesla / zincir (yoksa bile) yok; bunun yerine ıslak+kutup hedef 0.3s fazla stun yer — Buhar’ın tek hedefi zayıflatır, yığınları ezer.
- Doğa/Elektrik açılmaz.

### 4.3 Yıldız Çöküşü — Plazma + Girdap graft

- Koşul: **Plazma** (Ateş+Elektrik).
- Graft: **Çöküş Yarığı**.
- Etki: Plazma çizgisi isabetinin ucunda 0.8s mini girdap (r 54, pull 4.0). Çizgi üzerindeki düşmanlar merkeze toplanır, ikinci çizgi (2.4s içinde) ×1.25 delici hasar.
- Risk: ilk çizginin ham DPS’si −12% (dengelenir). Boss’ta pull yok, yalnızca işaret +%15.

### 4.4 Yanıcı Ufuk — Girdap + Kül graft

- Koşul: **Girdap** (Su+Karanlık).
- Graft: **Kül Ufku**.
- Etki: Abyssal girdap süresi bitince alanda 1.4s kül sis’i bırakır. Sis içindeki boğulma tick’i yakma da uygular. Girdaptan çıkan ilk auto gizlilik çarpanı **almaz**; yerine “boğulmuş + yanık” hedeflere +%30.
- Risk: sis kendi pull’unu %15 kısar (görüş / denge).

### 4.5 Demir Sarmaşık — Manyetizma + Filiz graft (yedek 5.)

- Koşul: **Manyetizma**.
- Graft: **İletken Kök**.
- Etki: çarpışan zıt kutuplar yere 1 kök bırakır (max 3, 6s). Kök Manyetizma merkezidir: yeni düşmanları hafif çeker. Kök Doğa taretı değildir; hasar etmez, sadece fizik.
- Risk: kökler oyuncunun dash/kaçış hattını da tıkar (dostça engel, yarıçap 16).

---

## 5. Düğüm kataloğu (uygulama)

Her path 4 zorunlu omurga düğümü + 6 isteğe bağlı minör. Kavşak sonrası her seçimde 3 kart.

### 5.1 Ortak minörler (evrensel, element taşımaz)

Mevcut `MOD_POOL` kalır ama süzgeç: `MOD_ELEM` eşleşmesi kilitli elemente aitse kart **düşmez**. Örnek: Saf Taş run’ında `overcharge` (storm) gelmez. `resonance` doğa sayılıyorsa Saf Lav’da gelmez.

Yeni evrenseller (elementsiz): alan +%8, CD −%6, max can +8, mıknatıs +12px.

### 5.2 Saf T1–T2 örnekleri (özet)

| Path | T1 | T2 | İmza |
|---|---|---|---|
| Lav | Yakma tavan +3 | Kül topu auto | Alev Püf |
| Okyanus | Dolu auto | Su tabakası | Tsunami |
| Yıldırım | +1 sıçrama | Sıçrama ×4 | Yıldırım Oku |
| Filiz | 1 tohum | 3. taret hakkı | Sarmaşık İnfaz |
| Taş | +18 can / −6% hız | Deprem r +16 | Kaya Sarma |
| Gölge | İnfaz eşiği +%8 | shadowStep | Olay Ufku |

### 5.3 Füzyon T1–T2

| Sınıf | T1 | T2 | İmza |
|---|---|---|---|
| Buhar | Basınç barı açılır | Eşik 80 patlaması | Koni veya Dalga |
| Manyetizma | Kutup bayrağı | Çarpışma | Çekim / Demir Çekiş |
| Kül | Sis zone | ashVeil | Lav veya Magma |
| Plazma | Çizgi kalınlık +2 | Delme +1 | Plazma / İnce Yıldırım |
| Girdap | Pull +1.2 | Exec +0.05 | Abyssal Girdap |
| Bataklık | Çamur yavaş %70→%80 | 1 bataklık tohumu (yavaş taret) | Çamur / Sel |

---

## 6. Restart, menü, tekrar oynanabilirlik

### 6.1 Mevcut kancalar

- Duraklat: `#restartFromPauseBtn` → `restartRun`
- Ölüm: `#restartBtn` → `restartRun`
- `restartRun` = `startRun` = `beginRunWithKit('balanced')` — **kit seçimini de sıfırlar**
- İlk kare: `pendingRewards.unshift('element')` — bugün 2 rastgele element. Hedef: **6 kök kartı, 1 seçim**

### 6.2 Hedef run seed

```
run.lock = {
  root: 'fire' | 'water' | ...,
  secondary: null | elementId,
  path: 'pure_lava' | 'fusion_steam' | ...,
  graft: null | graftId,
  sig: null | sigId
}
```

Aynı kök + aynı ikincil = aynı sınıf, ama eklenti / graft / biyom / lanet run’ı ayırır.  
Farklı kök aynı çiftte (Ateş+Su vs Su+Ateş) skill yönü değişir.

### 6.3 Meta (run dışı)

`META_TREE` aynı kalır. İsteğe bağlı sonraki iş: kök başına kozmetik / başlangıç leke (`START_KITS` ateşçi gibi) — **ikinci element hakkı vermez**.

---

## 7. Mevcut koda geçiş sırası

1. Run başı element teklifini 6 kök / 1 seçim yap.
2. `MAX_COMBOS` fiilen 1 çifte indir (kök + opsiyonel ikincil). Üçüncü kilitli kombo kartı gelmesin.
3. Lv5 kavşak overlay: Saf / Hibrit.
4. Path id → imza `COMBO_KITS` eşlemesi.
5. Basınç, sis, kutup state + HUD.
6. Graft havuzu (4+1).
7. Auto’nun “her kök ekle” davranışını kapat, leke modeline geç.
8. Restart checklist’ine yeni state alanlarını ekle.

---

## 8. Denge omurgası (sayısal tavan)

- Saf tek hedef ≈ Hibrit çoklu kontrol. Saf Lav DPS tavanı Hibrit Plazma tek hedefle yarışır, AoE’de kaybeder.
- Graft, sınıfın zayıf yönünü kapatır ama ana statı %10–15 kısar (Yıldız Çöküşü örneği).
- Boss: stun tavanı 0.45s, knock ≈ 0, exec eşiği yarı, kutup çarpışması yok.
- Can çalma tavanı (Saf Lav + eklenti) vuruşun %10’u, boss %4. Ölümsüzlük kapalı (eski istek).
- Taret toplam DPS oyuncunun %80’ini geçemez.

---

## 9. Sözlük

| Terim | Anlam |
|---|---|
| Kök | Run başında kilitlenen 1. element |
| İkincil | Kavşakta alınan tek diğer element |
| Saf Yol | İkincilsiz evrim |
| Füzyon | 6 imza sınıftan biri |
| Leke | Destek çiftin skill/status katkısı, yeni sınıf değil |
| Graft | Tier 3, üçüncü element olmadan mekanik aşırma |
| Restart | Run lock + özel barlar sıfır |
| Devam | Ölüm reklamı; lock korunur |
