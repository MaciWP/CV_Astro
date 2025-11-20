# Bug Fix - ML Inference Example

**Complete before/after transformation**

---

## ❌ BEFORE (Score: 28/100)

```
Fix the ML detection bug
```

**Score Breakdown**:
- Clarity: 5/25 (action verb "Fix" present, but vague scope)
- Context: 0/25 (no file, error, tech stack, symptom)
- Structure: 0/20 (no XML, no steps)
- Techniques: 0/15 (no CoT, examples, grounding)
- Actionability: 3/15 (can't execute without info)

---

## ✅ AFTER (Score: 89/100)

```xml
<task>Fix NullPointerException in MLService.detectObjects() when ONNX model fails to load</task>

<context>
  <file>lib/services/ml_service.dart:156</file>
  <error>
    ```
    Null check operator used on null value
    at MLService.detectObjects (ml_service.dart:156)
    ```
  </error>
  <symptom>App crashes when switching games if ONNX model file is missing</symptom>
  <tech_stack>Flutter 3.24.0, ONNX Runtime 1.22.0, YOLO11 nano</tech_stack>
  <when_occurs>Reproducible 100% when assets/models/game.onnx deleted, 20% random on game switch</when_occurs>
  <reproduction_steps>
    1. Delete assets/models/pelusas.onnx
    2. Navigate to GamesScreen
    3. Select Pelusas game
    4. Tap "New Match"
    5. App crashes at camera initialization
  </reproduction_steps>
</context>

<instructions>
1. Read lib/services/ml_service.dart:150-170 (detectObjects method)
2. Identify null safety issue:
   - Is _session null-checked before .run()?
   - Is loadModelForGame() validating file existence?
3. Implement defensive programming:
   - Add null check: if (_session == null) throw ModelLoadException(...)
   - Update loadModelForGame() to validate File(modelPath).existsSync()
   - Add try-catch in detectObjects() to handle ModelLoadException gracefully
4. Test fix:
   - Delete model file, verify graceful error instead of crash
   - Restore model file, verify normal operation
   - Test with invalid model path
5. Add logging:
   - LoggingService.error('MLService', 'Model loading failed: $modelPath', exception)
</instructions>

<output_format>
<root_cause>
  <location>lib/services/ml_service.dart:156</location>
  <issue>_session is null when model loading fails, but code assumes it's non-null</issue>
</root_cause>

<fix>
  <file>lib/services/ml_service.dart</file>
  <changes>
    ```dart
    // Before line 156
    Future<List<Detection>> detectObjects(String imagePath) async {
      final preprocessed = await _preprocessImage(imagePath);
      final outputs = _session.run([preprocessed]); // ❌ _session can be null
      // ...
    }

    // After (fixed)
    Future<List<Detection>> detectObjects(String imagePath) async {
      if (_session == null) {
        throw ModelLoadException('ONNX model not loaded. Call loadModelForGame() first.');
      }

      try {
        final preprocessed = await _preprocessImage(imagePath);
        final outputs = _session!.run([preprocessed]); // ✅ Null-checked above
        // ...
      } catch (e, stackTrace) {
        LoggingService.error('MLService', 'Detection failed', e, stackTrace);
        rethrow;
      }
    }

    // Also update loadModelForGame()
    Future<void> loadModelForGame(BoardGame game) async {
      final modelPath = game.modelPath;

      // ✅ Add file existence check
      if (!await File(modelPath).exists()) {
        throw ModelNotFoundException('Model file not found: $modelPath');
      }

      try {
        _session = OrtSession.fromFile(modelPath);
        LoggingService.success('MLService', 'Model loaded: ${game.name}');
      } catch (e, stackTrace) {
        LoggingService.error('MLService', 'Model loading failed', e, stackTrace);
        _session = null; // Ensure null state on failure
        rethrow;
      }
    }
    ```
  </changes>
</fix>

<test_results>
  <test name="Missing model file">
    ✅ Throws ModelNotFoundException instead of crashing
    ✅ Error message indicates exact file path
    ✅ App remains stable
  </test>
  <test name="Valid model">
    ✅ Loads successfully
    ✅ detectObjects() runs normally
    ✅ No performance regression
  </test>
  <test name="Corrupted model">
    ✅ Throws OrtException with descriptive message
    ✅ Logged properly
  </test>
</test_results>
</output_format>
```

**Score Breakdown**:
- Clarity: 23/25 (explicit file:line, quantifiable reproduction rate)
- Context: 24/25 (full tech stack, error log, symptoms, reproduction steps)
- Structure: 18/20 (XML tags, numbered steps, clear output format)
- Techniques: 9/15 (no explicit CoT tags, but diagnostic workflow present)
- Actionability: 15/15 (immediately executable, all info present, validation included)

**Improvement**: +61 points (28 → 89)

---

## 🎓 Key Takeaways

1. **File paths matter**: `lib/services/ml_service.dart:156` is infinitely better than "the ML code"
2. **Error logs are gold**: Paste the actual stack trace
3. **Reproduction steps**: If you can reproduce, you can fix
4. **Quantify symptoms**: "20% random" > "sometimes"
5. **Tech stack versions**: ONNX Runtime 1.22.0 might have known issues
