# Script Podman pour Polyglotte Project
# Author: lafouine
# Usage: .\poma.ps1 -Action [build|up|down|logs|ps|clean|rebuild]

param(
    [Parameter(Mandatory = $true)]
    [ValidateSet('b', 'u', 'd', 'l', 'p', 'c', 'r', 's')]
    [string]$a
)

# Vérifier que Podman est installé et en cours d'exécution
function Test-Podman {
    try {
        podman version > $null 2>&1
        return $true
    }
    catch {
        Write-Host "Podman n'est pas installe ou n'est pas en cours d'execution" -ForegroundColor Red
        return $false
    }
}

# Vérifier que podman-compose est disponible
function Test-PodmanCompose {
    try {
        podman-compose --version > $null 2>&1
        return $true
    }
    catch {
        Write-Host "Podman Compose n'est pas disponible" -ForegroundColor Red
        return $false
    }
}

# Construire les images
function Build-Images {
    Write-Host "Construction des images Podman..." -ForegroundColor Cyan
    podman-compose build
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Images construites avec succes" -ForegroundColor Green
    }
    else {
        Write-Host "Erreur lors de la construction des images" -ForegroundColor Red
    }
}

# Démarrer les services
function Start-Services {
    Write-Host "Demarrage des services Podman..." -ForegroundColor Cyan
    podman-compose up -d
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Services demarres" -ForegroundColor Green
        Show-Services
    }
    else {
        Write-Host "Erreur lors du demarrage des services" -ForegroundColor Red
    }
}

# Afficher les logs
function Show-Logs {
    Write-Host "Affichage des logs (Ctrl+C pour arreter)..." -ForegroundColor Cyan
    podman-compose logs -f
}

# Afficher l'état des services
function Show-Services {
    Write-Host "Etat des services:" -ForegroundColor Cyan
    podman-compose ps
    
    Write-Host "Points d'acces:" -ForegroundColor Yellow
    Write-Host "Frontend (React):   http://localhost:8080" -ForegroundColor Cyan
    Write-Host "Backend API:        http://localhost:5236" -ForegroundColor Magenta
    Write-Host "MongoDB:            localhost:27017" -ForegroundColor Green
    Write-Host "API Swagger:        http://localhost:5236/swagger" -ForegroundColor White
}

# Arrêter les services
function Stop-Services {
    Write-Host "Arret des services..." -ForegroundColor Cyan
    podman-compose stop
    Write-Host "Services arretes" -ForegroundColor Green
}

# Arrêter et supprimer les conteneurs
function Down-Services {
    Write-Host "Suppression des conteneurs et reseaux..." -ForegroundColor Cyan
    podman-compose down
    Write-Host "Conteneurs supprimes" -ForegroundColor Green
}

# Nettoyage complet (y compris les volumes de données)
function Clean-All {
    Write-Host "Nettoyage complet (conteneurs + volumes + images)..." -ForegroundColor Yellow
    Write-Host "ATTENTION: Cette action supprimera les donnees MongoDB!" -ForegroundColor Red
    $confirm = Read-Host "Etes-vous sur? (oui/non)"
    
    if ($confirm -eq "oui") {
        podman-compose down -v --rmi all
        Write-Host "Nettoyage termine" -ForegroundColor Green
    }
    else {
        Write-Host "Operation annulee" -ForegroundColor Yellow
    }
}

# Rebuild complet
function Rebuild-All {
    Write-Host "Rebuild complet..." -ForegroundColor Cyan
    Down-Services
    Build-Images
    Start-Services
}

# Vérifications préalables
if (-not (Test-Podman)) { exit 1 }
if (-not (Test-PodmanCompose)) { exit 1 }

# Exécuter l'action demandée
switch ($a) {
    'b' {
        Build-Images
    }
    'u' {
        Start-Services
    }
    'd' {
        Down-Services
    }
    's' {
        Stop-Services
    }
    'l' {
        Show-Logs
    }
    'p' {
        Show-Services
    }
    'c' {
        Clean-All
    }
    'r' {
        Rebuild-All
    }
}

Write-Host ""
