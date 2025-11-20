# Feature Implementation - Dark Mode Example

**Complete before/after transformation**

---

## ❌ BEFORE (Score: 35/100)

```
Add dark mode to the app
```

**Score Breakdown**:
- Clarity: 10/25 (action verb "Add" present, but no scope)
- Context: 5/25 (implies UI work, but no framework/requirements)
- Structure: 0/20
- Techniques: 0/15
- Actionability: 5/15 (concept clear, but execution undefined)

---

## ✅ AFTER (Score: 94/100)

```xml
<task>Implement Material Design 3 dark theme with persistent user preference and WCAG AA contrast</task>

<context>
  <framework>Flutter 3.24.0</framework>
  <state_management>Riverpod 2.4.9</state_management>
  <storage>SharedPreferences (for theme persistence)</storage>
  <design_system>Material Design 3 (useMaterial3: true)</design_system>
  <requirements>
    - System-wide toggle in SettingsScreen
    - Persist choice across app restarts
    - Smooth theme transitions (AnimatedTheme)
    - WCAG AA contrast ratios (4.5:1 text, 3:1 UI)
    - Update custom colors (avatar colors, chart colors) for dark mode visibility
    - Test on all 16 screens
  </requirements>
  <affected_files>
    - lib/main.dart (MaterialApp theme configuration)
    - lib/screens/settings_screen.dart (toggle UI)
    - lib/config/app_theme.dart (theme definitions) [CREATE NEW]
    - lib/providers/theme_provider.dart (state management) [CREATE NEW]
    - lib/services/user_service.dart (preference storage)
  </affected_files>
</context>

<instructions>
1. Create lib/config/app_theme.dart:
   ```dart
   import 'package:flutter/material.dart';

   class AppTheme {
     static ThemeData lightTheme = ThemeData(
       useMaterial3: true,
       brightness: Brightness.light,
       colorScheme: ColorScheme.fromSeed(
         seedColor: Colors.blue,
         brightness: Brightness.light,
       ),
       // Define all theme components (AppBar, Card, etc.)
     );

     static ThemeData darkTheme = ThemeData(
       useMaterial3: true,
       brightness: Brightness.dark,
       colorScheme: ColorScheme.fromSeed(
         seedColor: Colors.blue,
         brightness: Brightness.dark,
       ),
       // Ensure WCAG AA contrast (use ColorScheme.dark for automatic compliance)
     );
   }
   ```

2. Create lib/providers/theme_provider.dart with Riverpod:
   ```dart
   import 'package:flutter/material.dart';
   import 'package:riverpod_annotation/riverpod_annotation.dart';
   import 'package:shared_preferences/shared_preferences.dart';

   part 'theme_provider.g.dart';

   @riverpod
   class ThemeNotifier extends _$ThemeNotifier {
     static const String _themeKey = 'theme_mode';

     @override
     ThemeMode build() {
       _loadTheme();
       return ThemeMode.system; // Default
     }

     Future<void> _loadTheme() async {
       final prefs = await SharedPreferences.getInstance();
       final savedTheme = prefs.getString(_themeKey);

       if (savedTheme != null) {
         state = ThemeMode.values.firstWhere(
           (mode) => mode.name == savedTheme,
           orElse: () => ThemeMode.system,
         );
       }
     }

     Future<void> setThemeMode(ThemeMode mode) async {
       state = mode;
       final prefs = await SharedPreferences.getInstance();
       await prefs.setString(_themeKey, mode.name);
     }
   }
   ```

3. Update lib/main.dart:
   ```dart
   class MyApp extends ConsumerWidget {
     @override
     Widget build(BuildContext context, WidgetRef ref) {
       final themeMode = ref.watch(themeNotifierProvider);

       return MaterialApp.router(
         theme: AppTheme.lightTheme,
         darkTheme: AppTheme.darkTheme,
         themeMode: themeMode, // ✅ Reactive theme switching
         routerConfig: router,
       );
     }
   }
   ```

4. Add toggle in lib/screens/settings_screen.dart:
   ```dart
   SegmentedButton<ThemeMode>(
     segments: const [
       ButtonSegment(value: ThemeMode.light, label: Text('Light'), icon: Icon(Icons.light_mode)),
       ButtonSegment(value: ThemeMode.dark, label: Text('Dark'), icon: Icon(Icons.dark_mode)),
       ButtonSegment(value: ThemeMode.system, label: Text('System'), icon: Icon(Icons.brightness_auto)),
     ],
     selected: {ref.watch(themeNotifierProvider)},
     onSelectionChanged: (Set<ThemeMode> selected) {
       ref.read(themeNotifierProvider.notifier).setThemeMode(selected.first);
     },
   )
   ```

5. Run code generation:
   ```bash
   flutter pub run build_runner build --delete-conflicting-outputs
   ```

6. Test dark mode on all 16 screens:
   - MainScreen, ProfileScreen, GamesScreen, GameDetailScreen
   - PlayersScreen, NewMatchScreen, ActiveMatchScreen
   - CameraScreen, ValidationScreen, AssignScoresScreen
   - MatchResultsScreen, HistoryScreen, StatsScreen, SettingsScreen
   - OnboardingScreen, (any modal dialogs)

7. Verify custom colors:
   - Avatar colors readable in dark mode (test with ColorFilter.mode)
   - fl_chart colors distinguishable (update ChartColors in app_theme.dart)
   - Camera overlay visible (test with dark backgrounds)

8. Run flutter analyze:
   ```bash
   flutter analyze
   ```
</instructions>

<output_format>
<implementation>
  <new_files>
    <file path="lib/config/app_theme.dart">
      ```dart
      // Complete ThemeData definitions for light + dark
      [FULL CODE HERE]
      ```
    </file>
    <file path="lib/providers/theme_provider.dart">
      ```dart
      // Complete ThemeNotifier with SharedPreferences
      [FULL CODE HERE]
      ```
    </file>
  </new_files>

  <modified_files>
    <file path="lib/main.dart">
      ```dart
      // Changes to MaterialApp.router
      theme: AppTheme.lightTheme,
      darkTheme: AppTheme.darkTheme,
      themeMode: ref.watch(themeNotifierProvider),
      ```
    </file>
    <file path="lib/screens/settings_screen.dart">
      ```dart
      // SegmentedButton widget for theme selection
      [FULL WIDGET CODE]
      ```
    </file>
  </modified_files>
</implementation>

<testing_results>
  <manual_tests>
    - [x] All 16 screens render correctly in dark mode
    - [x] Theme persists across app restarts (verified by killing app)
    - [x] Avatar colors readable (tested 10 different colors)
    - [x] Camera preview not affected by theme
    - [x] fl_chart colors distinguishable (Stats screen)
    - [x] Smooth transitions when toggling theme
    - [x] System theme respects device settings
  </manual_tests>

  <accessibility_validation>
    - [x] Text contrast ≥4.5:1 (WCAG AA) - verified with Accessibility Scanner
    - [x] UI component contrast ≥3:1 - verified manually
    - [x] Focus indicators visible in both themes
  </accessibility_validation>

  <code_quality>
    - [x] flutter analyze: 0 errors, 0 warnings
    - [x] No performance regression (theme switching <16ms)
  </code_quality>
</testing_results>
</output_format>
```

**Score Breakdown**:
- Clarity: 24/25 (explicit design system, framework, requirements)
- Context: 25/25 (complete tech stack, affected files, accessibility requirements)
- Structure: 20/20 (perfect XML structure, numbered steps, clear output)
- Techniques: 10/15 (no CoT, but comprehensive step-by-step workflow)
- Actionability: 15/15 (fully executable, all code provided, validation included)

**Improvement**: +59 points (35 → 94)

---

## 🎓 Key Takeaways

1. **Design system matters**: "Material Design 3" vs "dark mode" clarifies constraints
2. **Accessibility requirements**: WCAG AA is a concrete, testable standard
3. **Affected files list**: Developer knows exactly what to modify/create
4. **Complete code snippets**: Not "add theme support", but actual ThemeData code
5. **Testing checklist**: 16 screens mentioned specifically, not "test everything"
