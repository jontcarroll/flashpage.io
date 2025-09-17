# Scripts

## clean-svg-icons.sh

A utility script for cleaning and standardizing SVG icon files.

### Features

- Removes `<desc>` tags and their content
- Removes `id` attributes from all elements
- Converts empty element tags to self-closing format
- Removes empty lines and unnecessary whitespace
- Optionally renames files to lowercase
- Provides detailed output with color-coded status

### Usage

```bash
# Basic usage (cleans icons in default directory)
./scripts/clean-svg-icons.sh

# Specify custom directory
./scripts/clean-svg-icons.sh path/to/svg/directory

# Clean without renaming to lowercase
./scripts/clean-svg-icons.sh app/assets/icons false

# Clean and rename to lowercase (default)
./scripts/clean-svg-icons.sh app/assets/icons true
```

### What it cleans

1. **Removes metadata**: Strips out `<desc>` tags that often contain editor information
2. **Removes IDs**: Eliminates `id` attributes that can cause conflicts
3. **Fixes empty tags**: Converts `<path></path>` to `<path />` to prevent "empty body" warnings
4. **Standardizes naming**: Optionally converts filenames to lowercase for consistency

### When to run

Run this script when:
- Adding new icon sets from external sources
- After exporting icons from design tools
- To standardize icon file naming conventions
- To clean up SVG code for better performance