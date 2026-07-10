param(
    [string]$ProjectDir = "",
    [switch]$SkipStartupTest,
    [switch]$NoEmpiricaInstall,
    [switch]$AllowUnsupportedNode
)

$ErrorActionPreference = "Stop"
$RepoUrl = "https://github.com/jouisseuse/IC2S2-26-Tutorial.git"
$RepoDir = "IC2S2-26-Tutorial"

function Step($Message) {
    Write-Host ""
    Write-Host "==> $Message"
}

function Info($Message) {
    Write-Host "    $Message"
}

function Fail($Message) {
    Write-Host ""
    Write-Error $Message
    exit 1
}

function Quote-Bash([string]$Value) {
    return "'" + $Value.Replace("'", "'\"'\"'") + "'"
}

Step "Check WSL"
if (-not (Get-Command wsl.exe -ErrorAction SilentlyContinue)) {
    Fail "WSL is not installed. In PowerShell, run: wsl --install. Restart Windows if prompted, then run this script again."
}

& wsl.exe sh -lc "printf WSL_OK" | Out-Null
if ($LASTEXITCODE -ne 0) {
    Fail "WSL is installed but no Linux distribution is ready. Run: wsl --install -d Ubuntu, finish Ubuntu setup, then run this script again."
}

Info "WSL is available. The actual setup will run inside Ubuntu/WSL, not native Windows."

$envParts = @()
if ($SkipStartupTest) { $envParts += "RUN_STARTUP_TEST=0" }
if ($NoEmpiricaInstall) { $envParts += "INSTALL_EMPIRICA=0" }
if ($AllowUnsupportedNode) { $envParts += "ALLOW_UNSUPPORTED_NODE=1" }
$envPrefix = ""
if ($envParts.Count -gt 0) {
    $envPrefix = ($envParts -join " ") + " "
}

$projectValue = "__DEFAULT__"
if ($ProjectDir.Trim().Length -gt 0) {
    $projectValue = $ProjectDir
}

$repoUrlQ = Quote-Bash $RepoUrl
$repoDirQ = Quote-Bash $RepoDir
$projectQ = Quote-Bash $projectValue

$wslScript = @"
set -Eeuo pipefail

REPO_URL=$repoUrlQ
REPO_DIR=$repoDirQ
PROJECT_DIR=$projectQ

if [ "`$PROJECT_DIR" = "__DEFAULT__" ]; then
  PROJECT_DIR="`$HOME/my-experiment"
fi

echo "==> Prepare WSL dependencies"
if ! command -v git >/dev/null 2>&1 || ! command -v curl >/dev/null 2>&1; then
  echo "    Installing git, curl, and certificates inside WSL. You may be asked for your WSL password."
  sudo apt-get update
  sudo apt-get install -y git curl ca-certificates
fi

cd "`$HOME"

if [ ! -d "`$REPO_DIR/.git" ]; then
  echo "==> Clone tutorial repo inside WSL home"
  git clone --filter=blob:none --sparse "`$REPO_URL" "`$REPO_DIR"
else
  echo "==> Tutorial repo already exists inside WSL home"
fi

cd "`$REPO_DIR"
git sparse-checkout set code materials
git pull --ff-only || true
chmod +x setup_togetherhire.sh

echo "==> Run TogetherHire setup inside WSL"
${envPrefix}bash setup_togetherhire.sh "`$PROJECT_DIR"
"@

Step "Run setup inside WSL"
&wsl.exe bash -lc $wslScript
if ($LASTEXITCODE -ne 0) {
    Fail "WSL setup failed. See the terminal output above."
}

Write-Host ""
Write-Host "Setup finished. To start the game later, open Ubuntu/WSL and run:"
if ($ProjectDir.Trim().Length -gt 0) {
    Write-Host "  cd $ProjectDir"
} else {
    Write-Host "  cd ~/my-experiment"
}
Write-Host "  empirica"
