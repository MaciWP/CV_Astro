---
name: prompt-engineer
description: Detects and enhances low-quality prompts using Anthropic 2025 best practices (XML, CoT, quote grounding). This skill should be used when users provide vague requests, question-based prompts without context, generic tasks without specifics, or explicitly request prompt improvement.
activation:
  keywords:
    - enhance prompt
    - improve prompt
    - better prompt
    - vague
    - unclear request
    - prompt quality
  triggers:
    - Can you
    - Please help
    - How do I
    - fix it
    - make better
---

# Prompt Engineer v2.0

**Version**: 2.0.0
**Auto-activates when**: Vague prompts, missing context, generic requests, ambiguous language, no file paths, low clarity, unclear success criteria, prompt quality issues

---

## Auto-Activation Triggers (Detailed)

This skill activates on:

1. **Vague requests without file paths**: 'fix it', 'make better', 'arregla esto', 'mejoralo', 'add X', 'create Y', 'implement Z'
2. **Question-based prompts without context**: 'how to...', 'como hacer...', 'what is...', 'qué es...', 'where...', 'donde...', 'when...', 'cuando...', 'why...', 'por qué...', 'como harias...', 'how would you...'
3. **Missing critical context**: no file paths (apps/*/file.py), no error messages/stack traces, no tech stack mentioned, no success criteria
4. **Generic technical tasks**: 'add authentication', 'añadir autenticación', 'create API', 'crear endpoint', 'fix tests', 'arreglar pruebas', 'improve performance', 'mejorar rendimiento', 'optimize queries', 'optimizar consultas'
5. **Action verbs without targets**: 'implementar', 'diseñar', 'construir', 'implement', 'design', 'build', 'refactor', 'refactorizar', 'develop', 'desarrollar'
6. **Help requests**: 'ayuda con...', 'help me with...', 'necesito...', 'I need...', 'quiero...', 'I want...', 'puedes...', 'can you...'
7. **Explicit prompt improvement**: 'enhance prompt', 'mejorar prompt', 'better prompt', 'prompt quality'

---

## 🎯 Mission

Automatically detect prompts scoring **<70/100** and enhance them to **≥85/100** using **Anthropic 2025 best practices** (XML tags, Chain of Thought, quote grounding) with **backend-adaptive examples** (auto-detects Django/Flask/FastAPI and loads appropriate tech stack).

---

## 🔍 Auto-Detection Logic

This skill automatically detects your project type and loads the appropriate template:

**Detection Priority** (checks in order):
1. **Astro**: `astro.config.mjs` exists → `templates/astro.md`
2. **Django Multi-Tenant**: `manage.py` + `apps/core/` exists → `templates/django_multi_tenant.md`
3. **Django Standard**: `manage.py` exists → `templates/django.md`
4. **Flask**: `app.py` or `wsgi.py` + "flask" in requirements.txt → `templates/flask.md`
5. **FastAPI**: "fastapi" in requirements.txt → `templates/fastapi.md`
6. **React/Vue/Frontend**: `package.json` + framework detected → `templates/frontend.md`
7. **Generic**: No match → `templates/generic.md` (universal fallback)

---

## 📊 Scoring System (0-100 Points)

**Quick Assessment**:
- **Clarity & Specificity** (25 pts): Action verbs, file paths, quantifiable criteria, technical terms, no vague words
- **Context & Domain** (25 pts): Project architecture, tech stack, error details, edge cases
- **Structure** (20 pts): XML tags, sequential steps, output format
- **Advanced Techniques** (15 pts): Chain of Thought, few-shot examples, quote grounding
- **Actionability** (15 pts): Immediately executable, tool usage, success criteria

**Trigger Conditions**:
- **Auto-activate if**: Total score <70/100, Clarity <15/25, Context <12/25, vague language detected
- **Scoring**: See `core/scoring_rubric.md` for detailed criteria

---

## ⚡ Progressive Disclosure (4 Layers)

**Layer 0: SKILL.md** (Always loaded - ~120 lines)
- This file: Detection, scoring summary, references
- **Tokens**: ~480 tokens

**Layer 1: Universal Principles** (Load if score <70)
- `core/universal_principles.md`: Anthropic 2025 techniques (XML, CoT, quote grounding)
- **Tokens**: ~600 tokens
- **When**: Prompt needs enhancement

**Layer 2: Tech-Specific Template** (Load if project detected)
- `templates/django_multi_tenant.md`: Django/DRF examples, multi-tenant patterns, forbidden rules
- `templates/generic.md`: Universal fallback if no project detected
- **Tokens**: ~1000 tokens
- **When**: Project type detected + score <80

**Layer 3: Deep References** (Load on explicit request)
- `references/anthropic_2025_guide.md`: Complete Anthropic documentation
- `references/project_context_loader.md`: How to integrate CLAUDE.md
- `references/validation_checklists.md`: Expanded validation rules
- **Tokens**: ~1200 tokens
- **When**: User requests deep analysis or comprehensive examples

**Total Token Usage**:
- **Minimum**: Layer 0 only (~480 tokens) - detection + scoring
- **Typical**: Layers 0+1+2 (~2080 tokens) - full enhancement
- **Maximum**: All layers (~3680 tokens) - deep analysis

**Efficiency Gain**: -60% tokens vs monolithic approach (624 lines = ~2500 tokens always loaded)

---

## 🚀 How It Works

**Workflow**:
1. **Detect project type**: Check file system for manage.py, package.json, etc.
2. **Score input prompt**: Calculate 0-100 score across 5 categories
3. **Load layers progressively**:
   - Always: Layer 0 (this file)
   - Score <70: + Layer 1 (universal principles)
   - Project detected: + Layer 2 (tech template)
   - User requests: + Layer 3 (deep references)
4. **Generate enhanced prompt**: Using loaded context and project-specific examples
5. **Validate output**: Ensure enhanced prompt scores ≥85/100

**Example**:
```
User input (Spanish): "Arregla los tests de usuarios"
↓
Score: 25/100 (no context, vague, no files)
↓
Detect: Django Multi-Tenant (manage.py + apps/core/)
↓
Load: Layer 1 (universal) + Layer 2 (django_multi_tenant)
↓
Enhanced (bilingual option):
<tarea>Corregir tests fallidos en apps/core/tests/user_*_tests.py</tarea>
<contexto>
  <archivo>apps/core/tests/</archivo>
  <tech_stack>Django 5.0, DRF 3.14, pytest-django</tech_stack>
  <patrón>AAA pattern, mocker.Mock() not Mock()</patrón>
  <prohibido>NEVER manual tenant_id filtering</prohibido>
</contexto>
<instrucciones>
1. Ejecutar: pytest apps/core/tests/ -v --tb=short
2. Identificar tests fallidos
3. Aplicar patrón AAA (Arrange-Act-Assert)
4. Usar mocker.Mock() para mocks
5. Verificar coverage: pytest --cov=apps.core apps/core/tests/
6. Target: 100% coverage per file
</instrucciones>
↓
Score: 88/100 ✅
```

---

## 📚 References (Progressive Loading)

| Layer | File | Purpose | Lines | Load When |
|-------|------|---------|-------|-----------|
| **1** | `core/universal_principles.md` | Anthropic 2025 techniques (XML, CoT, quote grounding) | ~150 | Score <70 |
| **1** | `core/scoring_rubric.md` | Detailed 0-100 scoring criteria | ~100 | Score <70 |
| **2** | `templates/django_multi_tenant.md` | Django/DRF + multi-tenant examples | ~250 | Django detected |
| **2** | `templates/generic.md` | Universal fallback template | ~150 | No project match |
| **3** | `references/anthropic_2025_guide.md` | Complete Anthropic docs | ~200 | User request |
| **3** | `references/project_context_loader.md` | Integrate CLAUDE.md | ~100 | User request |
| **3** | `references/validation_checklists.md` | Expanded validation | ~150 | User request |

---

## 🎯 Activation Criteria

**Keywords**:
- "prompt quality", "enhance prompt", "improve prompt", "fix prompt", "better prompt"
- "vague request", "missing context", "generic task", "unclear instructions"
- "create prompt", "generate prompt", "structure prompt"

**Auto-Activation Triggers**:
- Prompt score <70/100 (silent monitoring)
- Missing: file paths, error messages, tech stack, success criteria
- Vague language: "somehow", "maybe", "fix it", "make better", "optimize"
- Generic placeholders: {{YOUR_PROJECT}}, {{YOUR_FRAMEWORK}}
- No architecture context
- Missing validation steps

**Context Triggers**:
- User provides vague prompt without file paths
- User requests generic task without project context
- User mentions "fix", "improve", "optimize" without specifics
- User asks for feature without requirements or tech stack

---

## ✅ Quality Guarantee

**Target**: Enhanced prompts score **≥85/100**

**Validation**:
- Clarity: Action verbs + file paths + quantifiable targets
- Context: Tech stack + architecture + current state
- Structure: XML tags for multi-part prompts
- Techniques: CoT for complex tasks, quote grounding for long files
- Actionability: All dependencies + validation steps + complete commands

---

**Version**: 2.1.0
**Last Updated**: 2025-01-29
**Architecture**: Progressive disclosure (4 layers, -60% tokens vs monolithic)
**Compatibility**: Astro, Django, Flask, FastAPI, React, Vue, Generic (full-stack)
