# Enterprise Development Standards - Nuxt 4 Project

## Table of Contents
1. [Project Structure Standards](#project-structure-standards)
2. [File Naming Conventions](#file-naming-conventions)
3. [Code Organization Guidelines](#code-organization-guidelines)
4. [Configuration Standards](#configuration-standards)
5. [Development Workflow](#development-workflow)
6. [Module Integration Standards](#module-integration-standards)

## Project Structure Standards

### Root Directory Structure
```
project-root/
├── app/                    # Application source code (Nuxt 4 app directory)
│   ├── components/         # Vue components
│   ├── composables/        # Composition API utilities
│   ├── layouts/           # Application layouts
│   ├── middleware/        # Route middleware
│   ├── pages/             # File-based routing
│   ├── plugins/           # Nuxt plugins
│   ├── utils/             # Utility functions
│   └── app.vue            # Root application component
├── assets/                # Build-time assets (processed by Vite)
├── content/               # Content files (@nuxt/content)
├── public/                # Static assets (served directly)
├── server/                # Server-side code
│   ├── api/               # API routes
│   ├── middleware/        # Server middleware
│   └── utils/             # Server utilities
├── types/                 # TypeScript type definitions
├── docs/                  # Project documentation
└── nuxt.config.ts         # Nuxt configuration
```

### Detailed Directory Guidelines

#### `app/components/` Structure
```
components/
├── ui/                    # Base UI components (@nuxt/ui extensions)
│   ├── Button/
│   │   ├── Button.vue
│   │   ├── ButtonGroup.vue
│   │   └── index.ts
│   └── Form/
│       ├── FormField.vue
│       ├── FormGroup.vue
│       └── index.ts
├── layout/                # Layout-specific components
│   ├── Header/
│   ├── Footer/
│   ├── Sidebar/
│   └── Navigation/
├── feature/               # Feature-specific components
│   ├── auth/
│   ├── dashboard/
│   ├── user-management/
│   └── content/
├── common/                # Shared components
│   ├── LoadingSpinner.vue
│   ├── ErrorBoundary.vue
│   └── ConfirmDialog.vue
└── icons/                 # Custom icon components
    ├── IconArrow.vue
    └── IconUser.vue
```

#### `app/composables/` Structure
```
composables/
├── auth/                  # Authentication composables
│   ├── useAuth.ts
│   ├── usePermissions.ts
│   └── useSession.ts
├── api/                   # API interaction composables
│   ├── useApi.ts
│   ├── useUsers.ts
│   └── useContent.ts
├── ui/                    # UI state composables
│   ├── useModal.ts
│   ├── useToast.ts
│   └── useTheme.ts
├── utils/                 # Utility composables
│   ├── useLocalStorage.ts
│   ├── useDebounce.ts
│   └── useValidation.ts
└── core/                  # Core application composables
    ├── useAppState.ts
    └── useErrorHandler.ts
```

#### `app/pages/` Structure
```
pages/
├── index.vue              # Home page (/)
├── about.vue              # About page (/about)
├── auth/                  # Authentication pages
│   ├── login.vue          # /auth/login
│   ├── register.vue       # /auth/register
│   └── forgot-password.vue # /auth/forgot-password
├── dashboard/             # Dashboard section
│   ├── index.vue          # /dashboard
│   ├── analytics.vue      # /dashboard/analytics
│   └── settings.vue       # /dashboard/settings
├── users/                 # User management
│   ├── index.vue          # /users
│   ├── [id].vue          # /users/:id
│   └── create.vue         # /users/create
└── [...slug].vue          # Catch-all for content (@nuxt/content)
```

#### `server/api/` Structure
```
server/
├── api/
│   ├── auth/              # Authentication endpoints
│   │   ├── login.post.ts
│   │   ├── logout.post.ts
│   │   └── refresh.post.ts
│   ├── users/             # User management endpoints
│   │   ├── index.get.ts   # GET /api/users
│   │   ├── index.post.ts  # POST /api/users
│   │   └── [id]/
│   │       ├── index.get.ts    # GET /api/users/:id
│   │       ├── index.put.ts    # PUT /api/users/:id
│   │       └── index.delete.ts # DELETE /api/users/:id
│   └── content/           # Content API endpoints
│       ├── search.get.ts
│       └── featured.get.ts
├── middleware/            # Server middleware
│   ├── auth.ts
│   ├── cors.ts
│   └── rate-limit.ts
└── utils/                 # Server utilities
    ├── auth.ts
    ├── validation.ts
    └── database.ts
```

## File Naming Conventions

### Vue Components
- **PascalCase** for component files: `UserProfile.vue`, `NavigationMenu.vue`
- **PascalCase** for component names in templates: `<UserProfile />`, `<NavigationMenu />`
- **kebab-case** for component folders: `user-profile/`, `navigation-menu/`

### Composables
- **camelCase** with `use` prefix: `useAuth.ts`, `useUserProfile.ts`
- Export function with same name: `export const useAuth = () => { ... }`

### Pages
- **kebab-case** for page files: `user-profile.vue`, `forgot-password.vue`
- **camelCase** for dynamic routes: `[userId].vue`, `[...slug].vue`

### API Routes
- **kebab-case** for route files: `user-profile.get.ts`, `reset-password.post.ts`
- HTTP method as file extension: `.get.ts`, `.post.ts`, `.put.ts`, `.delete.ts`

### Utilities
- **camelCase** for utility files: `formatDate.ts`, `validateEmail.ts`
- **PascalCase** for classes: `ApiClient.ts`, `EventBus.ts`

### Assets
- **kebab-case** for all assets: `hero-image.jpg`, `app-logo.svg`
- Descriptive names with context: `button-primary-bg.png`, `icon-user-24.svg`

## Code Organization Guidelines

### Component Structure Pattern
```vue
<template>
  <!-- Template content -->
</template>

<script setup lang="ts">
// 1. Imports (external libraries first, then internal)
import { ref, computed, onMounted } from 'vue'
import type { User } from '~/types/user'

// 2. Props definition
interface Props {
  user: User
  isEditable?: boolean
}
const props = withDefaults(defineProps<Props>(), {
  isEditable: false
})

// 3. Emits definition
interface Emits {
  update: [user: User]
  delete: [id: string]
}
const emit = defineEmits<Emits>()

// 4. Composables
const { $api } = useNuxtApp()
const { user: currentUser } = useAuth()

// 5. Reactive state
const isLoading = ref(false)
const formData = ref({ ...props.user })

// 6. Computed properties
const canEdit = computed(() => 
  props.isEditable && currentUser.value?.id === props.user.id
)

// 7. Methods
const handleSave = async () => {
  isLoading.value = true
  try {
    const updatedUser = await $api.users.update(formData.value)
    emit('update', updatedUser)
  } catch (error) {
    // Handle error
  } finally {
    isLoading.value = false
  }
}

// 8. Lifecycle hooks
onMounted(() => {
  // Component initialization
})

// 9. Watchers (if needed)
watch(() => props.user, (newUser) => {
  formData.value = { ...newUser }
}, { deep: true })
</script>

<style scoped>
/* Component-specific styles */
</style>
```

### Composables Organization Pattern
```typescript
// composables/auth/useAuth.ts
export const useAuth = () => {
  // 1. State management
  const user = ref<User | null>(null)
  const isAuthenticated = computed(() => !!user.value)
  
  // 2. Core methods
  const login = async (credentials: LoginCredentials) => {
    // Implementation
  }
  
  const logout = async () => {
    // Implementation
  }
  
  // 3. Utility methods
  const hasPermission = (permission: string) => {
    return user.value?.permissions.includes(permission) ?? false
  }
  
  // 4. Initialization
  const initialize = async () => {
    // Auto-login logic
  }
  
  // 5. Return public API
  return {
    // State
    user: readonly(user),
    isAuthenticated,
    
    // Methods
    login,
    logout,
    hasPermission,
    initialize
  }
}
```

### Server API Route Pattern
```typescript
// server/api/users/[id].get.ts
export default defineEventHandler(async (event) => {
  // 1. Parameter extraction
  const userId = getRouterParam(event, 'id')
  
  // 2. Authentication check
  const user = await requireAuth(event)
  
  // 3. Authorization check
  if (!hasPermission(user, 'users:read')) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Insufficient permissions'
    })
  }
  
  // 4. Validation
  if (!userId || !isValidUUID(userId)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid user ID'
    })
  }
  
  // 5. Business logic
  try {
    const targetUser = await getUserById(userId)
    
    if (!targetUser) {
      throw createError({
        statusCode: 404,
        statusMessage: 'User not found'
      })
    }
    
    // 6. Response formatting
    return {
      success: true,
      data: sanitizeUser(targetUser)
    }
  } catch (error) {
    // 7. Error handling
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
```

## Configuration Standards

### `nuxt.config.ts` Organization
```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  // 1. Compatibility and future flags
  compatibilityDate: '2025-07-15',
  future: {
    compatibilityVersion: 4
  },
  
  // 2. Development tools
  devtools: { enabled: true },
  
  // 3. Core modules (order matters)
  modules: [
    '@nuxt/content',
    '@nuxt/image',
    '@nuxt/ui'
  ],
  
  // 4. Module configurations
  content: {
    highlight: {
      theme: 'github-dark'
    },
    markdown: {
      toc: { depth: 3 }
    }
  },
  
  image: {
    quality: 80,
    format: ['webp', 'avif'],
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536
    }
  },
  
  ui: {
    icons: ['heroicons', 'lucide']
  },
  
  // 5. TypeScript configuration
  typescript: {
    strict: true,
    typeCheck: true
  },
  
  // 6. CSS configuration
  css: ['~/assets/css/main.css'],
  
  // 7. Runtime configuration
  runtimeConfig: {
    // Private keys (server-side only)
    apiSecret: process.env.API_SECRET,
    databaseUrl: process.env.DATABASE_URL,
    
    // Public keys (exposed to client)
    public: {
      apiBase: process.env.API_BASE_URL || '/api',
      appName: process.env.APP_NAME || 'Nuxt App'
    }
  },
  
  // 8. Build configuration
  nitro: {
    experimental: {
      wasm: true
    }
  },
  
  // 9. App configuration
  app: {
    head: {
      title: 'Enterprise Nuxt App',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ]
    }
  }
})
```

### Environment Variables Management
```bash
# .env.example
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/dbname

# API Configuration
API_SECRET=your-secret-key
API_BASE_URL=https://api.example.com

# Application
APP_NAME=Enterprise Nuxt App
APP_ENV=development

# External Services
STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...

# Content
CONTENT_API_KEY=your-content-api-key
```

### TypeScript Configuration Best Practices
```json
// types/index.ts - Global type definitions
export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  permissions: Permission[]
  createdAt: Date
  updatedAt: Date
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
```

## Development Workflow

### Import/Export Conventions

#### Auto-imports (Nuxt 4 Built-in)
```typescript
// ✅ Auto-imported (no explicit import needed)
const route = useRoute()
const router = useRouter()
const { data } = await $fetch('/api/users')

// ✅ Auto-imported composables
const { user } = useAuth()
const { toast } = useToast()
```

#### Explicit Imports
```typescript
// ✅ External libraries
import { z } from 'zod'
import { format } from 'date-fns'

// ✅ Type imports
import type { User, ApiResponse } from '~/types'

// ✅ Component imports (when not auto-imported)
import BaseModal from '~/components/ui/Modal/BaseModal.vue'
```

#### Export Patterns
```typescript
// ✅ Named exports for utilities
export const formatCurrency = (amount: number) => { ... }
export const validateEmail = (email: string) => { ... }

// ✅ Default exports for components and composables
export default defineComponent({ ... })
export default defineEventHandler({ ... })

// ✅ Type-only exports
export type { User, ApiResponse } from './types'
```

### Component Auto-import Configuration
```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
    {
      path: '~/components/ui',
      prefix: 'Ui'
    }
  ]
})
```

## Module Integration Standards

### @nuxt/content Integration
```typescript
// composables/content/useContent.ts
export const useContent = () => {
  const searchContent = async (query: string) => {
    return await queryContent()
      .where({ $or: [
        { title: { $icontains: query } },
        { description: { $icontains: query } }
      ]})
      .find()
  }
  
  const getFeaturedPosts = async () => {
    return await queryContent('blog')
      .where({ featured: true })
      .sort({ date: -1 })
      .limit(3)
      .find()
  }
  
  return {
    searchContent,
    getFeaturedPosts
  }
}
```

### @nuxt/image Integration
```vue
<!-- components/ui/OptimizedImage.vue -->
<template>
  <NuxtImg
    :src="src"
    :alt="alt"
    :width="width"
    :height="height"
    :sizes="sizes"
    :placeholder="placeholder"
    :loading="loading"
    :format="format"
    :quality="quality"
    class="optimized-image"
  />
</template>

<script setup lang="ts">
interface Props {
  src: string
  alt: string
  width?: number
  height?: number
  sizes?: string
  placeholder?: boolean
  loading?: 'lazy' | 'eager'
  format?: string
  quality?: number
}

withDefaults(defineProps<Props>(), {
  placeholder: true,
  loading: 'lazy',
  quality: 80
})
</script>
```

### @nuxt/ui Integration
```typescript
// composables/ui/useNotifications.ts
export const useNotifications = () => {
  const toast = useToast()
  
  const showSuccess = (message: string) => {
    toast.add({
      title: 'Success',
      description: message,
      color: 'green',
      icon: 'i-heroicons-check-circle'
    })
  }
  
  const showError = (message: string) => {
    toast.add({
      title: 'Error',
      description: message,
      color: 'red',
      icon: 'i-heroicons-exclamation-circle'
    })
  }
  
  return {
    showSuccess,
    showError
  }
}
```

## Code Quality Standards

### ESLint Configuration
```javascript
// .eslintrc.js
module.exports = {
  extends: [
    '@nuxt/eslint-config'
  ],
  rules: {
    'vue/multi-word-component-names': 'error',
    'vue/component-name-in-template-casing': ['error', 'PascalCase'],
    '@typescript-eslint/no-unused-vars': 'error',
    'prefer-const': 'error'
  }
}
```

### Testing Standards
```typescript
// tests/components/UserProfile.test.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import UserProfile from '~/components/feature/auth/UserProfile.vue'

describe('UserProfile', () => {
  it('renders user information correctly', () => {
    const user = {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com'
    }
    
    const wrapper = mount(UserProfile, {
      props: { user }
    })
    
    expect(wrapper.text()).toContain('John Doe')
    expect(wrapper.text()).toContain('john@example.com')
  })
})
```

## Documentation Standards

### Component Documentation
```vue
<!-- components/ui/Button/Button.vue -->
<!--
@component Button
@description A reusable button component with multiple variants and sizes
@example
<Button variant="primary" size="lg" @click="handleClick">
  Click me
</Button>
-->
<template>
  <!-- Component template -->
</template>
```

### API Documentation
```typescript
/**
 * Retrieves user information by ID
 * @param userId - The unique identifier for the user
 * @returns Promise resolving to user data
 * @throws {Error} When user is not found
 */
export const getUserById = async (userId: string): Promise<User> => {
  // Implementation
}
```

This comprehensive standards document provides enterprise-grade guidelines for your Nuxt 4 project, ensuring consistency, maintainability, and scalability across your development team.