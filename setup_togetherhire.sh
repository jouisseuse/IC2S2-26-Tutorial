#!/usr/bin/env bash
set -Eeuo pipefail

STEP=0
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEFAULT_EXPERIMENT_DIR="$SCRIPT_DIR/../my-experiment"
EXPERIMENT_DIR="${1:-$DEFAULT_EXPERIMENT_DIR}"
START_EMPIRICA="${START_EMPIRICA:-0}"
ALLOW_UNSUPPORTED_NODE="${ALLOW_UNSUPPORTED_NODE:-0}"
RUN_STARTUP_TEST="${RUN_STARTUP_TEST:-1}"
STARTUP_TEST_SECONDS="${STARTUP_TEST_SECONDS:-15}"
EMPIRICA_BIN=""

info() {
  printf "    %s\n" "$*"
}

step() {
  STEP=$((STEP + 1))
  printf "\n==> Step %d: %s\n" "$STEP" "$*"
}

ok() {
  printf "    OK: %s\n" "$*"
}

warn() {
  printf "    WARNING: %s\n" "$*"
}

die() {
  printf "\nERROR: %s\n" "$*" >&2
  exit 1
}

on_error() {
  local status=$?
  printf "\nERROR: setup failed near line %s while running: %s\n" "$1" "$BASH_COMMAND" >&2
  exit "$status"
}

trap 'on_error "$LINENO"' ERR

command_exists() {
  command -v "$1" >/dev/null 2>&1
}

check_platform() {
  step "Check operating system"

  local os_name
  os_name="$(uname -s 2>/dev/null || printf unknown)"
  info "Detected system: $os_name"

  case "$os_name" in
    MINGW*|MSYS*|CYGWIN*)
      die "Native Windows shells are not supported by Empirica. Open Ubuntu through WSL, then run this script inside the Ubuntu/WSL terminal."
      ;;
    Linux*|Darwin*)
      ok "Unix-like environment detected."
      ;;
    *)
      warn "Unknown environment. If you are on Windows, use WSL 2 with Ubuntu."
      ;;
  esac

  case "$SCRIPT_DIR" in
    /mnt/*)
      warn "This repository appears to be under /mnt. In WSL, keep the project in the Linux home directory, for example: ~/IC2S2-26-Tutorial."
      ;;
  esac
}

absolute_experiment_dir() {
  local requested="$1"
  local parent
  local name

  parent="$(dirname "$requested")"
  name="$(basename "$requested")"
  mkdir -p "$parent"
  parent="$(cd "$parent" && pwd)"
  printf "%s/%s" "$parent" "$name"
}

check_node() {
  step "Check Node.js and npm"

  command_exists node || die "Node.js is not installed. Install Node.js 20.12 or newer, then run this script again."
  command_exists npm || die "npm is not installed. Install npm, then run this script again."

  local node_version
  node_version="$(node -p "process.versions.node")"
  info "Node.js version: $node_version"

  if node -e 'const [major, minor, patch] = process.versions.node.split(".").map(Number); process.exit((major > 20 || (major === 20 && (minor > 12 || (minor === 12 && patch >= 0)))) ? 0 : 1);'; then
    ok "Node.js version is supported."
  elif [[ "$ALLOW_UNSUPPORTED_NODE" == "1" ]]; then
    warn "Node.js is below 20.12. Continuing because ALLOW_UNSUPPORTED_NODE=1."
  else
    die "Node.js $node_version is too old for @empirica/core. Install Node.js 20.12 or newer."
  fi

  local npm_version
  npm_version="$(npm --version)"
  info "npm version: $npm_version"

  if node -e "const major = Number('$npm_version'.split('.')[0]); process.exit(major >= 10 ? 0 : 1);"; then
    ok "npm version is recommended."
  else
    warn "npm 10 or newer is recommended. The setup may still work, but update npm if you see install errors."
  fi
}

ensure_empirica() {
  step "Check Empirica"

  if command_exists empirica; then
    EMPIRICA_BIN="$(command -v empirica)"
    "$EMPIRICA_BIN" version
    ok "Empirica is installed."
    return
  fi

  die "Empirica is not installed or not on PATH. Install Empirica first, confirm with: empirica version, then run this script again."
}

check_source_files() {
  step "Check tutorial source files"

  local required_paths=(
    "code/TogetherHire/client/src"
    "code/TogetherHire/client/index.html"
    "code/TogetherHire/client/jsconfig.json"
    "code/TogetherHire/client/package.json"
    "code/TogetherHire/client/package-lock.json"
    "code/TogetherHire/client/uno.config.ts"
    "code/TogetherHire/client/vite.config.js"
    "code/TogetherHire/server/src"
    "code/TogetherHire/server/jsconfig.json"
    "code/TogetherHire/server/package.json"
    "code/TogetherHire/server/package-lock.json"
    "code/TogetherHire/.empirica/treatments.yaml"
    "code/TogetherHire/.empirica/lobbies.yaml"
  )

  local rel
  for rel in "${required_paths[@]}"; do
    [[ -e "$SCRIPT_DIR/$rel" ]] || die "Missing required source path: $rel"
  done

  ok "TogetherHire source files are present."
}

create_empirica_project() {
  local abs_experiment_dir="$1"
  local parent
  local name

  step "Create fresh Empirica project"

  if [[ -e "$abs_experiment_dir" ]]; then
    die "Experiment directory already exists: $abs_experiment_dir. Choose a new path, for example: bash setup_togetherhire.sh ../my-experiment-2"
  fi

  parent="$(dirname "$abs_experiment_dir")"
  name="$(basename "$abs_experiment_dir")"
  mkdir -p "$parent"

  info "Creating Empirica project at: $abs_experiment_dir"
  (
    cd "$parent"
    "$EMPIRICA_BIN" create "$name"
  )

  [[ -d "$abs_experiment_dir/client" ]] || die "Empirica project was created, but client/ is missing."
  [[ -d "$abs_experiment_dir/server" ]] || die "Empirica project was created, but server/ is missing."
  [[ -d "$abs_experiment_dir/.empirica" ]] || die "Empirica project was created, but .empirica/ is missing."

  ok "Fresh Empirica project created."
}

copy_togetherhire_files() {
  local abs_experiment_dir="$1"

  step "Copy TogetherHire files into the Empirica project"

  rm -rf "$abs_experiment_dir/client/src"
  cp -R "$SCRIPT_DIR/code/TogetherHire/client/src" "$abs_experiment_dir/client/src"
  cp "$SCRIPT_DIR/code/TogetherHire/client/index.html" "$abs_experiment_dir/client/index.html"
  cp "$SCRIPT_DIR/code/TogetherHire/client/jsconfig.json" "$abs_experiment_dir/client/jsconfig.json"
  cp "$SCRIPT_DIR/code/TogetherHire/client/package.json" "$abs_experiment_dir/client/package.json"
  cp "$SCRIPT_DIR/code/TogetherHire/client/package-lock.json" "$abs_experiment_dir/client/package-lock.json"
  cp "$SCRIPT_DIR/code/TogetherHire/client/uno.config.ts" "$abs_experiment_dir/client/uno.config.ts"
  cp "$SCRIPT_DIR/code/TogetherHire/client/vite.config.js" "$abs_experiment_dir/client/vite.config.js"

  if [[ -d "$SCRIPT_DIR/code/TogetherHire/client/public" ]]; then
    rm -rf "$abs_experiment_dir/client/public"
    cp -R "$SCRIPT_DIR/code/TogetherHire/client/public" "$abs_experiment_dir/client/public"
  fi

  rm -rf "$abs_experiment_dir/server/src"
  cp -R "$SCRIPT_DIR/code/TogetherHire/server/src" "$abs_experiment_dir/server/src"
  cp "$SCRIPT_DIR/code/TogetherHire/server/jsconfig.json" "$abs_experiment_dir/server/jsconfig.json"
  cp "$SCRIPT_DIR/code/TogetherHire/server/package.json" "$abs_experiment_dir/server/package.json"
  cp "$SCRIPT_DIR/code/TogetherHire/server/package-lock.json" "$abs_experiment_dir/server/package-lock.json"

  cp "$SCRIPT_DIR/code/TogetherHire/.empirica/treatments.yaml" "$abs_experiment_dir/.empirica/treatments.yaml"
  cp "$SCRIPT_DIR/code/TogetherHire/.empirica/lobbies.yaml" "$abs_experiment_dir/.empirica/lobbies.yaml"

  [[ -f "$abs_experiment_dir/client/src/App.jsx" ]] || die "Client source copy failed."
  [[ -f "$abs_experiment_dir/server/src/index.js" ]] || die "Server source copy failed."
  [[ -f "$abs_experiment_dir/.empirica/treatments.yaml" ]] || die "Treatment config copy failed."

  ok "TogetherHire files copied."
}

install_node_dependencies() {
  local abs_experiment_dir="$1"

  step "Install client dependencies"
  (
    cd "$abs_experiment_dir/client"
    npm install
  )
  ok "Client dependencies installed."

  step "Install server dependencies"
  (
    cd "$abs_experiment_dir/server"
    npm install
  )
  ok "Server dependencies installed."
}

stop_process_tree() {
  local pid="$1"

  if command_exists pkill; then
    pkill -TERM -P "$pid" >/dev/null 2>&1 || true
  fi
  kill "$pid" >/dev/null 2>&1 || true
  sleep 2

  if kill -0 "$pid" >/dev/null 2>&1; then
    if command_exists pkill; then
      pkill -KILL -P "$pid" >/dev/null 2>&1 || true
    fi
    kill -KILL "$pid" >/dev/null 2>&1 || true
  fi

  wait "$pid" >/dev/null 2>&1 || true
}

run_startup_test() {
  local abs_experiment_dir="$1"
  local log_file="$abs_experiment_dir/empirica-startup-test.log"
  local pid

  if [[ "$RUN_STARTUP_TEST" != "1" ]]; then
    step "Skip Empirica startup test"
    info "RUN_STARTUP_TEST=0 was set."
    return
  fi

  step "Run Empirica startup test"
  info "Starting Empirica briefly to confirm the app boots."
  info "Startup test log: $log_file"

  (
    cd "$abs_experiment_dir"
    "$EMPIRICA_BIN" >"$log_file" 2>&1
  ) &
  pid=$!

  sleep "$STARTUP_TEST_SECONDS"

  if ! kill -0 "$pid" >/dev/null 2>&1; then
    warn "Empirica exited during the startup test."
    info "Last log lines:"
    tail -n 80 "$log_file" || true
    die "Empirica startup test failed."
  fi

  if grep -E "Player|Admin|server running" "$log_file" >/dev/null 2>&1; then
    ok "Empirica startup test passed."
  else
    warn "Empirica process stayed alive, but the expected Player/Admin lines were not found yet."
    info "Check the log if the app does not start later: $log_file"
  fi

  stop_process_tree "$pid"
  ok "Startup test process stopped."
}

finish_setup() {
  local abs_experiment_dir="$1"

  if [[ "$START_EMPIRICA" == "1" ]]; then
    step "Start Empirica"
    info "Project is ready at: $abs_experiment_dir"
    info "Empirica will print Player and Admin URLs below."
    info "Press Ctrl+C to stop the server."
    cd "$abs_experiment_dir"
    exec "$EMPIRICA_BIN"
  fi

  run_startup_test "$abs_experiment_dir"

  step "Setup complete"
  info "Project is ready at: $abs_experiment_dir"
  info "Next step: start the game with:"
  info "  cd \"$abs_experiment_dir\""
  info "  empirica"
  info "Then open the Player and Admin URLs printed by Empirica."
}

main() {
  local abs_experiment_dir
  abs_experiment_dir="$(absolute_experiment_dir "$EXPERIMENT_DIR")"

  printf "\nTogetherHire automated setup\n"
  printf "Repository: %s\n" "$SCRIPT_DIR"
  printf "Experiment: %s\n" "$abs_experiment_dir"
  printf "\nThis script checks prerequisites and sets up the TogetherHire game.\n"
  printf "It does not install Git, Node.js, npm, or Empirica. Install those first.\n"

  check_platform
  check_node
  ensure_empirica
  check_source_files
  create_empirica_project "$abs_experiment_dir"
  copy_togetherhire_files "$abs_experiment_dir"
  install_node_dependencies "$abs_experiment_dir"
  finish_setup "$abs_experiment_dir"
}

main "$@"
