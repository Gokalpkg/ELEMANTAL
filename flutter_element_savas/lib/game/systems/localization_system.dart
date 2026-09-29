enum GameLanguage { tr, en }

class LocalizationSystem {
  static final LocalizationSystem _instance = LocalizationSystem._internal();
  factory LocalizationSystem() => _instance;
  LocalizationSystem._internal();

  GameLanguage currentLanguage = GameLanguage.tr;
  String heroName = 'Alp';

  static const Map<String, Map<String, String>> _strings = {
    'tr': {
      'app_title': 'Element Savaşı',
      'sanctuary_title': '🔮 Kadim Element Sığınağı',
      'sanctuary_welcome': '"Hoş geldin şövalye {name}... Kadim element kristalleri ile gücünü ebediyen mühürle."',
      'return_combat': 'Savaşa Dön ⚔️',
      'settings_title': '⚙️ Oyun Ayarları',
      'shake_title': 'Ekran Sarsıntısı',
      'dmg_title': 'Hasar Sayıları',
    },
    'en': {
      'app_title': 'Elemental War',
      'sanctuary_title': '🔮 Ancient Elemental Sanctuary',
      'sanctuary_welcome': '"Welcome knight {name}... Offer the ancient crystals to seal your eternal prowess."',
      'return_combat': 'Return to Battle ⚔️',
      'settings_title': '⚙️ Settings',
      'shake_title': 'Screen Shake',
      'dmg_title': 'Damage Numbers',
    }
  };

  String get(String key) {
    final langKey = currentLanguage == GameLanguage.en ? 'en' : 'tr';
    return _strings[langKey]?[key] ?? _strings['tr']?[key] ?? key;
  }

  String getBossDialogue(String bossId, int deathCount) {
    final isEn = currentLanguage == GameLanguage.en;
    switch (bossId) {
      case 'stone':
        return deathCount > 0
            ? (isEn ? 'Back again, $heroName? Your bones shall become dust!' : 'Yine mi sen $heroName? Bu sefer toprağa karışacaksın!')
            : (isEn ? 'None shall withstand the primordial monolith!' : 'Kadim taşların gazabından kimse sağ çıkamaz!');
      case 'lava':
        return deathCount > 0
            ? (isEn ? 'Your soul melts in hellfire!' : 'Bu kez ruhunu cehennem alevinde eriteceğim!')
            : (isEn ? 'Taste the blaze of the magma deep!' : 'Magmanın derinliklerinden yükselen ateşi tat!');
      case 'ice':
        return deathCount > 0
            ? (isEn ? 'The blizzard remembers your frozen breath!' : 'Tipi senin soğuk nefesini hala hatırlıyor!')
            : (isEn ? 'A thousand blizzards shall entomb you in ice!' : 'Bin yıllık buzul fırtınası seni donduracak!');
      case 'water':
        return deathCount > 0
            ? (isEn ? 'The abyss still hungers for you!' : 'Derinliklerin karanlığı seni yutmaya doymadı!')
            : (isEn ? 'Drown in the crushing abyss!' : 'Okyanusun ezen derinliğinde boğulacaksın!');
      case 'storm':
        return deathCount > 0
            ? (isEn ? 'Lightning strikes the same fool twice!' : 'Yıldırım aynı ahmak savaşçıyı iki kez çarpar!')
            : (isEn ? 'You cannot outrun the wrath of heaven!' : 'Göklerin gazabından kaçabileceğini mi sandın!');
      case 'forest':
        return deathCount > 0
            ? (isEn ? 'The brambles hunger for more marrow!' : 'Dikenli kökler kemiklerini bir kez daha öğütecek!')
            : (isEn ? 'Nature roots all trespassers!' : 'Ormana saygısızlık eden kök salıp çürümeye mahkumdur!');
      case 'sugar':
        return deathCount > 0
            ? (isEn ? 'Silly knight, back for another sweet demise?' : 'Şeker tadında bir ölümden doymadın mı şövalye?')
            : (isEn ? 'You look like delicious candy!' : 'Çok lezzetli bir lolipop gibi görünüyorsun!');
      case 'ketchup':
        return deathCount > 0
            ? (isEn ? 'More spice for the warlord\'s blade!' : 'Kılıcımın acısını bir kez daha tatmaya geldin!')
            : (isEn ? 'Bow before the sauce of destruction!' : 'Acı sosun ve hardalın gücü önünde diz çök!');
      case 'night':
        return deathCount > 0
            ? (isEn ? 'The void cycle binds your futile soul!' : 'Boşluk döngüsü nafile ruhunu hapsedecek!')
            : (isEn ? 'All shall return to eternal darkness!' : 'Bütün canlılar eninde sonunda karanlığa döner!');
      case 'sand':
        return deathCount > 0
            ? (isEn ? 'The dunes scattered your remains once!' : 'Çöl seni bir kez yuttu, yine toz olacaksın!')
            : (isEn ? 'Surrender to the desert curse!' : 'Çölün kadim akrep lanetine teslim ol!');
      default:
        return isEn ? 'Face the elemental doom, $heroName!' : 'Elementel gazapla yüzleş, $heroName!';
    }
  }
}
