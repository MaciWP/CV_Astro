## 6.5 Reflection Pattern

**When to Use**: After completing task, to learn from experience and improve future responses.

**Pattern Structure**:
1. **Review** what was done
2. **Evaluate** what worked well
3. **Identify** what could be improved
4. **Extract** generalizable lessons
5. **Store** in memory (WRITE operation to knowledge base)

**Example**:
```
After fixing ONNX FP16 bug:

📝 REFLECTION

What was done:
- User reported Float32List incompatibility with FP16 ONNX model
- Researched ONNX tensor types vs Dart typed arrays
- Created convert_fp16_to_fp32_io.py script with Cast nodes
- Documented in AI_BUGS_KNOWLEDGE.md (BUG-2025102602)

What worked well:
- Checking AI_BUGS_KNOWLEDGE.md first (found no prior similar bug)
- Creating conversion script (reusable for future FP16 models)
- Documenting with root cause + prevention pattern

What could be improved:
- Could have suggested FP16 risk earlier during YOLO export
- Should add automated check in ML pipeline (detect FP16 during model export)

Generalizable lessons:
1. ALWAYS check tensor dtype compatibility between ONNX and target platform
2. FP16 models common in YOLO exports - proactively warn
3. Keep conversion scripts in BoardGameScorer-ML/scripts/ for reuse

WRITE to knowledge base:
[Stores lesson in context memory for future sessions]
```

**Impact**: Builds institutional knowledge, prevents recurrence of bugs.

---

