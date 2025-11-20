---
name: form-builder-with-validation
description: |
  This skill builds complete forms with validation, error handling, and accessibility.
  Supports React (React Hook Form), Vue 3 (Vuelidate, VeeValidate), Svelte (Felte).
  Creates form schemas, field validation, error messages, submission handling, and accessibility (ARIA).
  Activate when user says "create form", "add form validation", "build signup form", or needs input forms.
  Output: Production-ready forms with validation, error handling, loading states, and accessibility.
---

# Form Builder with Validation

> **Purpose**: Generate forms with validation, error handling, and accessibility

---

## When to Use This Skill

Activate when:
- ✅ Building login/registration forms
- ✅ Creating contact forms, checkout forms, profile forms
- ✅ Need client-side validation with real-time feedback
- ✅ User says: "create form", "add validation", "signup form", "contact form"
- ✅ Need accessible forms (WCAG 2.1 AA)

---

## What This Skill Does

**Generates forms with**:
1. **Field components** - Input, select, checkbox, radio, textarea
2. **Validation** - Real-time + on submit (Zod, Yup schemas)
3. **Error messages** - Clear, field-specific errors
4. **Loading states** - Disable during submission
5. **Accessibility** - ARIA labels, error announcements
6. **File uploads** - With preview and progress
7. **Multi-step forms** - Wizard-style forms
8. **Auto-save** - Save drafts automatically

---

## Supported Technologies

### React
- **React Hook Form** (recommended) - Performant, TypeScript-first
- **Formik** - Popular, feature-rich
- **React Final Form** - Subscription-based

### Vue 3
- **VeeValidate** (recommended) - Composition API, Yup/Zod integration
- **Vuelidate** - Lightweight, flexible
- **FormKit** - Full-featured form framework

### Validation Libraries
- **Zod** (TypeScript) - Type inference
- **Yup** - Schema validation
- **Joi** - Enterprise validation

---

## React Hook Form + Zod

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';

// Define validation schema
const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain uppercase letter')
    .regex(/[0-9]/, 'Must contain number'),
  confirmPassword: z.string(),
  name: z.string().min(2, 'Name too short'),
  age: z.number().int().min(18, 'Must be 18+').optional(),
  acceptTerms: z.boolean().refine(val => val === true, 'Must accept terms')
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword']
});

type RegisterFormData = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    watch
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onBlur' // Validate on blur
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      alert('Registration successful!');
      reset(); // Clear form
    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Email Field */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium">
          Email *
        </label>
        <input
          id="email"
          type="email"
          {...register('email')}
          className={`mt-1 block w-full rounded border ${
            errors.email ? 'border-red-500' : 'border-gray-300'
          }`}
          aria-invalid={errors.email ? 'true' : 'false'}
          aria-describedby={errors.email ? 'email-error' : undefined}
        />
        {errors.email && (
          <p id="email-error" className="mt-1 text-sm text-red-600" role="alert">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Password Field */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium">
          Password *
        </label>
        <input
          id="password"
          type="password"
          {...register('password')}
          className={`mt-1 block w-full rounded border ${
            errors.password ? 'border-red-500' : 'border-gray-300'
          }`}
          aria-invalid={errors.password ? 'true' : 'false'}
          aria-describedby={errors.password ? 'password-error' : undefined}
        />
        {errors.password && (
          <p id="password-error" className="mt-1 text-sm text-red-600" role="alert">
            {errors.password.message}
          </p>
        )}
      </div>

      {/* Confirm Password */}
      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium">
          Confirm Password *
        </label>
        <input
          id="confirmPassword"
          type="password"
          {...register('confirmPassword')}
          className={`mt-1 block w-full rounded border ${
            errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.confirmPassword && (
          <p className="mt-1 text-sm text-red-600" role="alert">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      {/* Name Field */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium">
          Full Name *
        </label>
        <input
          id="name"
          type="text"
          {...register('name')}
          className="mt-1 block w-full rounded border border-gray-300"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600" role="alert">
            {errors.name.message}
          </p>
        )}
      </div>

      {/* Accept Terms Checkbox */}
      <div className="flex items-start">
        <input
          id="acceptTerms"
          type="checkbox"
          {...register('acceptTerms')}
          className="mt-1"
        />
        <label htmlFor="acceptTerms" className="ml-2 text-sm">
          I accept the terms and conditions *
        </label>
      </div>
      {errors.acceptTerms && (
        <p className="text-sm text-red-600" role="alert">
          {errors.acceptTerms.message}
        </p>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full py-2 px-4 rounded ${
          isSubmitting
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
        } text-white font-medium`}
      >
        {isSubmitting ? 'Registering...' : 'Register'}
      </button>
    </form>
  );
}
```

---

## Vue 3 + VeeValidate + Zod

```vue
<script setup lang="ts">
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { z } from 'zod';
import { ref } from 'vue';

// Define validation schema
const registerSchema = toTypedSchema(
  z.object({
    email: z.string().email('Invalid email'),
    password: z.string().min(8, 'Password must be 8+ characters'),
    confirmPassword: z.string(),
    name: z.string().min(2, 'Name too short'),
    acceptTerms: z.boolean().refine(val => val === true, 'Must accept terms')
  }).refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword']
  })
);

// Setup form
const { handleSubmit, defineField, errors, isSubmitting } = useForm({
  validationSchema: registerSchema
});

// Define fields
const [email, emailAttrs] = defineField('email');
const [password, passwordAttrs] = defineField('password');
const [confirmPassword, confirmPasswordAttrs] = defineField('confirmPassword');
const [name, nameAttrs] = defineField('name');
const [acceptTerms, acceptTermsAttrs] = defineField('acceptTerms');

// Submit handler
const onSubmit = handleSubmit(async (values) => {
  try {
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values)
    });

    if (!response.ok) throw new Error('Registration failed');

    alert('Registration successful!');
  } catch (error) {
    alert(`Error: ${error.message}`);
  }
});
</script>

<template>
  <form @submit="onSubmit" class="space-y-4">
    <!-- Email -->
    <div>
      <label for="email" class="block text-sm font-medium">Email *</label>
      <input
        id="email"
        v-model="email"
        v-bind="emailAttrs"
        type="email"
        :class="['mt-1 block w-full rounded border', errors.email ? 'border-red-500' : 'border-gray-300']"
        :aria-invalid="!!errors.email"
      />
      <p v-if="errors.email" class="mt-1 text-sm text-red-600" role="alert">
        {{ errors.email }}
      </p>
    </div>

    <!-- Password -->
    <div>
      <label for="password" class="block text-sm font-medium">Password *</label>
      <input
        id="password"
        v-model="password"
        v-bind="passwordAttrs"
        type="password"
        :class="['mt-1 block w-full rounded border', errors.password ? 'border-red-500' : 'border-gray-300']"
      />
      <p v-if="errors.password" class="mt-1 text-sm text-red-600" role="alert">
        {{ errors.password }}
      </p>
    </div>

    <!-- Confirm Password -->
    <div>
      <label for="confirmPassword" class="block text-sm font-medium">Confirm Password *</label>
      <input
        id="confirmPassword"
        v-model="confirmPassword"
        v-bind="confirmPasswordAttrs"
        type="password"
        class="mt-1 block w-full rounded border border-gray-300"
      />
      <p v-if="errors.confirmPassword" class="mt-1 text-sm text-red-600" role="alert">
        {{ errors.confirmPassword }}
      </p>
    </div>

    <!-- Name -->
    <div>
      <label for="name" class="block text-sm font-medium">Full Name *</label>
      <input
        id="name"
        v-model="name"
        v-bind="nameAttrs"
        type="text"
        class="mt-1 block w-full rounded border border-gray-300"
      />
      <p v-if="errors.name" class="mt-1 text-sm text-red-600" role="alert">
        {{ errors.name }}
      </p>
    </div>

    <!-- Accept Terms -->
    <div class="flex items-start">
      <input
        id="acceptTerms"
        v-model="acceptTerms"
        v-bind="acceptTermsAttrs"
        type="checkbox"
        class="mt-1"
      />
      <label for="acceptTerms" class="ml-2 text-sm">
        I accept the terms and conditions *
      </label>
    </div>
    <p v-if="errors.acceptTerms" class="text-sm text-red-600" role="alert">
      {{ errors.acceptTerms }}
    </p>

    <!-- Submit -->
    <button
      type="submit"
      :disabled="isSubmitting"
      :class="[
        'w-full py-2 px-4 rounded text-white font-medium',
        isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
      ]"
    >
      {{ isSubmitting ? 'Registering...' : 'Register' }}
    </button>
  </form>
</template>
```

---

## File Upload Form

```tsx
import { useForm } from 'react-hook-form';
import { useState } from 'react';

interface FileUploadFormData {
  file: FileList;
  description: string;
}

export function FileUploadForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<FileUploadFormData>();
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: FileUploadFormData) => {
    const formData = new FormData();
    formData.append('file', data.file[0]);
    formData.append('description', data.description);

    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable) {
        const percentage = (e.loaded / e.total) * 100;
        setUploadProgress(percentage);
      }
    });

    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        alert('File uploaded successfully!');
        setUploadProgress(0);
        setPreview(null);
      } else {
        alert('Upload failed');
      }
    });

    xhr.open('POST', '/api/upload');
    xhr.send(formData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Upload File *</label>
        <input
          type="file"
          {...register('file', {
            required: 'File is required',
            validate: {
              size: (files) => files[0]?.size < 5000000 || 'File must be less than 5MB',
              type: (files) =>
                ['image/jpeg', 'image/png', 'image/gif'].includes(files[0]?.type) ||
                'Only JPEG, PNG, GIF allowed'
            }
          })}
          onChange={onFileChange}
          accept="image/*"
          className="mt-1 block w-full"
        />
        {errors.file && (
          <p className="mt-1 text-sm text-red-600">{errors.file.message}</p>
        )}
      </div>

      {preview && (
        <div>
          <p className="text-sm font-medium">Preview:</p>
          <img src={preview} alt="Preview" className="mt-2 max-w-xs rounded" />
        </div>
      )}

      {uploadProgress > 0 && uploadProgress < 100 && (
        <div>
          <div className="w-full bg-gray-200 rounded">
            <div
              className="bg-blue-600 h-2 rounded transition-all"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
          <p className="text-sm text-gray-600 mt-1">{Math.round(uploadProgress)}%</p>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium">Description</label>
        <textarea
          {...register('description', { maxLength: 500 })}
          className="mt-1 block w-full rounded border border-gray-300"
          rows={3}
        />
      </div>

      <button
        type="submit"
        className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Upload
      </button>
    </form>
  );
}
```

---

## Multi-Step Form (Wizard)

```tsx
import { useState } from 'react';
import { useForm } from 'react-hook-form';

type Step1Data = { email: string; password: string };
type Step2Data = { name: string; age: number };
type Step3Data = { address: string; city: string };
type FormData = Step1Data & Step2Data & Step3Data;

export function MultiStepForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<FormData>>({});

  const { register, handleSubmit, formState: { errors } } = useForm();

  const nextStep = (data: any) => {
    setFormData({ ...formData, ...data });
    setStep(step + 1);
  };

  const prevStep = () => setStep(step - 1);

  const onSubmit = async (data: any) => {
    const finalData = { ...formData, ...data };
    console.log('Final data:', finalData);

    // Submit to API
    await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(finalData)
    });
  };

  return (
    <div>
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex justify-between">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`w-1/3 h-2 ${s <= step ? 'bg-blue-600' : 'bg-gray-200'}`}
            />
          ))}
        </div>
        <p className="text-sm text-gray-600 mt-2">Step {step} of 3</p>
      </div>

      {/* Step 1: Account */}
      {step === 1 && (
        <form onSubmit={handleSubmit(nextStep)}>
          <h2 className="text-xl font-bold mb-4">Step 1: Account</h2>
          <input
            {...register('email', { required: 'Email required' })}
            type="email"
            placeholder="Email"
            className="block w-full mb-4 p-2 border rounded"
          />
          {errors.email && <p className="text-red-600">{errors.email.message}</p>}

          <input
            {...register('password', { required: 'Password required', minLength: 8 })}
            type="password"
            placeholder="Password"
            className="block w-full mb-4 p-2 border rounded"
          />

          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            Next
          </button>
        </form>
      )}

      {/* Step 2: Personal Info */}
      {step === 2 && (
        <form onSubmit={handleSubmit(nextStep)}>
          <h2 className="text-xl font-bold mb-4">Step 2: Personal Info</h2>
          <input
            {...register('name', { required: 'Name required' })}
            placeholder="Full Name"
            className="block w-full mb-4 p-2 border rounded"
          />

          <input
            {...register('age', { required: 'Age required', min: 18 })}
            type="number"
            placeholder="Age"
            className="block w-full mb-4 p-2 border rounded"
          />

          <div className="flex gap-2">
            <button type="button" onClick={prevStep} className="bg-gray-400 text-white px-4 py-2 rounded">
              Back
            </button>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
              Next
            </button>
          </div>
        </form>
      )}

      {/* Step 3: Address */}
      {step === 3 && (
        <form onSubmit={handleSubmit(onSubmit)}>
          <h2 className="text-xl font-bold mb-4">Step 3: Address</h2>
          <input
            {...register('address', { required: 'Address required' })}
            placeholder="Street Address"
            className="block w-full mb-4 p-2 border rounded"
          />

          <input
            {...register('city', { required: 'City required' })}
            placeholder="City"
            className="block w-full mb-4 p-2 border rounded"
          />

          <div className="flex gap-2">
            <button type="button" onClick={prevStep} className="bg-gray-400 text-white px-4 py-2 rounded">
              Back
            </button>
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
              Submit
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
```

---

## Accessibility Best Practices

1. **Labels** - Every input has `<label>` with `htmlFor`
2. **ARIA** - Use `aria-invalid`, `aria-describedby`, `role="alert"`
3. **Keyboard** - Tab order, Enter to submit
4. **Focus** - Visual focus indicators
5. **Error announcement** - Screen readers announce errors

---

**Skill Version**: 1.0.0
**Technologies**: React (React Hook Form), Vue 3 (VeeValidate), Zod, Yup
**Output**: Forms with validation, errors, accessibility, file uploads, multi-step
