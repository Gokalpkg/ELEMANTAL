import 'package:flame/game.dart';
import 'package:flutter/material.dart';
import 'game/element_game.dart';
import 'ui/ancient_sanctuary_hub.dart';
import 'ui/settings_overlay.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const ElementSavasApp());
}

class ElementSavasApp extends StatelessWidget {
  const ElementSavasApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Element Savas',
      debugShowCheckedModeBanner: false,
      theme: ThemeData.dark().copyWith(
        scaffoldBackgroundColor: const Color(0xFF0F172A),
      ),
      home: Scaffold(
        body: GameWidget<ElementGame>.controlled(
          gameFactory: ElementGame.new,
          overlayBuilderMap: {
            'AncientSanctuary': (context, game) => AncientSanctuaryOverlay(game: game),
            'Settings': (context, game) => SettingsOverlay(game: game),
          },
        ),
      ),
    );
  }
}
