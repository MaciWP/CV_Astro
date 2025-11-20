## 6.2 Cognitive Verifier Pattern

**When to Use**: Complex requests requiring multi-step reasoning, validation, or fact-checking.

**Pattern Structure**:
1. **Decompose** complex question into sub-questions
2. **Answer** each sub-question independently
3. **Synthesize** sub-answers into final answer
4. **Verify** consistency across sub-answers

**Example - BEFORE**:
```
User: "Why is my ONNX inference slow?"
```

**Example - AFTER (Applied)**:
```
Decomposition:
1. What is current inference latency? (Need baseline)
2. What is target latency? (<150ms per EasyBoard requirements)
3. Where is the bottleneck? (Preprocessing? Model execution? NMS?)
4. Is session caching working? (Should reuse OrtSession)
5. What is tensor format? (Must be [1,3,640,640] NCHW, [0,1] normalized)

Sub-Answers:
1. Unknown - need user to provide profiling data
2. Target: <150ms (EasyBoard requirement for YOLO11)
3. Unknown - requires LoggingService.performance output
4. Unknown - check if OrtSession created once or per inference
5. Unknown - verify preprocessing matches ONNX input spec

Synthesis:
Cannot optimize without baseline metrics. BLOCKER detected.

Verification:
Consistent across all sub-answers: Missing profiling data.

Action:
Request user to enable logging and provide metrics, OR provide generic optimization checklist.
```

**Impact**: Prevents hallucinated answers, surfaces missing information early.

---

