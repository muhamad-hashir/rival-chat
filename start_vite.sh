#!/usr/bin/env bash
# Persistent Vite dev server for RivalChat — survives terminal/shell restarts.
cd /home/muhammadhashir/Documents/web/RivalChat || exit 1

PORT=5173

# Handle port already in use: print a clear message instead of failing loudly.
if command -v ss >/dev/null 2>&1; then
  if ss -tln 2>/dev/null | grep -q ":$PORT "; then
    echo "Port $PORT is already in use — another dev server may be running."
    ss -tlnp 2>/dev/null | grep ":$PORT "
    exit 1
  fi
elif command -v netstat >/dev/null 2>&1; then
  if netstat -tln 2>/dev/null | grep -q ":$PORT "; then
    echo "Port $PORT is already in use."
    exit 1
  fi
fi

# Start detached (setsid) so the process is not tied to this shell's lifecycle.
setsid npm run dev -- --host 0.0.0.0 --port "$PORT" > /tmp/vite.log 2>&1 < /dev/null &

# Give Vite a moment to bind, then track the actual node process listening on $PORT.
for i in $(seq 1 20); do
  if curl -s -o /dev/null http://localhost:$PORT/ 2>/dev/null; then
    echo "Vite dev server is up on http://localhost:$PORT/"
    break
  fi
  sleep 1
done

# Record the real listening process (node) so we can check / kill it reliably.
LISTENER=$(ss -tlnp 2>/dev/null | grep ":$PORT " | grep -oP 'pid=\K[0-9]+' | head -1)
echo $LISTENER > /tmp/vite.listener.pid
if [ -n "$LISTENER" ]; then
  echo "Server process: $LISTENER (tail -f /tmp/vite.log to watch)"
else
  echo "Could not resolve the server process pid."
fi
echo "Vite failed to start within 20s."
echo "--- log tail:"; tail -20 /tmp/vite.log
exit 1
