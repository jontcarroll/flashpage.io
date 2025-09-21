# Multi-Theme System Implementation Guide

## Overview

This document outlines the implementation of a flexible multi-theme system for Nuxt 4 applications using Nuxt UI v4 and Tailwind CSS v4. The system allows users to select different design patterns (Brutalist, Material, Minimal, Wireframe, etc.) and color palettes when creating pages.

## Table of Contents

1. [Architecture](#architecture)
2. [Theme Structure](#theme-structure)
3. [Implementation](#implementation)
4. [Usage](#usage)
5. [Adding New Themes](#adding-new-themes)
6. [Best Practices](#best-practices)

## Architecture

### Core Concepts

The multi-theme system leverages three key technologies:

1. **Nuxt UI's Variant System**: Define theme-specific component variants in `app.config.ts`
2. **Tailwind CSS Variables**: Use CSS custom properties for dynamic theming
3. **Nuxt's State Management**: Use `useState` for reactive theme switching

### File Structure

```
app/
├── composables/
│   └── useTheme.ts         # Theme management composable
├── assets/css/
│   ├── main.css            # Base styles and imports
│   └── themes/
│       ├── brutalist.css   # Brutalist theme styles
│       ├── material.css    # Material theme styles
│       ├── minimal.css     # Minimal theme styles
│       └── wireframe.css   # Wireframe theme styles
├── components/
│   └── theme/
│       ├── ThemePicker.vue # Theme selection component
│       └── ColorPicker.vue # Color palette selector
├── types/
│   └── theme.ts            # Theme type definitions
└── app.config.ts           # Component variant configurations
```

## Theme Structure

### Theme Definition

Each theme consists of:
- **Design Patterns**: Visual style and component behavior
- **Color Palettes**: Multiple color schemes per theme
- **Typography**: Font families and sizing
- **Spacing**: Padding, margins, and gaps
- **Effects**: Shadows, borders, animations

### Available Themes

#### 1. Brutalist Theme
```css
/* Characteristics */
- Bold, uppercase typography
- Thick black borders
- Hard shadows (no blur)
- High contrast colors
- No rounded corners
- Instant transitions
```

#### 2. Material Theme
```css
/* Characteristics */
- Clean, modern typography
- Subtle shadows (elevation)
- Smooth transitions
- Rounded corners
- Card-based layouts
- Ripple effects
```

#### 3. Minimal Theme
```css
/* Characteristics */
- Light typography
- Thin borders
- No shadows
- Muted colors
- Small rounded corners
- Subtle animations
```

#### 4. Wireframe Theme
```css
/* Characteristics */
- Monospace typography
- Dashed borders
- No shadows or colors
- Black and white only
- No rounded corners
- No animations
```

## Implementation

### 1. Theme Composable

Create `app/composables/useTheme.ts`:

```typescript
export interface Theme {
  name: string
  variant: 'brutalist' | 'material' | 'minimal' | 'wireframe'
  colorScheme: string
  colors: {
    primary: string
    secondary: string
    accent?: string
    neutral: string
  }
}

export const useTheme = () => {
  // Global theme state
  const currentTheme = useState<Theme>('theme', () => ({
    name: 'Brutalist',
    variant: 'brutalist',
    colorScheme: 'default',
    colors: {
      primary: 'yellow',
      secondary: 'pink',
      accent: 'blue',
      neutral: 'slate'
    }
  }))

  // Page-specific theme state
  const pageTheme = useState<Theme | null>('pageTheme', () => null)

  // Get active theme (page overrides global)
  const activeTheme = computed(() => pageTheme.value || currentTheme.value)

  // Set global theme
  const setGlobalTheme = (theme: Theme) => {
    currentTheme.value = theme
    applyTheme(theme)
  }

  // Set page-specific theme
  const setPageTheme = (theme: Theme | null) => {
    pageTheme.value = theme
    if (theme) applyTheme(theme)
  }

  // Apply theme to DOM and app config
  const applyTheme = (theme: Theme) => {
    const appConfig = useAppConfig()

    // Update HTML class
    document.documentElement.className = `theme-${theme.variant}`

    // Update Nuxt UI colors
    appConfig.ui.colors = theme.colors

    // Update component default variants
    Object.keys(appConfig.ui).forEach(component => {
      if (appConfig.ui[component]?.defaultVariants) {
        appConfig.ui[component].defaultVariants.theme = theme.variant
      }
    })
  }

  return {
    currentTheme: readonly(currentTheme),
    pageTheme: readonly(pageTheme),
    activeTheme: readonly(activeTheme),
    setGlobalTheme,
    setPageTheme
  }
}
```

### 2. App Config with Variants

Update `app.config.ts`:

```typescript
export default defineAppConfig({
  ui: {
    // Define theme variants for Button component
    button: {
      variants: {
        theme: {
          brutalist: {
            base: 'font-black uppercase tracking-wider border-4 !rounded-none transition-none',
            root: 'hover:translate-x-[-4px] hover:translate-y-[-4px] active:translate-x-1 active:translate-y-1'
          },
          material: {
            base: 'font-medium rounded-lg transition-all duration-200',
            root: 'hover:shadow-lg active:shadow-sm'
          },
          minimal: {
            base: 'font-light rounded-sm border transition-colors duration-150',
            root: 'hover:bg-opacity-10'
          },
          wireframe: {
            base: 'font-mono border-2 border-dashed rounded-none bg-transparent',
            root: 'hover:bg-transparent hover:border-solid'
          }
        }
      },
      compoundVariants: [
        // Brutalist + color combinations
        {
          theme: 'brutalist',
          color: 'primary',
          class: 'bg-brutal-yellow text-brutal-black border-brutal-black shadow-[8px_8px_0px_#000]'
        },
        {
          theme: 'brutalist',
          color: 'secondary',
          class: 'bg-brutal-pink text-brutal-white border-brutal-black shadow-[8px_8px_0px_#000]'
        },
        // Material + color combinations
        {
          theme: 'material',
          color: 'primary',
          class: 'bg-material-primary text-white shadow-md hover:bg-material-primary-dark'
        },
        {
          theme: 'material',
          color: 'secondary',
          class: 'bg-material-secondary text-white shadow-md hover:bg-material-secondary-dark'
        },
        // Minimal + color combinations
        {
          theme: 'minimal',
          color: 'primary',
          class: 'border-current text-primary hover:bg-primary hover:bg-opacity-10'
        },
        // Wireframe + color combinations
        {
          theme: 'wireframe',
          color: 'primary',
          class: 'border-black text-black'
        }
      ]
    },

    // Define theme variants for Card component
    card: {
      variants: {
        theme: {
          brutalist: {
            root: 'border-4 border-brutal-black shadow-[8px_8px_0px_#000] !rounded-none',
            header: 'border-b-4 border-brutal-black font-black uppercase text-xl p-6',
            body: 'p-6',
            footer: 'border-t-4 border-brutal-black p-6'
          },
          material: {
            root: 'rounded-xl shadow-md bg-surface',
            header: 'px-6 py-4 border-b border-divider',
            body: 'p-6',
            footer: 'px-6 py-4 border-t border-divider'
          },
          minimal: {
            root: 'border rounded-sm',
            header: 'px-4 py-3 border-b',
            body: 'p-4',
            footer: 'px-4 py-3 border-t'
          },
          wireframe: {
            root: 'border-2 border-dashed border-black rounded-none',
            header: 'p-4 border-b-2 border-dashed border-black',
            body: 'p-4',
            footer: 'p-4 border-t-2 border-dashed border-black'
          }
        }
      }
    },

    // Input variants
    input: {
      variants: {
        theme: {
          brutalist: {
            root: 'border-4 border-brutal-black !rounded-none font-bold',
            input: 'placeholder:uppercase focus:shadow-[8px_8px_0px_#0066FF]'
          },
          material: {
            root: 'rounded-md border-b-2 transition-all duration-200',
            input: 'focus:border-primary focus:shadow-sm'
          },
          minimal: {
            root: 'border-b rounded-none',
            input: 'focus:border-primary'
          },
          wireframe: {
            root: 'border-2 border-dashed border-black rounded-none',
            input: 'font-mono focus:border-solid'
          }
        }
      }
    }
  }
})
```

### 3. CSS Theme Files

Create theme-specific CSS files:

#### `app/assets/css/themes/brutalist.css`

```css
.theme-brutalist {
  /* CSS Variables */
  --theme-primary: #FFFF00;
  --theme-secondary: #FF0066;
  --theme-accent: #0066FF;
  --theme-black: #000000;
  --theme-white: #FFFFFF;

  /* Typography */
  --theme-font-heading: 'Space Grotesk', sans-serif;
  --theme-font-body: 'Space Grotesk', sans-serif;
  --theme-font-weight: 700;

  /* Spacing */
  --theme-spacing-unit: 8px;

  /* Borders */
  --theme-border-width: 4px;
  --theme-border-style: solid;
  --theme-border-color: var(--theme-black);

  /* Shadows */
  --theme-shadow-sm: 4px 4px 0px var(--theme-black);
  --theme-shadow: 8px 8px 0px var(--theme-black);
  --theme-shadow-lg: 12px 12px 0px var(--theme-black);

  /* Transitions */
  --theme-transition-duration: 0.1s;
  --theme-transition-timing: linear;
}

/* Brutalist-specific utility classes */
.theme-brutalist .brutal-border {
  border: var(--theme-border-width) var(--theme-border-style) var(--theme-border-color);
}

.theme-brutalist .brutal-shadow {
  box-shadow: var(--theme-shadow);
}

.theme-brutalist .brutal-hover:hover {
  transform: translate(-4px, -4px);
  box-shadow: var(--theme-shadow-lg);
}

.theme-brutalist .brutal-active:active {
  transform: translate(4px, 4px);
  box-shadow: var(--theme-shadow-sm);
}
```

#### `app/assets/css/themes/material.css`

```css
.theme-material {
  /* CSS Variables */
  --theme-primary: #2196F3;
  --theme-primary-dark: #1976D2;
  --theme-secondary: #FF4081;
  --theme-secondary-dark: #F50057;
  --theme-surface: #FFFFFF;
  --theme-background: #FAFAFA;

  /* Typography */
  --theme-font-heading: 'Roboto', sans-serif;
  --theme-font-body: 'Roboto', sans-serif;
  --theme-font-weight: 400;

  /* Spacing */
  --theme-spacing-unit: 8px;

  /* Borders */
  --theme-border-radius: 4px;
  --theme-border-radius-lg: 8px;

  /* Elevations (Material Design shadows) */
  --theme-elevation-1: 0 2px 1px -1px rgba(0,0,0,.2), 0 1px 1px 0 rgba(0,0,0,.14), 0 1px 3px 0 rgba(0,0,0,.12);
  --theme-elevation-2: 0 3px 1px -2px rgba(0,0,0,.2), 0 2px 2px 0 rgba(0,0,0,.14), 0 1px 5px 0 rgba(0,0,0,.12);
  --theme-elevation-3: 0 3px 3px -2px rgba(0,0,0,.2), 0 3px 4px 0 rgba(0,0,0,.14), 0 1px 8px 0 rgba(0,0,0,.12);

  /* Transitions */
  --theme-transition-duration: 0.3s;
  --theme-transition-timing: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Material-specific utility classes */
.theme-material .elevation-1 {
  box-shadow: var(--theme-elevation-1);
}

.theme-material .elevation-2 {
  box-shadow: var(--theme-elevation-2);
}

.theme-material .elevation-3 {
  box-shadow: var(--theme-elevation-3);
}
```

### 4. Theme Picker Component

Create `app/components/theme/ThemePicker.vue`:

```vue
<template>
  <div class="space-y-4">
    <div>
      <label class="block text-sm font-medium mb-2">Theme</label>
      <USelectMenu
        v-model="selectedTheme"
        :options="themes"
        option-attribute="name"
        value-attribute="variant"
        @change="onThemeChange"
      />
    </div>

    <div>
      <label class="block text-sm font-medium mb-2">Color Scheme</label>
      <div class="grid grid-cols-4 gap-2">
        <button
          v-for="scheme in colorSchemes[selectedTheme]"
          :key="scheme.name"
          @click="selectColorScheme(scheme)"
          :class="[
            'p-2 border-2 rounded',
            currentColorScheme === scheme.name ? 'border-primary' : 'border-transparent'
          ]"
        >
          <div class="flex space-x-1">
            <div
              v-for="color in scheme.colors"
              :key="color"
              :style="{ backgroundColor: color }"
              class="w-4 h-4 rounded"
            />
          </div>
          <span class="text-xs mt-1">{{ scheme.name }}</span>
        </button>
      </div>
    </div>

    <div>
      <label class="block text-sm font-medium mb-2">Preview</label>
      <div :class="`theme-${selectedTheme}`">
        <UCard :ui="{ theme: selectedTheme }">
          <template #header>
            <h3 class="text-lg font-semibold">Preview Card</h3>
          </template>

          <p>This is how your content will look with the selected theme.</p>

          <div class="flex gap-2 mt-4">
            <UButton :theme="selectedTheme" color="primary">Primary</UButton>
            <UButton :theme="selectedTheme" color="secondary">Secondary</UButton>
          </div>
        </UCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { setPageTheme } = useTheme()

const themes = [
  { name: 'Brutalist', variant: 'brutalist' },
  { name: 'Material', variant: 'material' },
  { name: 'Minimal', variant: 'minimal' },
  { name: 'Wireframe', variant: 'wireframe' }
]

const colorSchemes = {
  brutalist: [
    {
      name: 'Classic',
      colors: ['#FFFF00', '#FF0066', '#0066FF', '#000000']
    },
    {
      name: 'Neon',
      colors: ['#00FF00', '#FF00FF', '#00FFFF', '#000000']
    }
  ],
  material: [
    {
      name: 'Blue',
      colors: ['#2196F3', '#FF4081', '#FFC107', '#FFFFFF']
    },
    {
      name: 'Green',
      colors: ['#4CAF50', '#E91E63', '#FF9800', '#FFFFFF']
    }
  ],
  minimal: [
    {
      name: 'Monochrome',
      colors: ['#000000', '#666666', '#CCCCCC', '#FFFFFF']
    },
    {
      name: 'Soft',
      colors: ['#E0E0E0', '#F5F5F5', '#FAFAFA', '#FFFFFF']
    }
  ],
  wireframe: [
    {
      name: 'Default',
      colors: ['#000000', '#FFFFFF', '#000000', '#FFFFFF']
    }
  ]
}

const selectedTheme = ref('brutalist')
const currentColorScheme = ref('Classic')

const onThemeChange = (variant: string) => {
  const theme = themes.find(t => t.variant === variant)
  if (theme) {
    setPageTheme({
      name: theme.name,
      variant: theme.variant,
      colorScheme: colorSchemes[variant][0].name,
      colors: {
        primary: 'primary',
        secondary: 'secondary',
        neutral: 'neutral'
      }
    })
  }
}

const selectColorScheme = (scheme: any) => {
  currentColorScheme.value = scheme.name
  // Apply color scheme to current theme
}
</script>
```

### 5. Main CSS Import

Update `app/assets/css/main.css`:

```css
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;700&family=JetBrains+Mono:wght@400;700&family=Roboto:wght@300;400;500;700&display=swap');
@import "tailwindcss";
@import "@nuxt/ui";

/* Import theme files */
@import "./themes/brutalist.css";
@import "./themes/material.css";
@import "./themes/minimal.css";
@import "./themes/wireframe.css";

@theme {
  /* Default theme tokens */
  --font-sans: 'Space Grotesk', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  /* These will be overridden by theme-specific CSS */
  --ui-radius: 0.25rem;
}

/* Base styles */
@layer base {
  body {
    @apply font-sans;
    font-weight: var(--theme-font-weight, 400);
    transition: all var(--theme-transition-duration, 0.3s) var(--theme-transition-timing, ease);
  }
}
```

## Usage

### Setting a Global Theme

```typescript
// In a component or page
const { setGlobalTheme } = useTheme()

setGlobalTheme({
  name: 'Material',
  variant: 'material',
  colorScheme: 'blue',
  colors: {
    primary: 'blue',
    secondary: 'pink',
    neutral: 'gray'
  }
})
```

### Setting a Page-Specific Theme

```vue
<!-- In a page component -->
<script setup>
const { setPageTheme } = useTheme()

// Set theme for this page only
onMounted(() => {
  setPageTheme({
    name: 'Brutalist',
    variant: 'brutalist',
    colorScheme: 'neon',
    colors: {
      primary: 'green',
      secondary: 'pink',
      neutral: 'slate'
    }
  })
})

// Clear page theme on unmount
onUnmounted(() => {
  setPageTheme(null)
})
</script>
```

### Using Theme-Aware Components

```vue
<template>
  <!-- Components automatically use the active theme variant -->
  <UButton color="primary">
    This button adapts to the current theme
  </UButton>

  <!-- Or explicitly specify a theme -->
  <UCard :ui="{ theme: 'material' }">
    This card always uses Material design
  </UCard>
</template>
```

### Persisting Theme Preferences

```typescript
// Save to database when creating/updating a page
const savePageSettings = async (pageId: string, theme: Theme) => {
  await $fetch(`/api/pages/${pageId}`, {
    method: 'PATCH',
    body: {
      theme: theme.variant,
      colorScheme: theme.colorScheme
    }
  })
}

// Load on page mount
const loadPageSettings = async (pageId: string) => {
  const settings = await $fetch(`/api/pages/${pageId}/settings`)
  if (settings.theme) {
    setPageTheme({
      name: settings.theme,
      variant: settings.theme,
      colorScheme: settings.colorScheme,
      colors: getColorsForScheme(settings.theme, settings.colorScheme)
    })
  }
}
```

## Adding New Themes

### Step 1: Define Theme Variant

Add to `app/types/theme.ts`:

```typescript
export type ThemeVariant = 'brutalist' | 'material' | 'minimal' | 'wireframe' | 'glassmorphism' // Add new theme
```

### Step 2: Create Theme CSS

Create `app/assets/css/themes/glassmorphism.css`:

```css
.theme-glassmorphism {
  --theme-blur: blur(10px);
  --theme-bg-opacity: 0.7;
  --theme-border-opacity: 0.2;
  /* ... more theme tokens */
}
```

### Step 3: Add Component Variants

Update `app.config.ts`:

```typescript
button: {
  variants: {
    theme: {
      // ... existing themes
      glassmorphism: {
        base: 'backdrop-blur-md bg-opacity-30 border border-opacity-20',
        root: 'hover:bg-opacity-40'
      }
    }
  }
}
```

### Step 4: Add Color Schemes

Update the theme picker component with new color schemes for the theme.

## Best Practices

### 1. Performance

- **Lazy load theme CSS**: Only load CSS for themes that are actually used
- **Use CSS variables**: Allows for runtime theme switching without recompilation
- **Minimize compound variants**: Only define necessary combinations

### 2. Consistency

- **Use semantic colors**: Stick to primary, secondary, accent, etc.
- **Define all slots**: Ensure every component slot has theme variants
- **Test all combinations**: Verify theme + color combinations work correctly

### 3. Accessibility

- **Maintain contrast ratios**: Ensure text is readable in all themes
- **Preserve focus indicators**: Don't remove focus styles in minimal themes
- **Support reduced motion**: Respect user preferences for animations

### 4. Maintenance

- **Document theme tokens**: Keep a reference of all CSS variables
- **Use TypeScript**: Ensure type safety for theme configurations
- **Version control themes**: Track theme changes in git

## Database Schema

Add theme fields to your page/project models:

```typescript
// MongoDB/Mongoose schema
const PageSchema = new Schema({
  title: String,
  content: Object,
  theme: {
    type: String,
    enum: ['brutalist', 'material', 'minimal', 'wireframe'],
    default: 'brutalist'
  },
  colorScheme: {
    type: String,
    default: 'default'
  },
  customColors: {
    primary: String,
    secondary: String,
    accent: String,
    neutral: String
  }
})
```

## Troubleshooting

### Common Issues

1. **Theme not applying**: Check that HTML class is set correctly
2. **Colors not updating**: Verify app.config.ts is reactive
3. **Variants not working**: Ensure component has theme variant defined
4. **CSS not loading**: Import theme CSS files in main.css
5. **TypeScript errors**: Update theme types when adding new themes

### Debug Mode

```typescript
// Enable theme debugging
const { activeTheme } = useTheme()

watch(activeTheme, (newTheme) => {
  console.log('Theme changed:', newTheme)
  console.log('HTML classes:', document.documentElement.className)
  console.log('App config:', useAppConfig().ui)
})
```

## Conclusion

This multi-theme system provides a flexible, maintainable way to support multiple design patterns in your Nuxt application. By leveraging Nuxt UI's variant system and Tailwind's CSS variables, you can offer users a wide range of visual experiences while maintaining a single codebase.

The system is:
- **Extensible**: Easy to add new themes
- **Performant**: Uses CSS variables for runtime switching
- **Type-safe**: Full TypeScript support
- **User-friendly**: Simple theme picker interface
- **Persistent**: Saves preferences per page

For questions or improvements, please refer to the Nuxt UI and Tailwind CSS documentation for the latest best practices.