$ErrorActionPreference = 'Stop'

$frontendDir = Split-Path -Parent $PSScriptRoot
$workspaceDir = Split-Path -Parent $frontendDir
$particleEarthDir = Join-Path $workspaceDir 'ParticleEarth'
$copyScript = Join-Path $PSScriptRoot 'syncParticleEarth.mjs'

Push-Location $particleEarthDir
try {
  npm run build
}
finally {
  Pop-Location
}

node $copyScript
