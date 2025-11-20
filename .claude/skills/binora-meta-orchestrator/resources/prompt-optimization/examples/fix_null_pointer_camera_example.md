# Example: Fix NullPointerException in CameraScreen

## Original Prompt (Score: 18/100)
```
"Fix the camera crash"
```

**Issues**:
- ❌ No file path
- ❌ No error message
- ❌ No symptom description
- ❌ No tech stack context
- ❌ No reproduction steps

**Score Breakdown**:
- Clarity: 3/25 (vague verb "fix", no specifics)
- Context: 0/25 (no file, error, or stack)
- Structure: 5/20 (plain text, no XML)
- Techniques: 0/15 (no CoT, examples, or grounding)
- Actionability: 10/15 (somewhat actionable but missing info)

---

## Enhanced Prompt (Score: 88/100)

```xml
<task>Fix NullPointerException in CameraScreen.takePicture() when cameraController is not initialized</task>

<context>
  <file>lib/screens/camera_screen.dart:234</file>
  <error>Null check operator used on null value - cameraController.value</error>
  <symptom>App crashes when user taps capture button before camera initializes</symptom>
  <tech_stack>Flutter 3.24, camera 0.11.0, Riverpod 2.4.9</tech_stack>
  <when_occurs>Reproducible: tap capture immediately after opening CameraScreen</when_occurs>
  <architecture>
    - CameraScreen uses StatefulWidget with CameraController
    - takePicture() called from FloatingActionButton onPressed
    - No initialization check before accessing cameraController.value
  </architecture>
</context>

<instructions>
1. Add null safety check at line 234: if (!cameraController.value.isInitialized) return;
2. Show SnackBar with "Camera initializing, please wait..." message when check fails
3. Disable FloatingActionButton (enabled: cameraController?.value.isInitialized ?? false) until camera ready
4. Add unit test in test/screens/camera_screen_test.dart:
   - Create MockCameraService with isInitialized = false
   - Verify takePicture() returns early without crash
   - Verify SnackBar is shown
5. Verify no crash with: flutter test test/screens/camera_screen_test.dart
6. Manual test: Open CameraScreen, tap capture immediately, verify graceful handling
</instructions>

<output_format>
<fix>
  <file>lib/screens/camera_screen.dart</file>
  <changes>
    - Line 234: Add null safety check
    - Line 186: Update FloatingActionButton enabled property
    - Line 240: Add SnackBar feedback
  </changes>
  <code>Complete Dart code with null check and UI feedback</code>
</fix>
<test>
  <file>test/screens/camera_screen_test.dart</file>
  <test_case>testTakePictureBeforeInitialization</test_case>
  <assertions>
    - Verify no exception thrown
    - Verify SnackBar displayed
    - Verify no XFile returned
  </assertions>
</test>
<verification>
  <manual_steps>
    1. Run app in debug mode
    2. Navigate to CameraScreen
    3. Immediately tap capture button
    4. Verify SnackBar appears
    5. Verify no crash
    6. Wait for camera to initialize
    7. Tap capture again
    8. Verify photo taken successfully
  </manual_steps>
  <flutter_analyze>flutter analyze (expect 0 errors)</flutter_analyze>
</verification>
</output_format>
```

**Score Breakdown**:
- Clarity: 24/25 (specific file, line, error, action verb "Fix")
- Context: 23/25 (tech stack, architecture, reproduction steps)
- Structure: 18/20 (XML tags, sequential steps, structured output)
- Techniques: 13/15 (detailed instructions, examples in context)
- Actionability: 10/15 (all info present, testable, verifiable)

**Improvements**: +70 points (18 → 88)

---

## Expected Fix Code

```dart
// lib/screens/camera_screen.dart:234
Future<void> takePicture() async {
  // Add null safety check
  if (!cameraController.value.isInitialized) {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Camera initializing, please wait...'),
        duration: Duration(seconds: 2),
      ),
    );
    LoggingService.warning('CameraScreen', 'takePicture called before initialization');
    return;
  }

  try {
    final XFile imageFile = await cameraController.takePicture();
    LoggingService.success('CameraScreen', 'Photo captured: ${imageFile.path}');
    // ... rest of existing code
  } catch (e, stackTrace) {
    LoggingService.error('CameraScreen', 'Failed to capture photo', e, stackTrace);
    // ... error handling
  }
}

// lib/screens/camera_screen.dart:186 - Update FAB
FloatingActionButton(
  onPressed: takePicture,
  // Add enabled property
  backgroundColor: (cameraController?.value.isInitialized ?? false)
      ? Theme.of(context).primaryColor
      : Colors.grey,
  child: const Icon(Icons.camera_alt),
)
```

---

## Expected Test Code

```dart
// test/screens/camera_screen_test.dart
testWidgets('takePicture handles uninitialized camera gracefully', (tester) async {
  // Arrange
  final mockCamera = MockCameraService();
  when(() => mockCamera.isInitialized).thenReturn(false);

  await tester.pumpWidget(
    ProviderScope(
      overrides: [
        cameraServiceProvider.overrideWithValue(mockCamera),
      ],
      child: MaterialApp(
        home: CameraScreen(camera: testCameraDescription),
      ),
    ),
  );

  // Act
  await tester.tap(find.byIcon(Icons.camera_alt));
  await tester.pumpAndSettle();

  // Assert
  expect(find.byType(SnackBar), findsOneWidget);
  expect(find.text('Camera initializing, please wait...'), findsOneWidget);
  verifyNever(() => mockCamera.takePicture()); // Should not attempt capture
});
```

---

## Key Takeaways

1. **File Path Specificity**: `lib/screens/camera_screen.dart:234` enables immediate navigation
2. **Error Context**: Exact error message helps identify root cause
3. **Reproduction Steps**: "tap capture immediately" makes issue reproducible
4. **EasyBoard Tech Stack**: Flutter 3.24, camera 0.11.0, Riverpod 2.4.9 provides exact context
5. **Architecture Reference**: Mentions StatefulWidget, CameraController patterns
6. **Testability**: Includes unit test with MockCameraService
7. **Verification**: Both automated (flutter test) and manual testing steps
8. **XML Structure**: Separates task, context, instructions, output format
9. **Actionability**: All info present, can be executed immediately
10. **EasyBoard Patterns**: Uses LoggingService, follows DI patterns, Riverpod testing
