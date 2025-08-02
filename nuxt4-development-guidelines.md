---
description: Comprehensive development guidelines and best practices for Nuxt 4, incorporating new features, breaking changes, and migration considerations from Nuxt 3. This guide covers the new app directory structure, improved TypeScript support, enhanced data fetching, and performance optimizations.
globs: *.vue,*.js,*.ts,*.mjs,*.mts,*.jsx,*.tsx,*.config.js,*.config.ts
---

# Nuxt 4 Development Guidelines

## Overview of Nuxt 4 Changes

Nuxt 4 is a stability-focused major release that introduces thoughtful breaking changes to improve the development experience. Key improvements include:

- **New `app/` directory structure** for better project organization
- **Enhanced TypeScript support** with separate project contexts
- **Improved data fetching** with automatic sharing and cleanup
- **Faster development experience** with internal sockets and optimized CLI
- **Better performance** with native file watching and compile caching

## 1. Project Structure and Organization

### New Directory Structure (Nuxt 4)
```
my-nuxt-app/
├─ app/                    # Application code (NEW in Nuxt 4)
│  ├─ assets/
│  ├─ components/
│  ├─ composables/
│  ├─ layouts/
│  ├─ middleware/
│  ├─ pages/
│  ├─ plugins/
│  ├─ utils/
│  ├─ app.vue
│  ├─ app.config.ts
│  └─ error.vue
├─ content/                # Content files (if using @nuxt/content)
├─ public/                 # Static assets
├─ shared/                 # Shared utilities between client/server (NEW)
├─ server/                 # Server-side code
└─ nuxt.config.ts         # Configuration
```

### Migration Considerations
- **Backward compatibility**: Existing Nuxt 3 projects continue to work without migration
- **Optional migration**: The new structure is optional; Nuxt detects and supports both structures
- **Benefits**: Faster file watchers, better IDE context, cleaner separation of concerns

### File Naming Conventions (Updated for Nuxt 4)
- **Components**: `PascalCase.vue` (e.g., `app/components/MyComponent.vue`)
- **Composables**: `usePascalCase.ts` (e.g., `app/composables/useCounter.ts`)
- **Layouts**: `kebab-case.vue` (e.g., `app/layouts/default.vue`)
- **Pages**: `kebab-case.vue` (e.g., `app/pages/index.vue`)
- **Plugins**: `kebab-case.ts` (e.g., `app/plugins/analytics.ts`)
- **Utilities**: `camelCase.ts` (e.g., `app/utils/formatDate.ts`)
- **Shared utilities**: `camelCase.ts` (e.g., `shared/validation.ts`)

## 2. TypeScript Improvements

### Separate TypeScript Projects
Nuxt 4 creates separate TypeScript projects for different contexts:
- **App code**: `app/` directory with client-side types
- **Server code**: `server/` directory with server-side types  
- **Shared code**: `shared/` directory with universal types
- **Configuration**: Root-level configuration types

### Single tsconfig.json
- **Simplified setup**: Only one `tsconfig.json` file needed in project root
- **Better autocompletion**: More accurate type inference in different contexts
- **Reduced confusion**: Fewer TypeScript errors when working across contexts

### TypeScript Best Practices for Nuxt 4
```typescript
// app/composables/useApi.ts - Client-side composable
export const useApi = () => {
  // Client-side logic with proper typing
  const { $fetch } = useNuxtApp()
  return { fetch: $fetch }
}

// server/api/users.ts - Server-side API
export default defineEventHandler(async (event) => {
  // Server-side logic with proper typing
  return { users: [] }
})

// shared/types.ts - Shared types
export interface User {
  id: string
  name: string
}
```

## 3. Enhanced Data Fetching

### Improved useAsyncData and useFetch
```typescript
// Automatic data sharing between components with same key
const { data: users } = await useFetch('/api/users', {
  key: 'users' // Multiple components using this key share data
})

// Automatic cleanup when components unmount
const { data, refresh } = await useAsyncData('profile', () => $fetch('/api/profile'), {
  // Enhanced options for better control
  server: true,
  client: true,
  default: () => null
})

// Reactive keys for automatic refetching
const userId = ref('123')
const { data: user } = await useFetch(`/api/users/${userId.value}`, {
  key: 'user',
  watch: [userId] // Refetch when userId changes
})
```

### Breaking Changes in Data Fetching
- **Default behavior**: `useAsyncData` won't rerun with existing data by default
- **Improved caching**: Better control over when cached data is used
- **Automatic cleanup**: Data is automatically cleaned up when components unmount

## 4. Performance Optimizations

### CLI and Development Improvements
- **Faster cold starts**: Noticeably faster development server startup
- **Node.js compile cache**: Automatic reuse of v8 compile cache
- **Native file watching**: Uses `fs.watch` APIs for fewer system resources
- **Socket-based communication**: Internal sockets instead of network ports

### Lazy Hydration Support
```vue
<!-- New lazy hydration macros -->
<template>
  <LazyMyComponent />
  <!-- Component hydrates only when needed -->
</template>
```

### Bundle Optimization
- **Improved tree shaking**: Better removal of unused code
- **Enhanced code splitting**: More efficient chunk generation
- **Faster builds**: Optimized build process with Vite improvements

## 5. Security and Best Practices

### Enhanced Security Features
- **Route announcer**: Built-in accessibility improvements
- **Better CSRF protection**: Enhanced security for server routes
- **Improved input validation**: Better sanitization and validation patterns

### Security Best Practices (Updated for Nuxt 4)
```typescript
// server/api/secure-endpoint.ts
export default defineEventHandler(async (event) => {
  // Enhanced validation with better typing
  const body = await readBody(event)
  
  // Use shared validation utilities
  const validatedData = await validateInput(body)
  
  return { success: true, data: validatedData }
})
```

## 6. Migration from Nuxt 3 to Nuxt 4

### Upgrade Process
1. **Update Nuxt**: Run `npx nuxt upgrade --dedupe`
2. **Optional migration**: Use `npx codemod@latest nuxt/4/migration-recipe`
3. **Test and adjust**: Run tests and fix any issues

### Breaking Changes to Address
- **Removed Nuxt 2 compatibility**: Update any legacy code
- **Deprecated options cleanup**: Remove old experimental options
- **TypeScript changes**: Address any new type errors
- **Module compatibility**: Ensure modules support Nuxt 4

### Compatibility Options
```typescript
// nuxt.config.ts - Temporary compatibility settings
export default defineNuxtConfig({
  // Revert to old behavior while migrating
  experimental: {
    // Add compatibility flags as needed during migration
  }
})
```

## 7. Module and Plugin Development

### Updated Module Development
```typescript
// modules/my-module.ts
import { defineNuxtModule } from '@nuxt/kit'

export default defineNuxtModule({
  meta: {
    name: 'my-module',
    configKey: 'myModule',
    compatibility: {
      nuxt: '^4.0.0' // Specify Nuxt 4 compatibility
    }
  },
  setup(options, nuxt) {
    // Module logic with Nuxt 4 features
  }
})
```

### Plugin Updates
```typescript
// app/plugins/my-plugin.ts
export default defineNuxtPlugin({
  name: 'my-plugin',
  setup() {
    // Plugin logic with improved typing
  }
})
```

## 8. Testing Strategies for Nuxt 4

### Updated Testing Approaches
- **Component testing**: Test components in isolation with new structure
- **API testing**: Test server routes with improved typing
- **E2E testing**: Test full application flow with faster development server

### Testing Configuration
```typescript
// vitest.config.ts
import { defineVitestConfig } from '@nuxt/test-utils/config'

export default defineVitestConfig({
  // Test configuration for Nuxt 4
})
```

## 9. Common Pitfalls and Migration Issues

### Potential Issues During Migration
- **TypeScript errors**: New TypeScript setup may surface hidden issues
- **Module compatibility**: Some modules may need updates for Nuxt 4
- **Build configuration**: Some build settings may need adjustment
- **Import paths**: Verify import paths work with new structure

### Solutions and Workarounds
```typescript
// Handle import path changes
// Old: import { utils } from '~/utils/helpers'
// New: import { utils } from '~/app/utils/helpers'

// Or use shared utilities
// import { utils } from '~/shared/helpers'
```

## 10. Future-Proofing and Best Practices

### Preparing for Nuxt 5
- **Nitro v3**: Prepare for upcoming Nitro v3 features
- **h3 v2**: Get ready for h3 v2 improvements
- **Vite Environment API**: Prepare for enhanced development experience

### Recommended Practices
- **Adopt new structure**: Migrate to `app/` directory for new projects
- **Use TypeScript**: Leverage improved TypeScript support
- **Optimize data fetching**: Use enhanced `useFetch` and `useAsyncData`
- **Monitor performance**: Take advantage of faster development tools
- **Stay updated**: Keep modules and dependencies current

## 11. Deployment and Production Considerations

### Build Optimizations for Nuxt 4
```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  nitro: {
    // Enhanced production optimizations
    compressPublicAssets: true,
    minify: true
  },

  // Improved build performance
  build: {
    analyze: process.env.ANALYZE === 'true'
  }
})
```

### Production Deployment Best Practices
- **Static generation**: Use `nuxt generate` for static sites with improved performance
- **Server-side rendering**: Deploy with optimized SSR for dynamic content
- **Edge deployment**: Leverage edge functions with better Nitro integration
- **CDN optimization**: Use improved asset optimization features

## 12. Accessibility Improvements

### Built-in Accessibility Features
```vue
<!-- Route announcer automatically included -->
<template>
  <div>
    <!-- Nuxt 4 includes route announcer by default -->
    <NuxtPage />
  </div>
</template>
```

### Accessibility Best Practices
- **Route announcements**: Automatic screen reader support for route changes
- **Semantic HTML**: Use proper HTML5 semantic elements
- **ARIA attributes**: Implement ARIA labels and descriptions
- **Keyboard navigation**: Ensure full keyboard accessibility

## 13. Advanced Configuration

### Nuxt 4 Configuration Options
```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  // New app directory configuration
  srcDir: 'app/', // Default in Nuxt 4

  // Enhanced TypeScript configuration
  typescript: {
    strict: true,
    typeCheck: true
  },

  // Improved development experience
  devtools: {
    enabled: true,
    timeline: {
      enabled: true
    }
  },

  // Enhanced experimental features
  experimental: {
    // Future features can be enabled here
  }
})
```

### Environment-Specific Configuration
```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  // Environment-specific settings
  $development: {
    // Development-only configuration
    devtools: { enabled: true }
  },

  $production: {
    // Production-only configuration
    nitro: {
      minify: true,
      compressPublicAssets: true
    }
  }
})
```

## 14. Monitoring and Debugging

### Enhanced Debugging Tools
- **Chrome DevTools integration**: Better debugging experience
- **Vue DevTools**: Improved component inspection
- **Network monitoring**: Enhanced request/response tracking
- **Performance profiling**: Better performance analysis tools

### Error Handling and Logging
```typescript
// app/plugins/error-handler.ts
export default defineNuxtPlugin({
  name: 'error-handler',
  setup() {
    // Enhanced error handling for Nuxt 4
    const { $router } = useNuxtApp()

    // Global error handler
    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled promise rejection:', event.reason)
      // Send to monitoring service
    })
  }
})
```

## 15. Community and Ecosystem

### Module Ecosystem Updates
- **Module compatibility**: Ensure modules support Nuxt 4
- **Community modules**: Check for Nuxt 4 compatible versions
- **Official modules**: Use updated official Nuxt modules

### Contributing to Nuxt 4
- **Bug reports**: Report issues with new features
- **Feature requests**: Suggest improvements for future releases
- **Documentation**: Help improve Nuxt 4 documentation
- **Module development**: Create Nuxt 4 compatible modules

## Conclusion

Nuxt 4 represents a significant step forward in developer experience while maintaining backward compatibility. The new project structure, enhanced TypeScript support, and improved data fetching make development more efficient and maintainable. While migration is optional, adopting the new features will provide better performance and developer experience for future projects.

### Key Takeaways for Nuxt 4 Development:

1. **Embrace the new `app/` directory structure** for better organization and performance
2. **Leverage enhanced TypeScript support** with separate project contexts
3. **Utilize improved data fetching** with automatic sharing and cleanup
4. **Take advantage of performance optimizations** in CLI and development tools
5. **Follow migration best practices** when upgrading from Nuxt 3
6. **Stay updated** with the evolving ecosystem and prepare for Nuxt 5

The transition to Nuxt 4 should be smooth for most projects, and the benefits in terms of developer experience, performance, and maintainability make it a worthwhile upgrade for both new and existing projects.
