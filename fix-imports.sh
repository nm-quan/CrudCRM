#!/bin/bash

# Fix import statements in all .tsx files in components/ui/
for file in components/ui/*.tsx; do
  if [ -f "$file" ]; then
    echo "Fixing imports in $file"
    
    # Fix @radix-ui imports
    sed -i.bak 's/@radix-ui\/react-accordion@[0-9.]*/@radix-ui\/react-accordion/g' "$file"
    sed -i.bak 's/@radix-ui\/react-alert-dialog@[0-9.]*/@radix-ui\/react-alert-dialog/g' "$file"
    sed -i.bak 's/@radix-ui\/react-aspect-ratio@[0-9.]*/@radix-ui\/react-aspect-ratio/g' "$file"
    sed -i.bak 's/@radix-ui\/react-avatar@[0-9.]*/@radix-ui\/react-avatar/g' "$file"
    sed -i.bak 's/@radix-ui\/react-checkbox@[0-9.]*/@radix-ui\/react-checkbox/g' "$file"
    sed -i.bak 's/@radix-ui\/react-collapsible@[0-9.]*/@radix-ui\/react-collapsible/g' "$file"
    sed -i.bak 's/@radix-ui\/react-context-menu@[0-9.]*/@radix-ui\/react-context-menu/g' "$file"
    sed -i.bak 's/@radix-ui\/react-dialog@[0-9.]*/@radix-ui\/react-dialog/g' "$file"
    sed -i.bak 's/@radix-ui\/react-dropdown-menu@[0-9.]*/@radix-ui\/react-dropdown-menu/g' "$file"
    sed -i.bak 's/@radix-ui\/react-hover-card@[0-9.]*/@radix-ui\/react-hover-card/g' "$file"
    sed -i.bak 's/@radix-ui\/react-label@[0-9.]*/@radix-ui\/react-label/g' "$file"
    sed -i.bak 's/@radix-ui\/react-menubar@[0-9.]*/@radix-ui\/react-menubar/g' "$file"
    sed -i.bak 's/@radix-ui\/react-navigation-menu@[0-9.]*/@radix-ui\/react-navigation-menu/g' "$file"
    sed -i.bak 's/@radix-ui\/react-popover@[0-9.]*/@radix-ui\/react-popover/g' "$file"
    sed -i.bak 's/@radix-ui\/react-progress@[0-9.]*/@radix-ui\/react-progress/g' "$file"
    sed -i.bak 's/@radix-ui\/react-radio-group@[0-9.]*/@radix-ui\/react-radio-group/g' "$file"
    sed -i.bak 's/@radix-ui\/react-scroll-area@[0-9.]*/@radix-ui\/react-scroll-area/g' "$file"
    sed -i.bak 's/@radix-ui\/react-select@[0-9.]*/@radix-ui\/react-select/g' "$file"
    sed -i.bak 's/@radix-ui\/react-separator@[0-9.]*/@radix-ui\/react-separator/g' "$file"
    sed -i.bak 's/@radix-ui\/react-slider@[0-9.]*/@radix-ui\/react-slider/g' "$file"
    sed -i.bak 's/@radix-ui\/react-slot@[0-9.]*/@radix-ui\/react-slot/g' "$file"
    sed -i.bak 's/@radix-ui\/react-switch@[0-9.]*/@radix-ui\/react-switch/g' "$file"
    sed -i.bak 's/@radix-ui\/react-tabs@[0-9.]*/@radix-ui\/react-tabs/g' "$file"
    sed -i.bak 's/@radix-ui\/react-toggle@[0-9.]*/@radix-ui\/react-toggle/g' "$file"
    sed -i.bak 's/@radix-ui\/react-toggle-group@[0-9.]*/@radix-ui\/react-toggle-group/g' "$file"
    sed -i.bak 's/@radix-ui\/react-tooltip@[0-9.]*/@radix-ui\/react-tooltip/g' "$file"
    
    # Fix other imports
    sed -i.bak 's/lucide-react@[0-9.]*/lucide-react/g' "$file"
    sed -i.bak 's/class-variance-authority@[0-9.]*/class-variance-authority/g' "$file"
  fi
done

# Clean up backup files
rm -f components/ui/*.bak

echo "All import statements have been fixed!"