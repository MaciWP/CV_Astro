# Frontend Component Template (Universal)

**Use this template for**: React, Vue, Angular, Svelte, Flutter widgets, React Native components

**Instructions**: Replace all `{{SlotName}}` placeholders with actual values from your project context.

---

## React/TypeScript Example

```typescript
import React, { useState, useEffect } from 'react';
import { {{ServiceType}} } from '@/services/{{servicePath}}';

interface {{ComponentName}}Props {
  {{propName1}}: {{propType1}};
  {{propName2}}?: {{propType2}};
  on{{EventName}}: ({{eventParam}}: {{eventType}}) => void;
}

/**
 * {{ComponentDescription}}
 *
 * @example
 * ```tsx
 * <{{ComponentName}}
 *   {{propName1}}={{exampleValue1}}
 *   {{propName2}}={{exampleValue2}}
 *   on{{EventName}}={({{eventParam}}) => console.log({{eventParam}})}
 * />
 * ```
 */
export const {{ComponentName}}: React.FC<{{ComponentName}}Props> = ({
  {{propName1}},
  {{propName2}},
  on{{EventName}},
}) => {
  // State
  const [{{stateName}}, set{{StateNameCapitalized}}] = useState<{{stateType}}>({{initialState}});
  const [isLoading, setIsLoading] = useState(false);

  // Effects
  useEffect(() => {
    // {{EffectDescription}}
    {{effectLogic}}
  }, [{{dependencies}}]);

  // Handlers
  const handle{{ActionName}} = async ({{handlerParam}}: {{handlerType}}) => {
    setIsLoading(true);
    try {
      {{handlerLogic}}
      on{{EventName}}({{eventParam}});
    } catch (error) {
      console.error('{{ErrorContext}}:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Render
  return (
    <{{ContainerElement}} className="{{containerClasses}}">
      <{{TitleElement}}>{{ComponentTitle}}</{{TitleElement}}>

      {isLoading ? (
        <{{LoadingElement}}>{{LoadingText}}</{{LoadingElement}}>
      ) : (
        <{{ContentElement}}>
          {{componentContent}}
        </{{ContentElement}}>
      )}

      <{{ButtonElement}} onClick={handle{{ActionName}}}>
        {{ButtonText}}
      </{{ButtonElement}}>
    </{{ContainerElement}}>
  );
};
```

---

## Flutter/Dart Example

```dart
import 'package:flutter/material.dart';
import '{{packagePath}}/services/{{servicePath}}.dart';

/// {{ComponentDescription}}
///
/// Example:
/// ```dart
/// {{ComponentName}}(
///   {{propName1}}: {{exampleValue1}},
///   {{propName2}}: {{exampleValue2}},
///   on{{EventName}}: ({{eventParam}}) => print({{eventParam}}),
/// )
/// ```
class {{ComponentName}} extends StatefulWidget {
  final {{PropType1}} {{propName1}};
  final {{PropType2}}? {{propName2}};
  final void Function({{EventType}} {{eventParam}}) on{{EventName}};

  const {{ComponentName}}({
    super.key,
    required this.{{propName1}},
    this.{{propName2}},
    required this.on{{EventName}},
  });

  @override
  State<{{ComponentName}}> createState() => _{{ComponentName}}State();
}

class _{{ComponentName}}State extends State<{{ComponentName}}> {
  {{StateType}} {{stateName}} = {{initialState}};
  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    {{initLogic}}
  }

  Future<void> _handle{{ActionName}}({{HandlerType}} {{handlerParam}}) async {
    setState(() => _isLoading = true);

    try {
      {{handlerLogic}}
      widget.on{{EventName}}({{eventParam}});
    } catch (e) {
      debugPrint('{{ErrorContext}}: $e');
    } finally {
      if (mounted) {
        setState(() => _isLoading = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return {{ContainerWidget}}(
      child: Column(
        children: [
          Text('{{ComponentTitle}}'),

          if (_isLoading)
            const CircularProgressIndicator()
          else
            {{ContentWidget}}(
              {{contentProps}}
            ),

          ElevatedButton(
            onPressed: () => _handle{{ActionName}}({{buttonParam}}),
            child: const Text('{{ButtonText}}'),
          ),
        ],
      ),
    );
  }

  @override
  void dispose() {
    {{disposeLogic}}
    super.dispose();
  }
}
```

---

## Vue 3 Composition API Example

```vue
<template>
  <{{ContainerElement}} class="{{containerClasses}}">
    <{{TitleElement}}>{{ComponentTitle}}</{{TitleElement}}>

    <{{LoadingElement}} v-if="isLoading">{{LoadingText}}</{{LoadingElement}}>

    <{{ContentElement}} v-else>
      {{componentContent}}
    </{{ContentElement}}>

    <{{ButtonElement}} @click="handle{{ActionName}}">
      {{ButtonText}}
    </{{ButtonElement}}>
  </{{ContainerElement}}>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { {{PropType1}}, {{PropType2}} } from '@/types/{{typePath}}';

// Props
interface Props {
  {{propName1}}: {{PropType1}};
  {{propName2}}?: {{PropType2}};
}

const props = defineProps<Props>();

// Emits
const emit = defineEmits<{
  {{eventName}}: [{{eventParam}}: {{EventType}}];
}>();

// State
const {{stateName}} = ref<{{StateType}}>({{initialState}});
const isLoading = ref(false);

// Lifecycle
onMounted(() => {
  {{mountLogic}}
});

// Handlers
const handle{{ActionName}} = async ({{handlerParam}}: {{HandlerType}}) => {
  isLoading.value = true;

  try {
    {{handlerLogic}}
    emit('{{eventName}}', {{eventParam}});
  } catch (error) {
    console.error('{{ErrorContext}}:', error);
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.{{containerClasses}} {
  {{containerStyles}}
}
</style>
```

---

## Slot Reference

| Slot | Purpose | Example Values |
|------|---------|----------------|
| `{{ComponentName}}` | Component class/function name | `UserProfile`, `ProductCard`, `SearchBar` |
| `{{ComponentDescription}}` | What the component does | `Displays user profile with avatar and stats` |
| `{{ComponentTitle}}` | Display title | `User Profile`, `Product Details` |
| `{{propName1}}`, `{{propName2}}` | Component properties | `userId`, `isEditable`, `theme` |
| `{{propType1}}`, `{{propType2}}` | Property TypeScript types | `string`, `boolean`, `User`, `number` |
| `{{stateName}}` | Internal state variable | `userData`, `items`, `selectedId` |
| `{{StateType}}` | State type | `User \| null`, `Product[]`, `string` |
| `{{initialState}}` | Initial state value | `null`, `[]`, `''`, `0` |
| `{{EventName}}` | Event callback name | `Change`, `Submit`, `Delete`, `Select` |
| `{{eventParam}}` | Event parameter | `user`, `item`, `id`, `value` |
| `{{EventType}}` | Event parameter type | `User`, `string`, `number`, `FormData` |
| `{{ActionName}}` | Handler action name | `Save`, `Delete`, `Submit`, `Load` |
| `{{handlerLogic}}` | Business logic in handler | `await service.save(data)`, `items.filter(...)` |
| `{{ContainerElement}}` | Container HTML/widget | `div`, `Card`, `Container`, `section` |
| `{{ContentElement}}` | Content wrapper | `div`, `Column`, `Row`, `main` |
| `{{ButtonElement}}` | Button element | `button`, `ElevatedButton`, `Button` |
| `{{LoadingElement}}` | Loading indicator | `Spinner`, `CircularProgressIndicator`, `div` |
| `{{ServiceType}}` | Injected service type | `IUserService`, `ProductRepository`, `ApiClient` |

---

## Usage Instructions

1. **Identify tech stack** from Step 1 of skill creation
2. **Select appropriate template section** (React, Flutter, Vue)
3. **Replace ALL {{slots}}** with project-specific values
4. **Validate** that replaced code compiles/runs
5. **Add to skill** as code example

---

## Best Practices

- **Props**: Keep to 3-5 max, use object for complex config
- **State**: Colocate state with usage, lift up when shared
- **Events**: Prefix with `on` (React/Flutter) or use `emit` (Vue)
- **Loading**: Always track async operations with loading state
- **Error handling**: Try/catch all async operations
- **Accessibility**: Add ARIA labels, semantic HTML
- **Performance**: Memoize expensive computations (useMemo, const)

---

**Last Updated**: 2025-10-20
**Compatible With**: React 18+, Vue 3+, Flutter 3+, Angular 16+, Svelte 4+
