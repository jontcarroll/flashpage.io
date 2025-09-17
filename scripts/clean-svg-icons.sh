#!/bin/bash

# SVG Icon Cleanup Script
# This script:
# 1. Removes <desc> tags and their content
# 2. Removes id attributes from all elements
# 3. Converts empty path tags to self-closing
# 4. Removes empty lines
# 5. Renames files to lowercase

# Configuration
SVG_DIR="${1:-../app/assets/icons}"  # Allow directory to be passed as argument
RENAME_TO_LOWERCASE="${2:-true}"   # Second argument controls lowercase renaming

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

# Counters
cleaned_count=0
renamed_count=0
error_count=0

echo "🧹 SVG Icon Cleanup Script"
echo "Directory: $SVG_DIR"
echo "Rename to lowercase: $RENAME_TO_LOWERCASE"
echo "----------------------------------------"

# Check if directory exists
if [ ! -d "$SVG_DIR" ]; then
    echo -e "${RED}Error: Directory $SVG_DIR does not exist${NC}"
    exit 1
fi

# Process each SVG file
for file in "$SVG_DIR"/*.svg; do
    if [ -f "$file" ]; then
        filename=$(basename "$file")
        dirname=$(dirname "$file")

        # Create temporary file for cleaning
        temp_file="${file}.tmp"

        # Clean the SVG content:
        # 1. Remove <desc> tags and their content
        # 2. Remove id attributes from all elements
        # 3. Convert empty path tags to self-closing
        # 4. Convert empty tags with spaces to self-closing
        # 5. Remove empty lines
        # 6. Remove unnecessary whitespace between tags
        sed -e '/<desc>/,/<\/desc>/d' \
            -e 's/ id="[^"]*"//g' \
            -e 's/<path\([^>]*\)><\/path>/<path\1 \/>/g' \
            -e 's/<path\([^>]*\)>[[:space:]]*<\/path>/<path\1 \/>/g' \
            -e 's/<circle\([^>]*\)><\/circle>/<circle\1 \/>/g' \
            -e 's/<rect\([^>]*\)><\/rect>/<rect\1 \/>/g' \
            -e 's/<ellipse\([^>]*\)><\/ellipse>/<ellipse\1 \/>/g' \
            -e 's/<line\([^>]*\)><\/line>/<line\1 \/>/g' \
            -e 's/<polygon\([^>]*\)><\/polygon>/<polygon\1 \/>/g' \
            -e 's/<polyline\([^>]*\)><\/polyline>/<polyline\1 \/>/g' \
            -e '/^[[:space:]]*$/d' \
            "$file" > "$temp_file"

        if [ $? -eq 0 ]; then
            # Check if the file was actually modified
            if ! cmp -s "$file" "$temp_file"; then
                # File was modified, replace original with cleaned version
                mv "$temp_file" "$file"
                echo -e "${GREEN}✓${NC} Cleaned: $filename"
                cleaned_count=$((cleaned_count + 1))
                file_was_cleaned=true
            else
                # File was not modified, remove temp file
                rm -f "$temp_file"
                file_was_cleaned=false
            fi

            # Rename to lowercase if requested (only process if file wasn't cleaned or still exists)
            if [ "$RENAME_TO_LOWERCASE" = "true" ]; then
                lowercase_name=$(echo "$filename" | tr '[:upper:]' '[:lower:]')
                if [ "$filename" != "$lowercase_name" ]; then
                    new_path="$dirname/$lowercase_name"

                    # Check if file still exists (it might have been cleaned)
                    if [ -f "$file" ]; then
                        # Use a temporary name to handle case-insensitive filesystems
                        temp_rename="${file}.renaming"

                        # First move to temp name, then to final lowercase name
                        mv "$file" "$temp_rename"
                        if [ $? -eq 0 ]; then
                            mv "$temp_rename" "$new_path"
                            if [ $? -eq 0 ]; then
                                echo -e "${GREEN}✓${NC} Renamed: $filename → $lowercase_name"
                                renamed_count=$((renamed_count + 1))
                            else
                                # Restore original name if second move fails
                                mv "$temp_rename" "$file"
                                echo -e "${YELLOW}⚠${NC}  Warning: Could not rename $filename to $lowercase_name"
                            fi
                        else
                            echo -e "${YELLOW}⚠${NC}  Warning: Could not rename $filename"
                        fi
                    fi
                fi
            fi
        else
            echo -e "${RED}✗${NC} Error processing: $filename"
            error_count=$((error_count + 1))
            rm -f "$temp_file"
        fi
    fi
done

echo "----------------------------------------"
echo -e "${GREEN}Summary:${NC}"
echo "  Files cleaned: $cleaned_count"
if [ "$RENAME_TO_LOWERCASE" = "true" ]; then
    echo "  Files renamed: $renamed_count"
fi
if [ $error_count -gt 0 ]; then
    echo -e "${RED}  Errors: $error_count${NC}"
fi

# Optional: Update any references to renamed files
if [ "$RENAME_TO_LOWERCASE" = "true" ] && [ $renamed_count -gt 0 ]; then
    echo ""
    echo "📝 Note: If you renamed files, you may need to update references in your code."
    echo "   The following files might contain icon references:"
    echo ""

    # Find files that might reference the icons
    files_with_refs=$(grep -r "name=\"[A-Z]" --include="*.vue" --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" app/ 2>/dev/null | cut -d: -f1 | sort -u)

    if [ -n "$files_with_refs" ]; then
        echo "$files_with_refs" | head -10
        ref_count=$(echo "$files_with_refs" | wc -l)
        if [ $ref_count -gt 10 ]; then
            echo "   ... and $((ref_count - 10)) more files"
        fi
    else
        echo "   No references found with uppercase names."
    fi
fi

exit 0
