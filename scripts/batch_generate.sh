#!/usr/bin/env bash
# Generates 3 variants for each approved batch concept.
# Run from the repo root: bash scripts/batch_generate.sh
# Images land in tmp/moji-mash/<date>/  — open index.html there to review.

set -e
cd "$(dirname "$0")/.."

echo "=== Moji Mash batch generation — $(date +%Y-%m-%d) ==="
echo ""

python3 scripts/generate_moji.py \
  --words "tax return" \
  --prompt "an expressive emoji of a stack of tax forms with dollar bills and a bold looping boomerang arrow returning them, cute cartoon sticker, thick outline, saturated colors, centered on white background" \
  --count 3 --check

python3 scripts/generate_moji.py \
  --words "earth worm" \
  --prompt "an expressive emoji of a cheerful cartoon worm wearing a tiny hard hat tunneling through a round smiling Earth globe, cute cartoon sticker, thick outline, saturated colors, centered on white background" \
  --count 3 --check

python3 scripts/generate_moji.py \
  --words "mother hen" \
  --prompt "an expressive emoji of a cartoon hen wearing a pearl necklace and apron clucking protectively over tiny chicks, cute cartoon sticker, thick outline, saturated colors, centered on white background" \
  --count 3 --check

python3 scripts/generate_moji.py \
  --words "flag barbecue" \
  --prompt "an expressive emoji of an American flag planted proudly in a smoking backyard barbecue grill with grilled burgers, cute cartoon sticker, thick outline, saturated colors, centered on white background" \
  --count 3 --check

python3 scripts/generate_moji.py \
  --words "couch potato" \
  --prompt "an expressive emoji of a cartoon potato with googly eyes lounging on a small sofa holding a TV remote with a blissful smile, cute cartoon sticker, thick outline, saturated colors, centered on white background" \
  --count 3 --check

python3 scripts/generate_moji.py \
  --words "night owl" \
  --prompt "an expressive emoji of a wide-eyed owl wearing a tiny nightcap perched on a crescent moon surrounded by stars, cute cartoon sticker, thick outline, saturated colors, centered on white background" \
  --count 3 --check

python3 scripts/generate_moji.py \
  --words "spring cleaning" \
  --prompt "an expressive emoji of spring flowers tied to a broom sweeping away dust clouds, cute cartoon sticker, thick outline, saturated colors, centered on white background" \
  --count 3 --check

python3 scripts/generate_moji.py \
  --words "breakfast bed bouquet" \
  --prompt "an expressive emoji of a breakfast tray with eggs and orange juice on a cozy bed beside a colorful flower bouquet, cute cartoon sticker, thick outline, saturated colors, centered on white background" \
  --count 3 --check

echo ""
echo "=== Done! Open tmp/moji-mash/$(date +%Y-%m-%d)/index.html to review ==="
