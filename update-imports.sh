#!/bin/bash

# Update old components/ui to features/ui/components
find src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i '' 's|@/components/ui/|@/features/ui/components/|g' {} +
# Update features/ui/ to features/ui/components/ for direct imports
find src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i '' 's|@/features/ui/\([a-zA-Z0-9_-]*\)|@/features/ui/components/\1|g' {} +
# Fix double components/components
find src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i '' 's|components/components/|components/|g' {} +
# Update pages/ to features/
find src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i '' 's|@/pages/|@/features/|g' {} + 