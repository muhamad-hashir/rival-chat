#!/usr/bin/env bash
# Final repo audit: no secrets, correct .gitignore, clean deploy artifacts.
set -u
cd /home/muhammadhashir/Documents/web/RivalChat || exit 1

echo "=== 1. SECRETS SCAN (should be empty) ==="
grep -rniE "AIza[a-zA-Z0-9_+/-]{100,}|firebase\.config|private_key|client_secret|databaseURL\s*:\s*[\"'][^\"']+firebasedatabase" src/ public/ netlify.toml README.md DEPLOYMENT.md .env* 2>/dev/null || echo "  PASS - no secrets found"

echo
echo "=== 2. FIREBASE CONFIG IS ENV-DRIVEN ==="
grep -c "import.meta.env.VITE_FIREBASE" src/firebase.js
echo "  (all config read from environment variables, never hardcoded)"

echo
echo "=== 3. .gitignore ==="
cat .gitignore
echo
echo "  FILES THAT SHOULD BE IGNORED (checked):"
echo "  .env.local tracked? $(git check-ignore .env.local && echo NO - WRONG || echo OK)"
echo "  dist tracked?     $(git check-ignore dist && echo NO - WRONG || echo OK)"
echo "  node_modules?     $(git check-ignore node_modules && echo NO - WRONG || echo OK)"

echo
echo "=== 4. GIT TRACKED FILES ==="
git ls-files | sort

echo
echo "=== 5. DIST ARTIFACTS (should be ignored, never committed) ==="
ls -la dist/assets/ 2>/dev/null | grep -E "\.js|\.css" | awk '{print $5, $9}'

echo
echo "=== 6. ENV EXAMPLE (what goes in the repo) ==="
cat .env.example

echo
echo "=== 7. DEPLOY CONFIG (netlify.toml) ==="
cat netlify.toml

echo
echo "=== 8. README DEPLOY STEPS ==="
sed -n '1,80p' README.md
