#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "🔍 Checking GitHub Actions status..."
echo "Press Ctrl+C to stop checking"

while true; do
    # Get the latest workflow run using GitHub CLI
    status=$(gh run list --limit 1 --json status,conclusion --jq '.[0].status')
    conclusion=$(gh run list --limit 1 --json status,conclusion --jq '.[0].conclusion')
    
    # Print status with colors
    if [ "$status" = "completed" ]; then
        if [ "$conclusion" = "success" ]; then
            echo -e "${GREEN}✅ Workflow completed successfully!${NC}"
            break
        elif [ "$conclusion" = "failure" ]; then
            echo -e "${RED}❌ Workflow failed!${NC}"
            break
        else
            echo -e "${YELLOW}⚠️ Workflow completed with status: $conclusion${NC}"
            break
        fi
    else
        echo -e "${YELLOW}⏳ Workflow status: $status${NC}"
    fi
    
    # Wait 10 seconds before next check
    sleep 10
done 