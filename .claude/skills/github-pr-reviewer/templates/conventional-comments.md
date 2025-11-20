# Templates de Conventional Comments en Castellano

Plantillas y ejemplos de comentarios para revisión de PR siguiendo Conventional Comments.

**Tono**: Cercano, amigable, sin formalismos (usar "yo" informal)

---

## 📚 Tabla de Contenidos

### Labels Principales (Recomendados)
1. [praise (✅)](#praise-)
2. [suggestion (💡)](#suggestion-)
3. [issue (❌)](#issue-)
4. [question (❓)](#question-)
5. [thought (💭)](#thought-)
6. [todo (📝)](#todo-)
7. [chore (🔧)](#chore-)
8. [note (📌)](#note-)

### Labels Alternativos (Opcionales)
9. [nitpick / quibble (🔍)](#nitpick--quibble-)
10. [typo (✏️)](#typo-)
11. [polish (✨)](#polish-)

### Otras Secciones
12. [Decoradores](#decoradores)
13. [Formato Parseable](#formato-parseable)
14. [Templates por Criterio](#templates-por-criterio)

---

## praise (✅)

### Características
- Siempre non-blocking
- Al menos 1 por PR
- Específico, no genérico
- Sincero y honesto

### Templates Generales

```markdown
praise: Me gusta cómo has implementado {patrón} aquí, queda muy limpio! 👌

praise: Excelente trabajo con {aspecto}. {Detalle específico}.

praise: Buena decisión usar {técnica} aquí, {beneficio que aporta}.

praise: Me gusta mucho la separación de {concepto}, muy clara y fácil de mantener.

praise: Has cubierto todos los casos edge en los tests. Muy completo!
```

### Ejemplos Reales

```markdown
praise: Me gusta cómo has separado Input/Output serializers aquí, queda muy limpio y sigue el patrón del proyecto. 👌

praise: Excelente cobertura de tests, has cubierto crear, actualizar, patch, y casos vacíos. Muy completo!

praise: Buena decisión usar .select_related() aquí, evitas un N+1 potencial.

praise: Me gusta que uses type hints en todos los parámetros. El código es muy claro y auto-documentado.

praise: Perfecto uso de write_only=True aquí, evita exponer la estructura interna del campo.

praise: ⭐ CRÍTICO PASSED: No veo filtrado manual de tenant_id. El middleware está manejando la isolación correctamente!
```

---

## suggestion (💡)

### Características
- Típicamente non-blocking
- Explicar el "por qué"
- Proponer solución concreta
- Ser constructivo

### Templates Generales

```markdown
suggestion (non-blocking): Podrías {acción} aquí para {beneficio}. {Detalle o ejemplo}.

suggestion (non-blocking): Sería mejor {alternativa} porque {razón}. ¿Qué opinas?

suggestion (non-blocking): Considera usar {técnica} en lugar de {técnica_actual}, {ventaja}.

suggestion (blocking): Este {elemento} tiene +{número} líneas, sería mejor {solución} para {beneficio}.
```

### Ejemplos por Escenario

#### Query Optimization
```markdown
suggestion (non-blocking): Podrías optimizar esta query añadiendo .select_related('company') si necesitas acceder a company en las respuestas, evitarías un N+1.

suggestion (non-blocking): Considera usar .prefetch_related('permissions') aquí si vas a iterar sobre permissions, mejoraría el performance.

suggestion (non-blocking): Podrías añadir .only('id', 'name') si solo necesitas esos campos, reducirías el tamaño de la query.
```

#### Code Organization
```markdown
suggestion (non-blocking): Los fixtures test_team y api_client_logged podrían consolidarse en uno si siempre se usan juntos, simplificaría los tests.

suggestion (blocking): Este método tiene +50 líneas, sería mejor extraerlo a un servicio dedicado para mantener la claridad.

suggestion (non-blocking): Podrías extraer esta lógica a un helper method _calculate_permissions(), haría el código más legible.
```

#### Style and Patterns
```markdown
suggestion (non-blocking): Sería mejor usar datacenters en lugar de datacenters_list para seguir la convención de nombres del proyecto.

suggestion (non-blocking): Considera añadir __all__ al módulo siguiendo la guía de estilo del proyecto.

suggestion (non-blocking): Podrías usar f-strings aquí en lugar de .format(), es más pythonic y claro.
```

---

## issue (❌)

### Características
- Típicamente blocking
- Identificar problema claramente
- Proponer solución específica
- Mapear a criterio cuando aplique

### Templates por Criterio

#### Criterio 1: Input/Output Separation
```markdown
issue (blocking): Veo que no hay separación Input/Output en este serializer. ¿Podrías crear {Model}InputSerializer y {Model}OutputSerializer siguiendo el patrón de apps/core/serializers/user.py?

**Referencia**: Criterio 1 (Separación Input/Output en serializers)
```

#### Criterio 2: Business Logic in Services
```markdown
issue (blocking): Veo que hay lógica de negocio en el {view/serializer}. Según nuestra arquitectura, esto debería estar en {Model}Service. ¿Podrías moverlo a {Model}Service.{method_name}()?

**Referencia**: Criterio 2 (Lógica de negocio en servicios)

---

issue (blocking): Este método del serializer tiene lógica de negocio compleja ({descripción}). Debería estar en un servicio. ¿Podrías crear {Model}Service.{method_name}() y llamarlo desde aquí? Puedes ver un ejemplo en apps/core/services.py → AuthService.

**Referencia**: Criterio 2 (Lógica de negocio en servicios)
```

#### Criterio 3: Type Hints
```markdown
issue (blocking): Falta type hint en el parámetro '{param}' del método {method}. Necesitamos type hints en todos los parámetros (Criterio 3).

Ejemplo:
def {method}(self, {param}: {type}) -> {return_type}:

**Referencia**: Criterio 3 (Type hints obligatorios)

---

issue (blocking): El return type del método {method} no está especificado. ¿Podrías añadir -> {return_type}?

**Referencia**: Criterio 3 (Type hints obligatorios)
```

#### Criterio 4: Tests AAA Pattern
```markdown
issue (blocking): Este test no sigue el patrón AAA (Arrange-Act-Assert). Necesitas separar claramente las 3 fases con líneas en blanco.

Ejemplo:
def test_create_user_succeeds():
    # Arrange
    data = {"email": "test@example.com"}

    # Act
    user = User.objects.create(**data)

    # Assert
    assert user.email == data["email"]

**Referencia**: Criterio 4 (Tests con patrón AAA)
```

#### Criterio 5: Coverage 100%
```markdown
issue (blocking): Falta cobertura de tests para el caso cuando {scenario}. ¿Puedes añadir test_{name}?

Para mantener 100% de coverage necesitamos cubrir este caso.

**Referencia**: Criterio 5 (Coverage 100%)

---

issue (blocking): El método {method} no tiene tests. Necesitamos test para:
- Happy path: test_{method}_succeeds
- Error case: test_{method}_with_{error}_fails

**Referencia**: Criterio 5 (Coverage 100%)
```

#### Criterio 6: NO Manual tenant_id (CRÍTICO)
```markdown
issue (blocking): ⚠️ CRÍTICO: Veo filtrado manual de tenant_id en la línea {line}:

{code_snippet}

Esto NUNCA debe hacerse. El middleware MultitenantMiddleware maneja la isolación de tenants automáticamente. Elimina el .filter(tenant_id=...) y déjalo así:

{corrected_code}

Este es nuestro criterio MÁS CRÍTICO. La violación puede causar fugas de datos entre tenants.

**Referencia**: Criterio 6 (NO filtrado manual de tenant_id) - CRÍTICO P0

---

issue (blocking): ⚠️ CRÍTICO: Veo que estás pasando tenant_id manualmente en la línea {line}. El middleware ya filtra por tenant automáticamente. Elimina este parámetro:

❌ {Model}.objects.filter(tenant_id=company.id, ...)
✅ {Model}.objects.filter(...)

**Referencia**: Criterio 6 (NO filtrado manual de tenant_id) - CRÍTICO P0
```

#### Criterio 9: Tests without docstrings
```markdown
issue (blocking): Este test tiene docstrings/comentarios. Según nuestra filosofía YOLO, los tests deben ser auto-explicativos sin docstrings ni comentarios. Elimínalos.

El nombre del test debe ser suficientemente descriptivo:
- ✅ test_create_user_with_valid_data_succeeds
- ❌ def test_user(): \"\"\"Test user creation\"\"\"

**Referencia**: Criterio 9 (Tests sin docstrings ni comentarios)
```

#### Criterio 11: OpenAPI Contract
```markdown
issue (blocking): Este endpoint no coincide con el contrato OpenAPI. El response schema espera:

{expected_schema}

Pero estás devolviendo:

{actual_schema}

¿Puedes alinearlo con binora-contract/paths/{path}.yaml?

**Referencia**: Criterio 11 (Validar contra contrato OpenAPI)
```

---

## question (❓)

### Características
- Non-blocking por naturaleza
- Pregunta genuina
- Puede llevar a issue/suggestion

### Templates Generales

```markdown
question: ¿Por qué usas {técnica_A} en lugar de {técnica_B}? ¿Hay alguna razón específica?

question: ¿Has considerado usar {alternativa} aquí en lugar de {actual}? Podría simplificar el código, o hay alguna razón para mantenerlo así?

question: Veo que {acción}. ¿Ya no necesitamos {elemento}? ¿O es para un caso específico?

question: ¿Este cambio afecta a {componente_relacionado}? ¿Has verificado la compatibilidad?
```

### Ejemplos Reales

```markdown
question: ¿Por qué usas source='datacenters_list' en lugar de source='datacenters' directamente? ¿Hay alguna razón específica para la nomenclatura?

question: ¿Has considerado usar to_representation() aquí en lugar de un OutputSerializer separado? Podría simplificar el código, o prefieres mantenerlos separados por claridad?

question: Veo que eliminas el test test_list_teams_does_not_include_datacenters_field. ¿Ya no necesitamos validar ese comportamiento? ¿O lo cubre otro test?

question: ¿Este campo datacenters será usado en otras partes del sistema? ¿Deberíamos documentar el comportamiento en algún lugar?

question: ¿Por qué required=True en datacenters si puede estar vacío? ¿No debería ser required=False con allow_empty=True?
```

---

## thought (💭)

### Características
- Siempre non-blocking
- No requiere acción inmediata
- Ideas para el futuro
- Fomenta discusión

### Templates Generales

```markdown
thought: Esto me hace pensar que podríamos {idea_futura}. Podría ser un buen {refactoring/feature} para el futuro.

thought: Estamos repitiendo {patrón} en varios lugares. Quizás valdría la pena {solución_genérica}.

thought: Este manejo de {concepto} podría extenderse a {otros_componentes}. Podríamos pensar en un patrón genérico.

thought: Me pregunto si {pregunta_arquitectónica}. Sería interesante explorarlo en el futuro.
```

### Ejemplos Reales

```markdown
thought: Esto me hace pensar que podríamos tener un helper genérico para manejar permissions en todos los serializers, no solo en Team. Podría ser un buen refactoring futuro para reutilizar código.

thought: Estamos repitiendo este patrón de validación de permisos en varios serializers. Quizás valdría la pena crear un mixin PermissionValidationMixin para reutilizarlo.

thought: Este manejo de datacenters en Team podría extenderse a User y otros modelos. Podríamos pensar en un patrón genérico para relaciones many-to-many con filtrado por permisos.

thought: Me pregunto si deberíamos tener un sistema de caching para permissions. Con muchos usuarios podría mejorar el performance, pero añadiría complejidad.

thought: Veo que usamos HyperlinkedModelSerializer en varios lugares. ¿Sería útil tener una clase base BinoraTenantSerializer que añada funcionalidad común? Solo una idea para explorar.
```

---

## todo (📝)

### Características
- Non-blocking por defecto
- Cambios pequeños, triviales pero necesarios
- Diferencia de `issue`: más simple y directo
- Diferencia de `suggestion`: requiere acción, no es opcional

### Templates Generales

```markdown
todo: Añadir {elemento} aquí antes de merge.

todo: Renombrar {old_name} → {new_name} por {razón}.

todo: Actualizar {componente} para reflejar este cambio.

todo: Añadir migration para {cambio_db}.
```

### Ejemplos Reales

```markdown
todo: Añadir __all__ a este módulo siguiendo la guía de estilo.

todo: Renombrar datacenters_list → datacenters por convención.

todo: Actualizar el test existente test_team_list para incluir el nuevo campo.

todo: Añadir migration para el nuevo campo datacenters en Team model.

todo: Ejecutar nox -s format antes de commit.

todo: Actualizar CHANGELOG.md con este cambio.
```

---

## chore (🔧)

### Características
- Non-blocking típicamente
- Tareas simples que deben hacerse
- Referencia a procesos comunes
- Incluir link al proceso si existe

### Templates Generales

```markdown
chore: Ejecutar {comando} antes de merge. [Link al proceso]

chore: Actualizar {archivo_config} con el nuevo {elemento}.

chore: Verificar que {condición} antes de deploy.

chore (blocking): Necesitamos {acción_crítica} antes de aceptar esta PR.
```

### Ejemplos Reales

```markdown
chore: Ejecutar python manage.py makemigrations antes de merge para generar las migraciones necesarias.

chore: Actualizar requirements.txt si añadiste nuevas dependencias.

chore: Verificar que los tests pasen con nox -s test antes de merge.

chore (blocking): Necesitamos actualizar binora-contract submodule con el nuevo endpoint antes de aceptar esta PR. [Docs de proceso](link)

chore: Añadir entry en .claude/CHANGELOG.md para este feature.

chore: Ejecutar nox -s frontend_permissions_update para regenerar permisos del frontend después de cambios en OpenAPI.
```

---

## note (📌)

### Características
- **SIEMPRE** non-blocking
- Highlight de algo importante
- No requiere acción
- Información contextual útil

### Templates Generales

```markdown
note: {Información importante que el reviewer debe saber}

note: Este cambio también afecta a {componente_relacionado}.

note: Ten en cuenta que {detalle_importante}.

note: FYI: {contexto_útil}.
```

### Ejemplos Reales

```markdown
note: Este cambio también afecta a la serialización en TeamOutputSerializer. Los tests cubren ambos casos.

note: Ten en cuenta que este endpoint se usa en 3 lugares del frontend: dashboard, settings, y admin panel.

note: FYI: El middleware añade tenant_id automáticamente, por eso no lo vemos en la query explícitamente.

note: Este pattern se repite en UserSerializer y CompanySerializer. Hemos mantenido consistencia.

note: La migración es backward-compatible, no requiere downtime.

note: Este fix también resuelve el issue #1234 que reportaron la semana pasada.
```

---

## nitpick / quibble (🔍)

### Características
- **SIEMPRE** non-blocking
- Preferencias triviales basadas en gusto personal
- No son problemas reales
- `quibble` es alternativa más amigable a `nitpick`

### Diferencia entre nitpick y quibble
- `nitpick` → término tradicional pero puede sonar negativo
- `quibble` → mismo concepto, más amigable (sin imágenes de "piojos")

### Templates Generales

```markdown
nitpick (non-blocking): Prefiero {opción_A} sobre {opción_B}, pero es solo preferencia personal.

quibble: Me gusta más {estilo_A}, pero {estilo_B} también está bien.

nitpick: Esto podría ser {alternativa}, aunque lo actual funciona perfectamente.
```

### Ejemplos Reales

```markdown
nitpick (non-blocking): Prefiero usar comillas dobles "" en lugar de simples '' para strings, pero es solo preferencia personal. Lo actual está bien.

quibble: Me gusta más poner el return en línea separada, pero es solo estilo.

nitpick: Podrías alinear estos imports alfabéticamente, aunque no es necesario.

quibble: Prefiero nombrar esta variable 'user_list' en lugar de 'users', pero ambos son claros.

nitpick (non-blocking): El nombre get_datacenters podría ser fetch_datacenters para ser más explícito, pero es mínimo.
```

---

## typo (✏️)

### Características
- Non-blocking (salvo APIs públicas)
- Breve y directo
- Proponer corrección exacta

### Templates Generales

```markdown
typo: "{typo}" → "{corrección}" ({razón si no es obvio})

typo: Comentario en español: "{comentario}" → según nuestro estándar, comentarios en inglés.

typo: Nombre de variable/método: "{actual}" → "{sugerido}" por {razón de convención}.
```

### Ejemplos Reales

```markdown
typo: "datacenters_list" → "datacenter_list" (singular)? Por convención usamos singular para relaciones.

typo: "permisions" → "permissions" (falta una 's')

typo: "usuário" → "usuario" (sin tilde)

typo: Comentario en español: "# Validar que el usuario tenga permisos" → según nuestro estándar, comentarios en inglés: "# Validate user has permissions"

typo: Nombre de método "retreive_data" → "retrieve_data" (doble 'e')

typo: En docstring: "Retorna el usuario" → "Returns the user" (inglés)
```

---

## polish (✨)

### Características
- Non-blocking típicamente
- Nada está mal, pero hay forma de mejorar calidad inmediatamente
- Similar a `suggestion` pero más enfocado en calidad/estilo
- No es un problema, es una mejora

### Templates Generales

```markdown
polish (non-blocking): Esto funcionaría mejor con {mejora}, haría el código más {adjetivo_positivo}.

polish: Podrías mejorar la legibilidad usando {técnica}.

polish (if-minor): Considera {mejora} si es un cambio rápido.
```

### Ejemplos Reales

```markdown
polish (non-blocking): Esto funcionaría mejor con un docstring en la función, haría el código más autodocumentado.

polish: Podrías mejorar la legibilidad extrayendo esta lógica a una variable intermedia con nombre descriptivo.

polish (if-minor): Considera usar una f-string aquí en lugar de .format(), es más moderno y claro.

polish: Este dict comprehension sería más legible como un for loop tradicional dado que tiene 3 líneas. Más fácil de debuggear.

polish (non-blocking): El orden de estos imports podría seguir PEP8 (stdlib, third-party, local), pero es cosmético.

polish: Usar una constante VALID_STATUSES = [...] en lugar de hardcodear la lista haría este código más mantenible.
```

---

## Decoradores

Los decoradores añaden contexto adicional a los comentarios. Van entre paréntesis después del label.

### Decoradores Estándar

| Decorador | Uso | Descripción |
|-----------|-----|-------------|
| `(blocking)` | Cuando comentarios son blocking por defecto | Previene merge hasta resolver |
| `(non-blocking)` | Cuando comentarios son non-blocking por defecto | No previene merge |
| `(if-minor)` | Sugerencias opcionales | Resolver solo si cambio es trivial |

### Decoradores Personalizados (Binora)

Podemos añadir decoradores específicos del proyecto:

| Decorador | Uso | Ejemplo |
|-----------|-----|---------|
| `(security)` | Relacionado con seguridad | `suggestion (security): ...` |
| `(performance)` | Optimización de rendimiento | `suggestion (performance): ...` |
| `(test)` | Relacionado con testing | `suggestion (test): ...` |
| `(architecture)` | Decisiones arquitectónicas | `question (architecture): ...` |
| `(ux)` | Experiencia de usuario | `issue (ux, non-blocking): ...` |

### Ejemplos con Decoradores

```markdown
suggestion (security, blocking): Evita usar eval() aquí, es un riesgo de seguridad. Usa ast.literal_eval() en su lugar.

suggestion (performance, non-blocking): Podrías cachear este resultado si se llama frecuentemente.

suggestion (test, if-minor): Considera añadir un test para el edge case cuando user.email es None, si es rápido.

question (architecture): ¿Por qué elegiste un approach síncrono aquí en lugar de async? ¿Hay alguna limitación?

issue (ux, non-blocking): Este mensaje de error podría ser más claro para el usuario final. Algo como "Email inválido" en lugar de "Validation error".

thought (performance): Esto me hace pensar que podríamos beneficiarnos de un índice compuesto en (tenant_id, email) si esta query es frecuente.
```

### Reglas para Decoradores

1. **No abusar**: Máximo 2 decoradores por comentario
2. **Claridad**: Solo añadir si mejora comprensión
3. **Consistencia**: Usar los mismos decoradores en todo el proyecto
4. **Ejemplos buenos**:
   - ✅ `suggestion (security): ...`
   - ✅ `issue (blocking): ...`
   - ✅ `suggestion (test, if-minor): ...`
5. **Ejemplos malos**:
   - ❌ `suggestion (security, performance, test, blocking): ...` (demasiados)
   - ❌ `issue (maybe-we-should-think-about): ...` (decorador poco claro)

---

## Formato Parseable

Los Conventional Comments siguen un formato que puede ser parseado automáticamente por máquinas.

### Formato Completo

```
<label> [decorations]: <subject>

[discussion]
```

- **label**: El tipo de comentario (praise, suggestion, issue, etc.)
- **subject**: El mensaje principal (una línea)
- **decorations** (opcional): Decoradores extra (blocking, non-blocking, etc.)
- **discussion** (opcional): Contexto adicional, razonamiento, pasos siguientes

### Ejemplo de Parseo

**Comentario:**
```markdown
question (non-blocking): ¿Por qué usaste threading en lugar de asyncio aquí?

Asyncio sería más eficiente para I/O bound operations. ¿Hay alguna limitación específica?
```

**JSON Parseado:**
```json
{
  "label": "question",
  "subject": "¿Por qué usaste threading en lugar de asyncio aquí?",
  "decorations": ["non-blocking"],
  "discussion": "Asyncio sería más eficiente para I/O bound operations. ¿Hay alguna limitación específica?"
}
```

### Beneficios del Formato Parseable

1. **Métricas automáticas**: Contar tipos de comentarios por PR
2. **Filtrado**: Mostrar solo `issue (blocking)` pendientes
3. **Reports**: Generar estadísticas de code review
4. **Integración CI/CD**: Bloquear merge si hay issues blocking
5. **Dashboard**: Visualizar trends de calidad de código

### Ejemplo de Script de Parseo

```python
import re
from typing import Dict, List, Optional

def parse_conventional_comment(comment: str) -> Dict:
    """Parse a conventional comment into structured data."""
    # Regex: label (decorations): subject
    pattern = r'^(\w+)\s*(?:\(([\w\s,-]+)\))?\s*:\s*(.+?)(?:\n\n(.+))?$'
    match = re.match(pattern, comment, re.DOTALL)

    if not match:
        return None

    label, decorations, subject, discussion = match.groups()

    return {
        "label": label,
        "subject": subject.strip(),
        "decorations": [d.strip() for d in decorations.split(',')] if decorations else [],
        "discussion": discussion.strip() if discussion else None
    }

# Ejemplo de uso
comment = """suggestion (security, blocking): Evita usar eval() aquí.

Usa ast.literal_eval() que es seguro y valida la entrada."""

parsed = parse_conventional_comment(comment)
print(parsed)
# {
#   "label": "suggestion",
#   "subject": "Evita usar eval() aquí.",
#   "decorations": ["security", "blocking"],
#   "discussion": "Usa ast.literal_eval() que es seguro y valida la entrada."
# }
```

---

## Templates por Criterio

### Criterio 1: Separación Input/Output en Serializers

#### ✅ Praise
```markdown
praise: Me gusta cómo has separado Input/Output serializers aquí ({Model}InputSerializer y {Model}OutputSerializer), queda muy limpio y sigue el patrón del proyecto. 👌

praise: Excelente separación de Input/Output! El InputSerializer valida y escribe, el OutputSerializer solo lee. Muy claro.
```

#### ❌ Issue
```markdown
issue (blocking): Veo que no hay separación Input/Output en este serializer. ¿Podrías crear {Model}InputSerializer (para create/update) y {Model}OutputSerializer (para list/retrieve) siguiendo el patrón de apps/core/serializers/user.py?

**Referencia**: Criterio 1 (Separación Input/Output en serializers)
```

#### 💡 Suggestion
```markdown
suggestion (non-blocking): Podrías separar este serializer en Input/Output para mayor claridad. Input maneja write_only fields, Output maneja read_only fields.
```

---

### Criterio 2: Lógica de Negocio en Servicios

#### ✅ Praise
```markdown
praise: Me gusta que delegues la lógica de negocio a {Model}Service aquí. Mantiene el serializer/view limpio y sigue nuestra arquitectura. 👌

praise: Perfecto! El ViewSet solo maneja HTTP y delega a {Model}Service. Arquitectura limpia.
```

#### ❌ Issue
```markdown
issue (blocking): Veo que hay lógica de negocio en el {view/serializer} (líneas {start}-{end}). Según nuestra arquitectura, esto debería estar en {Model}Service. ¿Podrías crear {Model}Service.{method_name}() y llamarlo desde aquí?

Ejemplo de refactoring:
# Antes (en serializer)
new_permissions = FrontendPermissionsHelper.merge_permissions(...)
instance.permissions.set(new_permissions)

# Después (en servicio)
TeamService.update_team_permissions(instance, permissions_data)

Puedes ver ejemplos en apps/core/services.py → AuthService.

**Referencia**: Criterio 2 (Lógica de negocio en servicios)
```

#### 💡 Suggestion
```markdown
suggestion (blocking): Este método del serializer tiene bastante lógica ({líneas} líneas). Sería mejor moverlo a {Model}Service para mantener la separación de responsabilidades.
```

---

### Criterio 6: NO Manual tenant_id (CRÍTICO)

#### ✅ Praise
```markdown
praise: ⭐ CRÍTICO PASSED: No veo filtrado manual de tenant_id en ningún lado. El middleware está manejando la isolación correctamente. Esto es MUY importante para la seguridad multi-tenant!

praise: Perfecto! No hay .filter(tenant_id=...) manual. Confías en el middleware como debe ser. CRÍTICO check passed! ✅
```

#### ❌ Issue (SIEMPRE BLOCKING Y CRÍTICO)
```markdown
issue (blocking): ⚠️ CRÍTICO: Veo filtrado manual de tenant_id en la línea {line}:

{code_snippet}

Esto NUNCA debe hacerse. El middleware MultitenantMiddleware filtra automáticamente por tenant en TODAS las queries. Elimina el filtro manual:

❌ INCORRECTO:
{Model}.objects.filter(tenant_id=company.id, email=email)

✅ CORRECTO:
{Model}.objects.filter(email=email)

El middleware añade tenant_id automáticamente. El filtrado manual puede:
1. Causar fugas de datos entre tenants (seguridad crítica)
2. Romper la arquitectura multi-tenant
3. Causar queries incorrectas en servicios tenant

Este es nuestro criterio MÁS CRÍTICO (P0). La violación es un blocker absoluto.

**Referencia**: Criterio 6 (NO filtrado manual de tenant_id) - CRÍTICO P0
```

---

### Criterio 7: Queries Optimizados

#### ✅ Praise
```markdown
praise: Buena decisión usar .select_related('{relation}') aquí, evitas un N+1 potencial! Estos detalles de performance se notan.

praise: Me gusta que uses instance.{relation} en lugar de instance.{relation}.all() - evitas una query innecesaria.

praise: Perfecto uso de .prefetch_related() para las relaciones many-to-many. Query optimizada! 👌
```

#### 💡 Suggestion
```markdown
suggestion (non-blocking): Podrías optimizar esta query añadiendo .select_related('{relation}') si necesitas acceder a {relation} en las respuestas, evitarías un N+1.

suggestion (non-blocking): Considera usar .prefetch_related('{relation}') aquí si vas a iterar sobre {relation}, mejoraría el performance con muchos objetos.

suggestion (non-blocking): Podrías añadir .only('id', 'name', 'email') si solo necesitas esos campos, reducirías el tamaño de la query.
```

---

## 📝 Formato de Comentario Completo

### Estructura
```markdown
**{archivo}:{línea}** ({contexto: función/clase/variable})
{tipo} {(decorator)}: {mensaje en Castellano, tono amigable}

{Detalle adicional si es necesario}

**Referencia**: {Criterio X (nombre)} {si aplica}
```

### Ejemplo Real Completo
```markdown
**apps/core/serializers/team.py:38** (TeamWithPermissionsInputSerializer.update)
issue (blocking): Veo que hay lógica de negocio en el método update del serializer (merge de permissions con FrontendPermissionsHelper). Según nuestra arquitectura, esto debería estar en un servicio. ¿Podrías crear un método TeamService.update_team_permissions(team, permissions_data) y llamarlo desde aquí?

Ejemplo de refactoring:
# En TeamService
@staticmethod
def update_team_permissions(team: Team, permissions_data: dict) -> Team:
    new_permissions = FrontendPermissionsHelper.merge_permissions_to_store(
        permissions_data, team.frontend_permissions
    )
    team.permissions.set(new_permissions)
    return team

# En serializer
TeamService.update_team_permissions(instance, permissions_data)

Puedes ver un ejemplo similar en apps/core/services.py → AuthService.

**Referencia**: Criterio 2 (Lógica de negocio en servicios)
```

---

## 🎯 Checklist para Generación de Comentarios

Antes de generar comentarios, verificar:

### Contenido
- [ ] Al menos 1 `praise` por PR (buena práctica, motivación)
- [ ] Todos los `issue` tienen sugerencia de solución concreta
- [ ] Ser específico, no vago (archivo:línea, función/variable)
- [ ] Proponer solución con código cuando sea posible
- [ ] No duplicar comentarios existentes

### Formato
- [ ] Ubicación precisa: `**archivo:línea** (contexto)`
- [ ] Label correcto según tipo: praise/suggestion/issue/question/thought/todo/chore/note
- [ ] Decoradores apropiados: `(blocking)` / `(non-blocking)` / `(if-minor)`
- [ ] Formato parseable: `label (decorators): subject\n\ndiscussion`

### Tono y Estilo
- [ ] Tono cercano y amigable (tú informal en castellano)
- [ ] Constructivo, no crítico
- [ ] Explicar el "por qué", no solo el "qué"

### Proyecto Específico (Binora)
- [ ] Referencia a criterio cuando aplique (`**Referencia**: Criterio X`)
- [ ] Priorizar correctamente (Criterio 6 siempre CRÍTICO P0)
- [ ] Usar labels específicos cuando aplique: `(security)`, `(performance)`, `(test)`, `(architecture)`

### Distribución Recomendada por PR

Para una PR típica de 200-500 líneas:
- **praise**: 2-4 comentarios (aspectos positivos)
- **suggestion**: 3-6 comentarios (mejoras opcionales)
- **issue**: 1-5 comentarios (problemas que requieren fix)
- **question**: 1-3 comentarios (clarificaciones)
- **thought**: 0-2 comentarios (ideas futuras)
- **todo**: 1-3 comentarios (tareas pequeñas)
- **note**: 0-2 comentarios (información contextual)

---

## 📊 Labels: Cuándo Usar Cada Uno

### Guía Rápida de Decisión

```
¿Es algo positivo que merece reconocimiento?
└─→ praise ✅

¿Es un problema que debe corregirse?
├─→ ¿Es crítico/bloqueante? → issue (blocking) ❌
├─→ ¿Es menor pero necesario? → issue (non-blocking) ❌
└─→ ¿Es trivial? → todo 📝

¿Es una mejora opcional?
├─→ ¿Mejora significativa? → suggestion 💡
├─→ ¿Solo preferencia personal? → nitpick/quibble 🔍
└─→ ¿Solo calidad/estilo? → polish ✨

¿No estás seguro o necesitas clarificación?
└─→ question ❓

¿Es solo información útil sin acción requerida?
└─→ note 📌

¿Es una idea para el futuro?
└─→ thought 💭

¿Es tarea de proceso antes de merge?
└─→ chore 🔧

¿Es un error de tipeo/spelling?
└─→ typo ✏️
```

### Matriz de Decisión: Label × Blocking

| Label | Típicamente | Puede ser | Nunca |
|-------|-------------|-----------|-------|
| **praise** | non-blocking | - | blocking |
| **suggestion** | non-blocking | blocking | - |
| **issue** | blocking | non-blocking | - |
| **question** | non-blocking | - | blocking |
| **thought** | - | - | blocking |
| **todo** | non-blocking | blocking | - |
| **chore** | non-blocking | blocking | - |
| **note** | - | - | blocking |
| **nitpick/quibble** | - | - | blocking |
| **typo** | non-blocking | blocking* | - |
| **polish** | non-blocking | - | blocking |

\* Solo blocking si afecta API pública o nombres expuestos

---

## 🌍 Conventional Comments en Otros Idiomas

### English (Original)
```markdown
praise: Great work on the test coverage! You've covered all edge cases.

suggestion (non-blocking): You could optimize this query by adding .select_related('company').

issue (blocking): I see business logic in the view. This should be in a service layer.

question: Why did you choose threading over asyncio here? Is there a specific limitation?
```

### Castellano (Binora Style)
```markdown
praise: Excelente trabajo con la cobertura de tests! Has cubierto todos los casos edge.

suggestion (non-blocking): Podrías optimizar esta query añadiendo .select_related('company').

issue (blocking): Veo lógica de negocio en el view. Esto debería estar en un servicio.

question: ¿Por qué elegiste threading en lugar de asyncio aquí? ¿Hay alguna limitación específica?
```

**Nota**: Binora usa Castellano informal (tú) para mantener tono cercano y colaborativo.

---

## 📚 Referencias

- **Conventional Comments Oficial**: https://conventionalcomments.org/
- **Skill**: `.claude/skills/github-pr-reviewer/SKILL.md`
- **Agente**: `.claude/agents/pr-comment-generator/AGENT.md`
- **Criterios de Revisión**: `.claude/skills/github-pr-reviewer/references/criterios-revision.md`
- **Ejemplos Completos**: `.claude/skills/github-pr-reviewer/examples/ejemplo-completo.md`

---

## 📝 Changelog

### v2.0.0 - 2025-01-12
- ✅ Añadidos labels adicionales: `todo`, `chore`, `note`, `nitpick/quibble`, `polish`
- ✅ Añadido decorador `(if-minor)`
- ✅ Añadida sección "Formato Parseable" con ejemplo de script Python
- ✅ Añadida sección "Decoradores Personalizados" (security, performance, test, etc.)
- ✅ Añadida "Guía Rápida de Decisión" (árbol de decisión)
- ✅ Añadida "Matriz de Decisión: Label × Blocking"
- ✅ Añadida distribución recomendada de comentarios por PR
- ✅ Añadidos ejemplos en inglés y castellano
- ✅ 100% compatible con https://conventionalcomments.org/

### v1.0.0 - 2024
- Versión inicial con labels básicos en castellano