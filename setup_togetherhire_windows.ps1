param(
    [string]$ProjectDir = "",
    [switch]$SkipStartupTest,
    [switch]$NoEmpiricaInstall,
    [switch]$AllowUnsupportedNode
)

$ErrorActionPreference = "Stop"
$RepoUrl = "https://github.com/jouisseuse/IC2S2-26-Tutorial.git"
$RepoDir = "IC2S2-26-Tutorial"
$UbuntuDistro = "Ubuntu"

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

function Install-WslUbuntuAndExit($Reason) {
    Step "Install WSL Ubuntu"
    Info $Reason
    Info "Running: wsl --install -d $UbuntuDistro"
    Info "Windows may ask for administrator approval or a restart."

    & wsl.exe --install -d $UbuntuDistro
    if ($LASTEXITCODE -ne 0) {
        Fail "WSL installation did not complete. Try running PowerShell as Administrator, then run: wsl --install -d Ubuntu"
    }

    Write-Host ""
    Write-Host "WSL/Ubuntu installation has been triggered."
    Write-Host "If Windows asks you to restart, restart first."
    Write-Host "Then open Ubuntu once, finish the username/password setup, and rerun:"
    Write-Host "  powershell -ExecutionPolicy Bypass -File .\setup_togetherhire_windows.ps1"
    exit 0
}

Step "Check WSL"
if (-not (Get-Command wsl.exe -ErrorAction SilentlyContinue)) {
    Fail "wsl.exe is not available on this Windows system. Update Windows, then run PowerShell as Administrator and try: wsl --install -d Ubuntu"
}

& wsl.exe --status | Out-Null
if ($LASTEXITCODE -ne 0) {
    Install-WslUbuntuAndExit "WSL is available but not initialized."
}

$distroList = & wsl.exe -l -q 2>$null
if ($LASTEXITCODE -ne 0 -or -not ($distroList | Where-Object { $_.Trim().Length -gt 0 })) {
    Install-WslUbuntuAndExit "No WSL Linux distribution is installed yet."
}

& wsl.exe sh -lc "printf WSL_OK" | Out-Null
if ($LASTEXITCODE -ne 0) {
    Install-WslUbuntuAndExit "WSL is installed, but no default Linux shell is ready."
}

Info "WSL is ready. The actual setup will run inside Ubuntu/WSL, not native Windows."

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
