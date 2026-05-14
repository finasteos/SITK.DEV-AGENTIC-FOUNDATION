#!/bin/bash
# SITK.DEV Agent Initialization Script
# Usage: ./INIT_AGENT.sh <NAME> <ROLE> <TEMPLATE>

NAME=$1
ROLE=$2
TEMPLATE=${3:-Standard}

if [ -z "$NAME" ] || [ -z "$ROLE" ]; then
  echo "Error: Name and Role are required."
  exit 1
fi

# Sanitize Name
SAFE_NAME=$(echo "$NAME" | tr '[:lower:]' '[:upper:]' | tr ' ' '_')
AGENT_DIR="SITK_FS/05__AGENTS/$SAFE_NAME"

mkdir -p "$AGENT_DIR"

SACRED_FILES=("IDENTITY.md" "SOUL.md" "SKILLS.md" "MEMORY.md" "SCRATCHPAD.md" "KANBAN.md" "HEARTBEAT.md" "CLI_ASSIGNMENT.md")

for FILE in "${SACRED_FILES[@]}"; do
  FILEPATH="$AGENT_DIR/$FILE"
  
  # Don't overwrite existing
  if [ -f "$FILEPATH" ]; then
    continue
  fi

  echo "# ${FILE%.*} - $NAME" > "$FILEPATH"
  echo "" >> "$FILEPATH"

  if [ "$FILE" == "IDENTITY.md" ]; then
    echo "Role: $ROLE" >> "$FILEPATH"
    echo "Created: $(date -u)" >> "$FILEPATH"
    echo "Status: DEPLOYED" >> "$FILEPATH"
  elif [ "$FILE" == "SOUL.md" ]; then
    echo "Core Directive: Execute tasks via SITK.DEV protocol." >> "$FILEPATH"
    echo "Template: $TEMPLATE" >> "$FILEPATH"
  else
    echo "Initialized via INIT_AGENT.sh at $(date -u)" >> "$FILEPATH"
  fi
done

echo "Agent $NAME ($SAFE_NAME) initialized successfully in $AGENT_DIR"
