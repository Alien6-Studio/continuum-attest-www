#!/bin/bash

# Script pour nettoyer les workflow runs GitHub Actions
# Installe GitHub CLI si nécessaire et supprime tous les anciens runs

set -e

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction d'affichage
log() {
    echo -e "${BLUE}[$(date '+%H:%M:%S')]${NC} $1"
}

success() {
    echo -e "${GREEN}✅ $1${NC}"
}

warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

error() {
    echo -e "${RED}❌ $1${NC}"
}

# Vérifier le système d'exploitation
detect_os() {
    if [[ "$OSTYPE" == "darwin"* ]]; then
        echo "macos"
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        echo "linux"
    else
        echo "unknown"
    fi
}

# Installer GitHub CLI
install_gh_cli() {
    local os=$(detect_os)
    
    log "Vérification de GitHub CLI..."
    
    if command -v gh &> /dev/null; then
        success "GitHub CLI est déjà installé ($(gh --version | head -1))"
        return 0
    fi
    
    log "Installation de GitHub CLI..."
    
    case $os in
        "macos")
            if command -v brew &> /dev/null; then
                brew install gh
            else
                error "Homebrew n'est pas installé. Veuillez installer GitHub CLI manuellement:"
                echo "https://cli.github.com/manual/installation"
                exit 1
            fi
            ;;
        "linux")
            # Installation pour Ubuntu/Debian
            if command -v apt &> /dev/null; then
                curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
                echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null
                sudo apt update
                sudo apt install gh
            # Installation pour CentOS/RHEL/Fedora
            elif command -v dnf &> /dev/null; then
                sudo dnf install 'dnf-command(config-manager)'
                sudo dnf config-manager --add-repo https://cli.github.com/packages/rpm/gh-cli.repo
                sudo dnf install gh
            else
                error "Gestionnaire de paquets non supporté. Veuillez installer GitHub CLI manuellement:"
                echo "https://cli.github.com/manual/installation"
                exit 1
            fi
            ;;
        *)
            error "Système d'exploitation non supporté. Veuillez installer GitHub CLI manuellement:"
            echo "https://cli.github.com/manual/installation"
            exit 1
            ;;
    esac
    
    success "GitHub CLI installé avec succès"
}

# Vérifier l'authentification GitHub
check_auth() {
    log "Vérification de l'authentification GitHub..."
    
    if ! gh auth status &> /dev/null; then
        warning "Vous n'êtes pas authentifié avec GitHub CLI"
        log "Lancement de l'authentification..."
        gh auth login
    else
        success "Authentifié avec GitHub CLI"
    fi
}

# Obtenir les informations du repository
get_repo_info() {
    if [ -d ".git" ]; then
        local remote_url=$(git remote get-url origin)
        # Extraire owner/repo depuis l'URL GitHub
        if [[ $remote_url =~ github\.com[:/]([^/]+)/([^/.]+) ]]; then
            REPO_OWNER="${BASH_REMATCH[1]}"
            REPO_NAME="${BASH_REMATCH[2]}"
            success "Repository détecté: $REPO_OWNER/$REPO_NAME"
        else
            error "Impossible de détecter le repository GitHub"
            exit 1
        fi
    else
        error "Ce script doit être exécuté dans un repository git"
        exit 1
    fi
}

# Nettoyer les workflow runs
cleanup_workflows() {
    log "Récupération des workflow runs..."
    
    # Obtenir tous les workflow runs
    local runs=$(gh run list --repo "$REPO_OWNER/$REPO_NAME" --limit 100 --json databaseId --jq '.[].databaseId')
    
    if [ -z "$runs" ]; then
        warning "Aucun workflow run trouvé"
        return 0
    fi
    
    local count=$(echo "$runs" | wc -l | tr -d ' ')
    log "Trouvé $count workflow runs à supprimer"
    
    echo -n "Voulez-vous supprimer tous les workflow runs ? (y/N): "
    read -r response
    
    if [[ ! "$response" =~ ^[Yy]$ ]]; then
        warning "Suppression annulée"
        return 0
    fi
    
    log "Suppression des workflow runs..."
    
    local deleted=0
    while IFS= read -r run_id; do
        if [ -n "$run_id" ]; then
            if gh run delete "$run_id" --repo "$REPO_OWNER/$REPO_NAME" 2>/dev/null; then
                ((deleted++))
                echo -ne "\r${BLUE}Supprimé: $deleted/$count runs${NC}"
            fi
        fi
    done <<< "$runs"
    
    echo # Nouvelle ligne après le compteur
    success "Supprimé $deleted workflow runs"
}

# Fonction principale
main() {
    echo -e "${BLUE}"
    echo "========================================"
    echo "  Nettoyage des Workflow Runs GitHub   "
    echo "========================================"
    echo -e "${NC}"
    
    install_gh_cli
    check_auth
    get_repo_info
    cleanup_workflows
    
    success "Nettoyage terminé !"
    
    # Optionnel: déclencher un nouveau workflow
    echo -n "Voulez-vous déclencher un nouveau workflow ? (y/N): "
    read -r response
    
    if [[ "$response" =~ ^[Yy]$ ]]; then
        log "Déclenchement d'un nouveau workflow..."
        gh workflow run "Deploy Documentation" --repo "$REPO_OWNER/$REPO_NAME" 2>/dev/null || {
            warning "Impossible de déclencher le workflow automatiquement"
            log "Vous pouvez le faire manuellement sur: https://github.com/$REPO_OWNER/$REPO_NAME/actions"
        }
        success "Workflow déclenché"
    fi
}

# Gestion des erreurs
trap 'error "Script interrompu"; exit 1' INT TERM

# Exécution
main "$@"