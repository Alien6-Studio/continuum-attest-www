The fastest way to install ATTEST is using our installation script:

```bash
# Install from GitHub releases
curl -sSL https://raw.githubusercontent.com/Alien6-Studio/continuum-attest/main/scripts/install.sh | sh
```

This script automatically:
- Detects your operating system and architecture
- Downloads the latest stable release
- Installs to `/usr/local/bin/attest`
- Sets up shell completions
- Verifies the installation

## 1. Installation Methods

### 1.1 Method 1: Package Managers

#### Homebrew (macOS/Linux)
```bash
# Note: Homebrew formula not yet available
# Use the installation script or build from source instead
```

#### Cargo (Cross-platform)
```bash
# Install from source using cargo
cargo install --git https://github.com/Alien6-Studio/continuum-attest attest
```

#### APT (Ubuntu/Debian)
```bash
# Note: APT packages not yet available
# Use the installation script or build from source instead
```

#### YUM/DNF (RHEL/CentOS/Fedora)
```bash
# Note: RPM packages not yet available  
# Use the installation script or build from source instead
```

#### Snap (Universal Linux)
```bash
# Note: Snap package not yet available
# Use the installation script or build from source instead
```

#### Chocolatey (Windows)
```powershell
# Note: Chocolatey package not yet available
# Use the installation script or build from source instead
```

#### Scoop (Windows)
```powershell
scoop bucket add attest https://github.com/attest-ci/scoop-bucket
scoop install attest
```

### 1.2 Method 2: Pre-built Binaries

Download from [GitHub Releases](https://github.com/Alien6-Studio/continuum-attest/releases):

#### Linux (x86_64)
```bash
curl -L https://github.com/Alien6-Studio/continuum-attest/releases/latest/download/attest-linux-x86_64.tar.gz | tar xz
sudo mv attest /usr/local/bin/
```

#### macOS (Universal)
```bash
curl -L https://github.com/Alien6-Studio/continuum-attest/releases/latest/download/attest-macos-universal.tar.gz | tar xz
sudo mv attest /usr/local/bin/
```

#### Windows (x86_64)
```powershell
Invoke-WebRequest -Uri "https://github.com/Alien6-Studio/continuum-attest/releases/latest/download/attest-windows-x86_64.zip" -OutFile "attest.zip"
Expand-Archive -Path "attest.zip" -DestinationPath "."
Move-Item "attest.exe" "$env:USERPROFILE\bin\"
```

### 1.3 Method 3: Build from Source

#### Prerequisites
- Rust 1.70+ with Cargo
- Git
- C compiler (gcc/clang)

#### Build Steps
```bash
# Clone the repository
git clone https://github.com/Alien6-Studio/continuum-attest.git
cd attest

# Build with all features
cargo build --release --all-features

# Install locally
cargo install --path . --all-features

# Verify installation
attest --version
```

#### Development Build
```bash
# Development build with debug symbols
cargo build --all-features

# Run tests
cargo test --all-features

# Run with logging
RUST_LOG=debug ./target/debug/attest --help
```

## 2. Platform-Specific Setup

### 2.1 Linux

#### System Dependencies
```bash
# Ubuntu/Debian
sudo apt install build-essential pkg-config libssl-dev

# RHEL/CentOS/Fedora
sudo yum groupinstall "Development Tools"
sudo yum install openssl-devel pkg-config

# Arch Linux
sudo pacman -S base-devel openssl pkg-config
```

#### Shell Completion
```bash
# Bash
attest completion bash | sudo tee /etc/bash_completion.d/attest

# Zsh
attest completion zsh | sudo tee /usr/share/zsh/site-functions/_attest

# Fish
attest completion fish | sudo tee /usr/share/fish/completions/attest.fish
```

### 2.2 macOS

#### Xcode Command Line Tools
```bash
xcode-select --install
```

#### Shell Completion
```bash
# Bash (with Homebrew)
attest completion bash > $(brew --prefix)/etc/bash_completion.d/attest

# Zsh
attest completion zsh > /usr/local/share/zsh/site-functions/_attest

# Fish
attest completion fish > ~/.config/fish/completions/attest.fish
```

### 2.3 Windows

#### Prerequisites
```powershell
# Install Rust via rustup
Invoke-WebRequest -Uri "https://win.rustup.rs/" -OutFile "rustup-init.exe"
.\rustup-init.exe

# Install Git
winget install Git.Git

# Install Visual Studio Build Tools
winget install Microsoft.VisualStudio.2022.BuildTools
```

#### Shell Completion (PowerShell)
```powershell
# Add to PowerShell profile
attest completion powershell | Out-String | Invoke-Expression

# Or save to profile
attest completion powershell >> $PROFILE
```

## 3. Container Installation

### 3.1 Docker
```bash
# Official Docker image
docker pull attestci/attest:latest

# Run in current directory
docker run -v $(pwd):/workspace attestci/attest:latest init

# Interactive shell
docker run -it -v $(pwd):/workspace attestci/attest:latest bash
```

### 3.2 Kubernetes
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: attest-runner
spec:
  containers:
  - name: attest
    image: attestci/attest:latest
    command: ["attest", "run", "--verify", "--sign"]
    volumeMounts:
    - mountPath: /workspace
      name: source-code
  volumes:
  - name: source-code
    configMap:
      name: pipeline-source
```

## 4. Configuration

### 4.1 Global Configuration
```bash
# Create configuration directory
mkdir -p ~/.config/attest

# Create basic configuration
cat > ~/.config/attest/config.yaml << EOF
version: "0.1"
cache_enabled: true
deterministic: true
signing:
  enabled: true
  key_path: "~/.config/attest/keys/signing.key"
policies:
  enabled: true
  directory: "~/.config/attest/policies"
EOF
```

### 4.2 Environment Variables
```bash
export ATTEST_CONFIG="~/.config/attest/config.yaml"
export ATTEST_CACHE_DIR="~/.cache/attest"
export ATTEST_LOG_LEVEL="info"
export ATTEST_SIGNING_KEY="~/.config/attest/keys/signing.key"
```

### 4.3 Project Configuration
```bash
# Initialize project with ATTEST
cd your-project
attest init

# This creates:
# .attest/config.yaml    - Project-specific configuration
# .attest/keys/          - Cryptographic keys
# .attest/cache/         - Build cache
# .attest/policies/      - Custom policies
# attest.yaml           - Pipeline definition
# .attestignore         - Files to ignore
```

## 5. Verification

### 5.1 Basic Verification
```bash
# Check version
attest --version

# Check configuration
attest config show

# Test basic functionality
attest --help
```

### 5.2 Complete System Check
```bash
# Initialize test project
mkdir attest-test && cd attest-test
attest init --template basic

# Run test pipeline
attest run --dry-run

# Verify components
attest pipeline validate --strict
attest policy check --detailed

# Clean up
cd .. && rm -rf attest-test
```

### 5.3 Integration Test
```bash
# Create a real test pipeline
mkdir integration-test && cd integration-test

# Initialize with sample project
attest init --template rust-project

# Run full pipeline with verification
attest run --verify --sign --parallel 2

# Verify results
attest verify receipt_*.yaml --check-signatures

# View audit trail
attest audit history --limit 5

# Clean up
cd .. && rm -rf integration-test
```

## 6. Troubleshooting

### 6.1 Common Issues

#### 1. Permission Denied
```bash
# Error: Permission denied when installing
sudo chown -R $USER:$USER /usr/local/bin
chmod +x /usr/local/bin/attest
```

#### 2. Command Not Found
```bash
# Add to PATH
echo 'export PATH="/usr/local/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

#### 3. SSL Certificate Issues
```bash
# Update certificates
sudo apt update && sudo apt install ca-certificates

# Or disable SSL verification (not recommended)
export ATTEST_SKIP_SSL_VERIFY=true
```

#### 4. Rust Build Issues
```bash
# Update Rust toolchain
rustup update stable

# Clear cargo cache
cargo clean
rm -rf ~/.cargo/registry
```

#### 5. Docker Issues
```bash
# Check Docker daemon
sudo systemctl status docker

# Fix permissions
sudo usermod -aG docker $USER
newgrp docker
```

### 6.2 Getting Help

If you encounter issues:

1. **Check logs**: `attest --verbose [command]`
2. **Validate configuration**: `attest config validate`
3. **Update ATTEST**: Follow installation steps again
4. **Search issues**: [GitHub Issues](https://github.com/Alien6-Studio/continuum-attest/issues)
5. **Ask for help**: [Community Forum](https://forum.attest.continuu.ms)

### 6.3 System Requirements

#### Minimum Requirements
- **RAM**: 512MB available
- **Disk**: 100MB for installation + cache space
- **CPU**: Any 64-bit processor
- **Network**: Internet access for updates

#### Recommended Requirements
- **RAM**: 2GB+ for large builds
- **Disk**: 1GB+ for cache and artifacts
- **CPU**: Multi-core for parallel execution
- **Network**: High-speed for Docker pulls

## 7. Performance Tuning

### 7.1 Cache Configuration
```yaml
# ~/.config/attest/config.yaml
cache:
  enabled: true
  max_size: "10GB"
  compression: true
  retention_days: 30
```

### 7.2 Parallel Execution
```bash
# Use all CPU cores
attest run --parallel $(nproc)

# Or specify exact number
attest run --parallel 4
```

### 7.3 Memory Optimization
```bash
# Limit memory usage
export ATTEST_MAX_MEMORY="4GB"

# Enable memory profiling
export ATTEST_MEMORY_PROFILE=true
```

## 8. Updates

### 8.1 Automatic Updates
```bash
# Enable automatic updates
attest config set auto_update true

# Check for updates
attest update check

# Update to latest version
attest update install
```

### 8.2 Manual Updates
```bash
# Homebrew
brew upgrade attest

# Cargo
cargo install --force attest-cli

# Binary replacement
# Install from GitHub releases
curl -sSL https://raw.githubusercontent.com/Alien6-Studio/continuum-attest/main/scripts/install.sh | sh
```

## 9. Next Steps

After successful installation:

1. **[First Steps](first-steps.md)** - Create your first pipeline
2. **[Core Concepts](concepts.md)** - Understand ATTEST fundamentals
3. **[Pipeline Configuration](pipeline-configuration.md)** - Build robust pipelines

---

**Installation complete!**  Ready to create your first pipeline? -> [First Steps](first-steps.md)