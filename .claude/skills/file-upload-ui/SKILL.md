---
name: file-upload-ui
description: |
  This skill creates file upload UIs with drag-and-drop, preview, progress, and validation.
  Supports React (react-dropzone), Vue 3 (vue-dropzone), with image preview, progress bars, file validation (size, type), multiple files.
  Generates upload components, drag-drop zones, file preview, progress tracking, validation errors.
  Activate when user says "file upload", "drag and drop", "upload images", "file picker", or needs file upload UI.
  Output: Complete file upload UI with drag-drop, preview, progress, validation, and API integration.
---

# File Upload UI

> **Purpose**: Create file upload UIs with drag-drop, preview, and progress

---

## When to Use

- ✅ Upload files (images, documents, videos)
- ✅ Drag-and-drop file upload
- ✅ Image preview before upload
- ✅ Progress bar during upload
- ✅ User says: "file upload", "drag and drop", "upload images"

---

## React Dropzone

```tsx
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { X, Upload, FileIcon } from 'lucide-react';

interface FileWithPreview extends File {
  preview?: string;
}

export function FileUpload() {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const filesWithPreview = acceptedFiles.map(file =>
      Object.assign(file, {
        preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined
      })
    );

    setFiles(prev => [...prev, ...filesWithPreview]);
  }, []);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject
  } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
      'application/pdf': ['.pdf']
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    multiple: true
  });

  const removeFile = (file: FileWithPreview) => {
    setFiles(files => files.filter(f => f !== file));
    if (file.preview) {
      URL.revokeObjectURL(file.preview);
    }
  };

  const uploadFiles = async () => {
    for (const file of files) {
      const formData = new FormData();
      formData.append('file', file);

      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const percentage = (e.loaded / e.total) * 100;
          setUploadProgress(prev => ({ ...prev, [file.name]: percentage }));
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          console.log(`${file.name} uploaded successfully`);
          setUploadProgress(prev => ({ ...prev, [file.name]: 100 }));
        }
      });

      xhr.open('POST', '/api/upload');
      xhr.send(formData);
    }
  };

  return (
    <div className="space-y-4">
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition ${
          isDragActive
            ? 'border-blue-500 bg-blue-50'
            : isDragReject
            ? 'border-red-500 bg-red-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <input {...getInputProps()} />

        <Upload className="mx-auto h-12 w-12 text-gray-400" />

        {isDragActive ? (
          <p className="mt-2 text-blue-600">Drop files here...</p>
        ) : (
          <>
            <p className="mt-2 text-gray-600">Drag & drop files here, or click to select</p>
            <p className="text-sm text-gray-500 mt-1">
              PNG, JPG, GIF, PDF up to 5MB
            </p>
          </>
        )}
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold">Files ({files.length})</h3>

          {files.map((file, index) => (
            <div key={index} className="flex items-center gap-3 p-3 border rounded">
              {/* Preview */}
              {file.preview ? (
                <img
                  src={file.preview}
                  alt={file.name}
                  className="w-16 h-16 object-cover rounded"
                />
              ) : (
                <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center">
                  <FileIcon className="w-8 h-8 text-gray-400" />
                </div>
              )}

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{file.name}</p>
                <p className="text-xs text-gray-500">
                  {(file.size / 1024).toFixed(2)} KB
                </p>

                {/* Progress Bar */}
                {uploadProgress[file.name] !== undefined && (
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded h-2">
                      <div
                        className="bg-blue-600 h-2 rounded transition-all"
                        style={{ width: `${uploadProgress[file.name]}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      {Math.round(uploadProgress[file.name])}%
                    </p>
                  </div>
                )}
              </div>

              {/* Remove Button */}
              <button
                onClick={() => removeFile(file)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          ))}

          {/* Upload Button */}
          <button
            onClick={uploadFiles}
            disabled={files.length === 0}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Upload {files.length} file{files.length !== 1 ? 's' : ''}
          </button>
        </div>
      )}
    </div>
  );
}
```

---

## Vue 3 File Upload

```vue
<script setup lang="ts">
import { ref } from 'vue';

interface FileWithPreview {
  file: File;
  preview?: string;
}

const files = ref<FileWithPreview[]>([]);
const isDragging = ref(false);
const uploadProgress = ref<{ [key: string]: number }>({});

function onDrop(e: DragEvent) {
  isDragging.value = false;
  const droppedFiles = Array.from(e.dataTransfer?.files || []);
  addFiles(droppedFiles);
}

function onFileSelect(e: Event) {
  const input = e.target as HTMLInputElement;
  const selectedFiles = Array.from(input.files || []);
  addFiles(selectedFiles);
}

function addFiles(newFiles: File[]) {
  const filesWithPreview = newFiles.map(file => ({
    file,
    preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined
  }));

  files.value.push(...filesWithPreview);
}

function removeFile(index: number) {
  const file = files.value[index];
  if (file.preview) {
    URL.revokeObjectURL(file.preview);
  }
  files.value.splice(index, 1);
}

async function uploadFiles() {
  for (const { file } of files.value) {
    const formData = new FormData();
    formData.append('file', file);

    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable) {
        uploadProgress.value[file.name] = (e.loaded / e.total) * 100;
      }
    });

    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        console.log(`${file.name} uploaded`);
      }
    });

    xhr.open('POST', '/api/upload');
    xhr.send(formData);
  }
}
</script>

<template>
  <div class="space-y-4">
    <!-- Dropzone -->
    <div
      @drop.prevent="onDrop"
      @dragover.prevent="isDragging = true"
      @dragleave="isDragging = false"
      :class="[
        'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer',
        isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
      ]"
      @click="$refs.fileInput.click()"
    >
      <input
        ref="fileInput"
        type="file"
        multiple
        accept="image/*,.pdf"
        @change="onFileSelect"
        class="hidden"
      />

      <p v-if="isDragging" class="text-blue-600">Drop files here...</p>
      <p v-else class="text-gray-600">Drag & drop or click to select</p>
    </div>

    <!-- File List -->
    <div v-if="files.length > 0" class="space-y-3">
      <div
        v-for="(item, index) in files"
        :key="index"
        class="flex items-center gap-3 p-3 border rounded"
      >
        <img
          v-if="item.preview"
          :src="item.preview"
          class="w-16 h-16 object-cover rounded"
        />

        <div class="flex-1">
          <p class="text-sm font-medium">{{ item.file.name }}</p>

          <div v-if="uploadProgress[item.file.name]" class="mt-2">
            <div class="w-full bg-gray-200 rounded h-2">
              <div
                class="bg-blue-600 h-2 rounded"
                :style="{ width: `${uploadProgress[item.file.name]}%` }"
              />
            </div>
          </div>
        </div>

        <button @click="removeFile(index)" class="text-red-600">Remove</button>
      </div>

      <button
        @click="uploadFiles"
        class="w-full py-2 px-4 bg-blue-600 text-white rounded"
      >
        Upload {{ files.length }} files
      </button>
    </div>
  </div>
</template>
```

---

**Skill Version**: 1.0.0
**Technologies**: React (react-dropzone), Vue 3, drag-drop, image preview
**Output**: File upload UI with drag-drop, preview, progress, validation
