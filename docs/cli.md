## 1. Complete CLI Reference

The ATTEST CLI is your primary interface for creating, running, and managing secure CI/CD pipelines. This comprehensive guide covers all commands, options, and usage patterns.

## 2. Quick Reference

```bash
# Essential commands
attest init                    # Initialize new project
attest run                     # Execute pipeline
attest run --verify --sign    # Execute with full security
attest verify receipt.yaml    # Verify attestation
attest audit history          # View execution history

# Pipeline management
attest pipeline show          # Visualize pipeline
attest pipeline validate     # Validate configuration
attest pipeline export       # Export to other formats

# GitOps operations
attest deploy apply          # Deploy to environment
attest deploy status         # Check deployment status

# Policy enforcement
attest policy check          # Validate against policies
attest audit report          # Generate compliance reports
```

## 3. Global Options

All ATTEST commands support these global options:

```bash
attest [GLOBAL_OPTIONS] <COMMAND> [COMMAND_OPTIONS]
```

### 3.1 Global Flags

| Option | Short | Description | Example |
|--------|-------|-------------|---------|
| `--verbose` | `-v` | Enable debug logging | `attest -v run` |
| `--quiet` | `-q` | Suppress all output except errors | `attest -q run` |
| `--config FILE` | | Specify custom configuration file | `attest --config custom.yaml run` |
| `--working-dir DIR` | | Set working directory | `attest --working-dir /project run` |
| `--help` | `-h` | Show help information | `attest -h` |
| `--version` | `-V` | Show version information | `attest -V` |

### 3.2 Environment Variables

```bash
export ATTEST_CONFIG="/path/to/config.yaml"
export ATTEST_CACHE_DIR="/custom/cache/dir"
export ATTEST_LOG_LEVEL="debug"
export ATTEST_SIGNING_KEY="/path/to/signing.key"
```

## 4. Project Management Commands

### 4.1 `attest init` - Initialize Project

Initialize a new ATTEST project with configuration and sample pipeline.

```bash
attest init [OPTIONS]
```

#### Options
| Option | Description | Example |
|--------|-------------|---------|
| `--no-sample` | Skip creating sample pipeline | `attest init --no-sample` |
| `--force` | Force initialization even if directory exists | `attest init --force` |
| `--template TEMPLATE` | Use specific pipeline template | `attest init --template rust-project` |

#### Templates Available
- `basic` - Simple build pipeline
- `rust-project` - Rust application with Cargo
- `node-project` - Node.js application with npm
- `web-app` - Full-stack web application
- `microservices` - Multi-service architecture
- `ml-pipeline` - Machine learning workflow

#### Examples
```bash
# Basic initialization
attest init

# Initialize without sample pipeline
attest init --no-sample

# Initialize with Rust template
attest init --template rust-project

# Force reinitialize existing directory
attest init --force --template web-app
```

#### Generated Structure
```
your-project/
├── .attest/
│   ├── config.yaml      # Project configuration
│   ├── keys/            # Cryptographic keys
│   └── cache/           # Build cache
├── attest.yaml         # Pipeline definition
└── .attestignore       # Files to ignore
```

## 5. Pipeline Execution Commands

### 5.1 `attest run` - Execute Pipeline

Run a pipeline with cryptographic attestation and verification.

```bash
attest run [OPTIONS]
```

#### Essential Options
| Option | Description | Default |
|--------|-------------|---------|
| `-p, --pipeline FILE` | Pipeline file path | `attest.yaml` |
| `--verify` | Run in isolated environment | `false` |
| `--sign` | Cryptographically sign results | `false` |
| `--deterministic` | Enable deterministic execution | `false` |

#### Performance Options
| Option | Description | Default |
|--------|-------------|---------|
| `-j, --parallel N` | Maximum parallel jobs | `auto` |
| `--no-cache` | Disable build cache | `false` |
| `--timeout SECONDS` | Global timeout in seconds | `3600` |

#### Execution Control
| Option | Description | Example |
|--------|-------------|---------|
| `--dry-run` | Validate but don't execute | `attest run --dry-run` |
| `--step STEP` | Run only specific step | `attest run --step build` |
| `--from-step STEP` | Start from specific step | `attest run --from-step test` |
| `--until-step STEP` | Stop at specific step | `attest run --until-step build` |

#### Output Options
| Option | Description | Example |
|--------|-------------|---------|
| `--output FILE` | Save receipt to specific file | `attest run --output build-receipt.yaml` |
| `--format FORMAT` | Receipt output format (yaml, json) | `attest run --format json` |

#### Complete Examples

```bash
# Basic execution
attest run

# Full security mode
attest run --verify --sign --deterministic

# Performance optimized
attest run --parallel 8 --no-cache

# Specific step execution
attest run --step build --output build-receipt.yaml

# Production workflow
attest run --verify --sign --parallel 4 --timeout 1800 --output prod-receipt.yaml

# Debug mode
attest -v run --dry-run --step problematic-step

# Continuous integration mode
attest run --verify --sign --parallel $(nproc) --format json --output ci-receipt.json
```

## 6. Verification Commands

### 6.1 `attest verify` - Verify Attestation

Verify the integrity and authenticity of attestation receipts.

```bash
attest verify TARGET [OPTIONS]
```

#### Arguments
- `TARGET` - Receipt file or pipeline hash to verify

#### Options
| Option | Description | Example |
|--------|-------------|---------|
| `--check-signatures` | Verify cryptographic signatures | `attest verify receipt.yaml --check-signatures` |
| `--policy POLICY` | Verify against specific policy | `attest verify receipt.yaml --policy security` |
| `--verbose-verify` | Show detailed verification steps | `attest verify receipt.yaml --verbose-verify` |
| `--public-key FILE` | Use external public key | `attest verify receipt.yaml --public-key team.pem` |
| `--trusted-only` | Only accept trusted signers | `attest verify receipt.yaml --trusted-only` |
| `--output FILE` | Output verification result | `attest verify receipt.yaml --output result.json` |

#### Examples
```bash
# Basic verification
attest verify receipt_20241201_143052.yaml

# Full cryptographic verification
attest verify receipt_20241201_143052.yaml --check-signatures --verbose-verify

# Policy compliance check
attest verify receipt_20241201_143052.yaml --policy sox-compliance

# Team verification with external key
attest verify receipt_20241201_143052.yaml \
  --public-key team-public-key.pem \
  --check-signatures \
  --output verification-result.json

# Batch verification
find .attest/receipts -name "*.yaml" -exec attest verify {} --check-signatures \;
```

## 7. Pipeline Management Commands

### 7.1 `attest pipeline` - Pipeline Operations

Manage and visualize pipeline configurations.

#### `attest pipeline show` - Display Pipeline

```bash
attest pipeline show [OPTIONS]
```

##### Formats
| Format | Description | Use Case |
|--------|-------------|----------|
| `ascii` | ASCII art visualization | Terminal display |
| `dot` | Graphviz DOT format | Graph generation |
| `json` | JSON structure | Programmatic processing |
| `mermaid` | Mermaid diagram | Documentation |

##### Options
| Option | Description | Example |
|--------|-------------|---------|
| `-f, --format FORMAT` | Output format | `--format mermaid` |
| `-p, --pipeline FILE` | Pipeline file to visualize | `--pipeline custom.yaml` |
| `--details` | Show step details | `--details` |
| `--with-timing` | Show execution times | `--with-timing` |

##### Examples
```bash
# ASCII visualization
attest pipeline show

# Detailed Mermaid diagram
attest pipeline show --format mermaid --details > pipeline.mmd

# DOT graph for Graphviz
attest pipeline show --format dot --details | dot -Tpng > pipeline.png

# JSON export with timing
attest pipeline show --format json --with-timing > pipeline-analysis.json
```

#### `attest pipeline validate` - Validate Configuration

```bash
attest pipeline validate [OPTIONS]
```

##### Validation Levels
| Option | Description | Checks |
|--------|-------------|--------|
| (default) | Basic validation | Syntax, structure, dependencies |
| `--strict` | Strict validation | + Best practices, performance |
| `--security-check` | Security validation | + Security issues, vulnerabilities |
| `--schema-version VERSION` | Validate against schema version | Specific schema compliance |

##### Examples
```bash
# Basic validation
attest pipeline validate

# Comprehensive validation
attest pipeline validate --strict --security-check

# Validate specific file
attest pipeline validate --pipeline custom.yaml --strict

# Check against specific schema
attest pipeline validate --schema-version 0.2 --strict
```

#### `attest pipeline export` - Export to Other Formats

```bash
attest pipeline export --format FORMAT [OPTIONS]
```

##### Supported Formats
| Format | Description | Output File |
|--------|-------------|-------------|
| `docker-compose` | Docker Compose YAML | `docker-compose.yml` |
| `gitlab-ci` | GitLab CI YAML | `.gitlab-ci.yml` |
| `github-actions` | GitHub Actions workflow | `.github/workflows/ci.yml` |
| `azure-pipelines` | Azure DevOps pipelines | `azure-pipelines.yml` |
| `jenkins` | Jenkins Pipeline (Groovy) | `Jenkinsfile` |
| `tekton` | Tekton Pipeline | `tekton-pipeline.yaml` |
| `makefile` | GNU Makefile | `Makefile` |

##### Options
| Option | Description | Example |
|--------|-------------|---------|
| `-f, --format FORMAT` | Export format (required) | `--format github-actions` |
| `-o, --output FILE` | Output file path | `--output .github/workflows/ci.yml` |
| `-p, --pipeline FILE` | Pipeline file to export | `--pipeline custom.yaml` |
| `--with-attestation` | Include attestation metadata | `--with-attestation` |
| `--variables KEY=VALUE` | Set template variables | `--variables NODE_VERSION=18` |

##### Examples
```bash
# Export to GitHub Actions
attest pipeline export --format github-actions --output .github/workflows/ci.yml

# Export to GitLab CI with attestation
attest pipeline export --format gitlab-ci --with-attestation --output .gitlab-ci.yml

# Export with custom variables
attest pipeline export --format docker-compose \
  --variables NODE_VERSION=18,REGISTRY=my-registry.com \
  --output docker-compose.yml

# Export Jenkins pipeline
attest pipeline export --format jenkins --output Jenkinsfile
```

#### `attest pipeline generate` - Generate from Template

```bash
attest pipeline generate TEMPLATE [OPTIONS]
```

##### Available Templates
| Template | Description | Best For |
|----------|-------------|----------|
| `rust-project` | Rust application with Cargo | CLI tools, services |
| `node-project` | Node.js with npm/yarn | Web apps, APIs |
| `python-project` | Python with pip/poetry | Scripts, ML, APIs |
| `web-app` | Full-stack web application | Frontend + backend |
| `microservices` | Multi-service architecture | Distributed systems |
| `ml-pipeline` | Machine learning workflow | Data science, AI |
| `docker-build` | Container-focused build | Container applications |

##### Options
| Option | Description | Example |
|--------|-------------|---------|
| `-o, --output FILE` | Output pipeline file | `--output custom-pipeline.yaml` |
| `--var KEY=VALUE` | Set template variables | `--var app_name=myapp --var port=8080` |
| `--interactive` | Interactive template configuration | `--interactive` |

##### Examples
```bash
# Generate Rust project pipeline
attest pipeline generate rust-project --output attest.yaml

# Generate with custom variables
attest pipeline generate web-app \
  --var app_name=myapp \
  --var port=8080 \
  --var database=postgres \
  --output webapp-pipeline.yaml

# Interactive generation
attest pipeline generate microservices --interactive
```

## 8. Audit and Compliance Commands

### 8.1 `attest audit` - Audit Operations

Generate compliance reports and analyze execution history.

#### `attest audit report` - Generate Compliance Report

```bash
attest audit report [OPTIONS]
```

##### Output Formats
| Format | Description | Use Case |
|--------|-------------|----------|
| `json` | Structured JSON data | Programmatic processing |
| `html` | Interactive HTML report | Executive reporting |
| `pdf` | Professional PDF report | Compliance documentation |
| `csv` | Comma-separated values | Data analysis |
| `xml` | XML format | Integration with enterprise tools |

##### Compliance Frameworks
| Framework | Description | Standards |
|-----------|-------------|----------|
| `sox` | Sarbanes-Oxley Act | Financial compliance |
| `pci` | PCI DSS | Payment card security |
| `iso27001` | ISO 27001 | Information security |
| `nist` | NIST Cybersecurity Framework | US government standard |
| `cis` | CIS Controls | Security best practices |
| `gdpr` | GDPR compliance | Data protection |
| `hipaa` | HIPAA compliance | Healthcare data |

##### Options
| Option | Description | Example |
|--------|-------------|---------|
| `-f, --format FORMAT` | Output format | `--format html` |
| `--framework FRAMEWORK` | Compliance framework | `--framework sox` |
| `-o, --output FILE` | Output file path | `--output report.html` |
| `--detailed` | Include detailed step information | `--detailed` |
| `--period DAYS` | Report period in days | `--period 90` |
| `--failures-only` | Include only failed executions | `--failures-only` |

##### Examples
```bash
# Generate HTML compliance report
attest audit report --format html --output compliance_report.html

# SOX compliance report for last 90 days
attest audit report --framework sox --period 90 --detailed --output sox_q4.pdf

# Security failures analysis
attest audit report --format csv --failures-only --framework iso27001 --output security_failures.csv

# Comprehensive audit for multiple frameworks
attest audit report --format json --detailed --period 365 --output annual_audit.json
```

#### `attest audit history` - Show Execution History

```bash
attest audit history [OPTIONS]
```

##### Options
| Option | Description | Default |
|--------|-------------|---------|
| `-l, --limit N` | Maximum entries to show | `10` |
| `--pipeline PIPELINE` | Filter by pipeline name | All pipelines |
| `--signed-only` | Show only signed executions | `false` |
| `--failures-only` | Show only failed executions | `false` |
| `--format FORMAT` | Output format (table, json, csv) | `table` |
| `--since DATE` | Show executions since date | All time |
| `--until DATE` | Show executions until date | Now |

##### Examples
```bash
# Show last 20 executions
attest audit history --limit 20

# Show failures for specific pipeline
attest audit history --pipeline web-app --failures-only

# Export history as JSON
attest audit history --format json --limit 100 --output history.json

# Show signed executions from last month
attest audit history --signed-only --since "2024-11-01" --format csv

# Comprehensive history analysis
attest audit history --limit 1000 --format json --detailed --output full_history.json
```

#### `attest audit trace` - Trace Deployment Chain

```bash
attest audit trace --from HASH [OPTIONS]
```

##### Options
| Option | Description | Example |
|--------|-------------|---------|
| `-f, --from HASH` | Starting commit or build ID | `--from abc123def` |
| `-t, --to ENV` | Target environment or commit | `--to production` |
| `--detailed` | Show detailed trace information | `--detailed` |
| `--format FORMAT` | Output format (graph, json, table) | `--format graph` |
| `--with-signatures` | Include attestation signatures | `--with-signatures` |
| `--max-depth N` | Maximum trace depth | `--max-depth 10` |

##### Examples
```bash
# Trace from commit to production
attest audit trace --from abc123def --to production

# Detailed trace with signatures
attest audit trace --from abc123def --detailed --with-signatures --format json

# Visual trace graph
attest audit trace --from abc123def --format graph --output trace.dot
dot -Tpng trace.dot > deployment_trace.png

# Complete deployment chain analysis
attest audit trace --from abc123def --to production --detailed --with-signatures --max-depth 20
```

#### `attest audit analyze` - Analyze Compliance Metrics

```bash
attest audit analyze [OPTIONS]
```

##### Options
| Option | Description | Default |
|--------|-------------|---------|
| `--period DAYS` | Analysis period | `30` |
| `--trends` | Generate trend analysis | `false` |
| `-o, --output FILE` | Output analysis to file | stdout |
| `--format FORMAT` | Output format (json, yaml, table) | `table` |
| `--metrics METRICS` | Specific metrics to analyze | All metrics |

##### Examples
```bash
# Basic analysis for last 30 days
attest audit analyze

# Trend analysis with JSON output
attest audit analyze --period 90 --trends --format json --output trends.json

# Performance metrics analysis
attest audit analyze --period 60 --metrics performance,cache --output perf_analysis.yaml
```

## 9. GitOps Commands

### 9.1 `attest deploy` - GitOps Operations

Manage GitOps deployments with verification.

#### `attest deploy init` - Initialize GitOps

```bash
attest deploy init --repo URL --cluster CLUSTER [OPTIONS]
```

##### Options
| Option | Description | Example |
|--------|-------------|---------|
| `-r, --repo URL` | GitOps repository URL (required) | `--repo https://github.com/org/k8s-configs` |
| `-c, --cluster CLUSTER` | Target cluster name (required) | `--cluster production` |
| `--gitops-dir DIR` | Local GitOps directory path | `--gitops-dir .gitops` |
| `--branch BRANCH` | GitOps branch | `--branch main` |
| `--no-templates` | Skip creating sample deployment templates | `--no-templates` |
| `--force` | Force initialization | `--force` |

##### Examples
```bash
# Basic GitOps initialization
attest deploy init --repo https://github.com/myorg/k8s-configs --cluster production

# Advanced setup with custom branch
attest deploy init \
  --repo https://github.com/myorg/deployments \
  --cluster staging \
  --branch develop \
  --gitops-dir deployments

# Force reinit without templates
attest deploy init --repo https://github.com/myorg/k8s --cluster test --force --no-templates
```

#### `attest deploy apply` - Deploy with Verification

```bash
attest deploy apply --environment ENV [OPTIONS]
```

##### Options
| Option | Description | Example |
|--------|-------------|---------|
| `-e, --environment ENV` | Target environment (required) | `--environment staging` |
| `--verify-attestations` | Verify all attestations before deployment | `--verify-attestations` |
| `--dry-run` | Show what would be deployed | `--dry-run` |
| `--manifest FILE` | Specific manifest file to deploy | `--manifest app.yaml` |
| `--wait` | Wait for deployment to complete | `--wait` |
| `--timeout SECONDS` | Deployment timeout | `--timeout 600` |
| `--force` | Force deployment even if verification fails | `--force` |

##### Examples
```bash
# Deploy to staging with verification
attest deploy apply --environment staging --verify-attestations --wait

# Production deployment with timeout
attest deploy apply --environment production --verify-attestations --wait --timeout 1200

# Dry run to preview changes
attest deploy apply --environment staging --dry-run --verify-attestations

# Deploy specific manifest
attest deploy apply --environment dev --manifest k8s/webapp.yaml --wait
```

#### `attest deploy status` - Show Deployment Status

```bash
attest deploy status [OPTIONS]
```

##### Options
| Option | Description | Example |
|--------|-------------|---------|
| `-e, --environment ENV` | Filter by environment | `--environment production` |
| `--detailed` | Show detailed status information | `--detailed` |
| `--watch` | Watch for status changes | `--watch` |
| `--format FORMAT` | Output format (table, json, yaml) | `--format json` |

##### Examples
```bash
# Show all deployment status
attest deploy status

# Watch production environment
attest deploy status --environment production --watch --detailed

# Export status as JSON
attest deploy status --format json --detailed --output deployment_status.json
```

## 10. Policy Commands

### 10.1 `attest policy` - Policy Management

Manage and validate against security and compliance policies.

#### `attest policy check` - Validate Against Policies

```bash
attest policy check [OPTIONS]
```

##### Options
| Option | Description | Example |
|--------|-------------|---------|
| `-p, --policy-dir DIR` | Policy directory path | `--policy-dir .attest/policies` |
| `--policy POLICY` | Specific policy file to check | `--policy security.rego` |
| `--detailed` | Show detailed violation information | `--detailed` |
| `--fail-fast` | Fail on first policy violation | `--fail-fast` |
| `-o, --output FILE` | Output results to file | `--output policy_results.json` |
| `--format FORMAT` | Output format (json, yaml, table) | `--format json` |

##### Examples
```bash
# Check all policies
attest policy check

# Check specific security policy with details
attest policy check --policy security --detailed --format json

# Fail-fast mode for CI/CD
attest policy check --fail-fast --policy-dir .policies

# Generate policy compliance report
attest policy check --detailed --format json --output policy_compliance.json
```

#### `attest policy list` - List Available Policies

```bash
attest policy list [OPTIONS]
```

##### Options
| Option | Description | Example |
|--------|-------------|---------|
| `--detailed` | Show detailed policy information | `--detailed` |
| `--category CATEGORY` | Filter by policy category | `--category security` |
| `--format FORMAT` | Output format (table, json, yaml) | `--format yaml` |

##### Examples
```bash
# List all policies
attest policy list

# Show detailed security policies
attest policy list --category security --detailed

# Export policy catalog
attest policy list --detailed --format json --output policy_catalog.json
```

#### `attest policy install` - Install Policy Template

```bash
attest policy install POLICY [OPTIONS]
```

##### Available Policies
| Policy | Description | Category |
|--------|-------------|----------|
| `security` | Basic security policies | Security |
| `compliance` | General compliance rules | Compliance |
| `performance` | Performance optimization policies | Performance |
| `quality` | Code quality policies | Quality |
| `sox-compliance` | Sarbanes-Oxley compliance | Compliance |
| `pci-compliance` | PCI DSS compliance | Security |
| `gdpr-compliance` | GDPR compliance | Privacy |

##### Options
| Option | Description | Example |
|--------|-------------|---------|
| `--force` | Force installation even if policy exists | `--force` |
| `--target-dir DIR` | Installation directory | `--target-dir .policies` |
| `--interactive` | Customize policy parameters interactively | `--interactive` |

##### Examples
```bash
# Install security policies
attest policy install security

# Install with interactive customization
attest policy install sox-compliance --interactive

# Force reinstall to custom directory
attest policy install compliance --force --target-dir custom-policies
```

## 11. Maintenance Commands

### 11.1 `attest clean` - Clean Cache and Temporary Files

```bash
attest clean [OPTIONS]
```

##### Options
| Option | Description | Example |
|--------|-------------|---------|
| `--all` | Clean all cached data | `attest clean --all` |
| `--cache-only` | Clean only build cache | `attest clean --cache-only` |
| `--receipts-only` | Clean only old receipts | `attest clean --receipts-only` |
| `--older-than DAYS` | Clean files older than N days | `attest clean --older-than 30` |
| `--dry-run` | Show what would be cleaned | `attest clean --dry-run` |

##### Examples
```bash
# Clean everything
attest clean --all

# Clean cache only
attest clean --cache-only

# Clean old receipts (30 days+)
attest clean --receipts-only --older-than 30

# Preview cleanup
attest clean --all --dry-run
```

## 12. Configuration Commands

### 12.1 `attest config` - Configuration Management

#### `attest config show` - Display Configuration

```bash
attest config show [OPTIONS]
```

##### Options
| Option | Description | Example |
|--------|-------------|---------|
| `--format FORMAT` | Output format (yaml, json, table) | `--format json` |
| `--section SECTION` | Show specific section only | `--section cache` |

##### Examples
```bash
# Show all configuration
attest config show

# Show cache configuration as JSON
attest config show --section cache --format json
```

#### `attest config set` - Set Configuration Value

```bash
attest config set KEY VALUE
```

##### Examples
```bash
# Enable deterministic mode
attest config set deterministic true

# Set cache size limit
attest config set cache.max_size "5GB"

# Configure signing
attest config set signing.enabled true
```

#### `attest config get` - Get Configuration Value

```bash
attest config get KEY
```

##### Examples
```bash
# Get cache setting
attest config get cache.enabled

# Get signing configuration
attest config get signing.key_path
```

## 13. Key Management Commands

### 13.1 `attest keys` - Cryptographic Key Management

#### `attest keys generate` - Generate New Key Pair

```bash
attest keys generate [OPTIONS]
```

##### Options
| Option | Description | Example |
|--------|-------------|---------|
| `--algorithm ALGO` | Cryptographic algorithm | `--algorithm ed25519` |
| `--output-dir DIR` | Output directory for keys | `--output-dir .keys` |
| `--force` | Overwrite existing keys | `--force` |

##### Examples
```bash
# Generate Ed25519 key pair
attest keys generate

# Generate to custom directory
attest keys generate --output-dir team-keys --force
```

#### `attest keys export` - Export Public Key

```bash
attest keys export [OPTIONS]
```

##### Options
| Option | Description | Example |
|--------|-------------|---------|
| `--public` | Export public key | `--public` |
| `--format FORMAT` | Export format (pem, hex, json) | `--format pem` |
| `-o, --output FILE` | Output file | `--output public-key.pem` |

##### Examples
```bash
# Export public key as PEM
attest keys export --public --format pem --output team-public.pem

# Export as hex string
attest keys export --public --format hex
```

#### `attest keys import` - Import Public Key

```bash
attest keys import [OPTIONS] FILE
```

##### Options
| Option | Description | Example |
|--------|-------------|---------|
| `--public` | Import public key | `--public` |
| `--trust` | Mark key as trusted | `--trust` |
| `--name NAME` | Key identifier | `--name team-lead` |

##### Examples
```bash
# Import trusted public key
attest keys import --public --trust --name team-lead team-public.pem

# Import for verification only
attest keys import --public external-key.pem
```

## 14. Advanced Usage Patterns

### 14.1 Continuous Integration

```bash
#!/bin/bash
# CI pipeline script
set -euo pipefail

# Validate pipeline
attest pipeline validate --strict --security-check

# Run with full verification
attest run --verify --sign --parallel $(nproc) --format json --output ci-receipt.json

# Verify the result
attest verify ci-receipt.json --check-signatures --verbose-verify

# Generate compliance report
attest audit report --format json --detailed --output compliance.json

# Deploy if on main branch
if [ "$CI_COMMIT_REF_NAME" = "main" ]; then
  attest deploy apply --environment staging --verify-attestations --wait
fi
```

### 14.2 Production Deployment

```bash
#!/bin/bash
# Production deployment script
set -euo pipefail

RECEIPT_FILE="$1"
if [ -z "$RECEIPT_FILE" ]; then
  echo "Usage: $0 <receipt-file>"
  exit 1
fi

# Verify receipt thoroughly
attest verify "$RECEIPT_FILE" --check-signatures --trusted-only --verbose-verify

# Check compliance
attest policy check --detailed --fail-fast

# Deploy to production
attest deploy apply --environment production --verify-attestations --wait --timeout 1800

# Generate deployment report
attest audit report --framework sox --period 1 --detailed --output "deployment-report-$(date +%Y%m%d).pdf"
```

### 14.3 Batch Operations

```bash
#!/bin/bash
# Batch verify all receipts
find .attest/receipts -name "*.yaml" -print0 | \
while IFS= read -r -d '' receipt; do
  echo "Verifying $receipt"
  if attest verify "$receipt" --check-signatures; then
    echo "[OK] Valid: $receipt"
  else
    echo "[ERROR] Invalid: $receipt"
  fi
done

# Batch export pipelines
for format in github-actions gitlab-ci docker-compose; do
  echo "Exporting to $format"
  attest pipeline export --format "$format" --output "exports/$format"
done
```

### 14.4 Monitoring and Alerting

```bash
#!/bin/bash
# Monitoring script for cron

# Check for recent failures
FAILURES=$(attest audit history --failures-only --since "1 hour ago" --format json | jq length)

if [ "$FAILURES" -gt 0 ]; then
  echo "ALERT: $FAILURES pipeline failures in the last hour"
  attest audit history --failures-only --since "1 hour ago" --detailed
fi

# Check policy compliance
if ! attest policy check --fail-fast; then
  echo "ALERT: Policy violations detected"
  attest policy check --detailed --format json
fi

# Generate daily metrics
attest audit analyze --period 1 --format json --output "/metrics/attest-$(date +%Y%m%d).json"
```

## 15. Next Steps

Now that you've mastered the CLI:

1. **[Attestation & Signatures](attestation.md)** - Implement cryptographic security
2. **[Cache & Performance](cache-performance.md)** - Optimize your pipelines
3. **[GitOps & Kubernetes](gitops.md)** - Deploy to production securely
4. **[Practical Examples](examples.md)** - Real-world usage scenarios

---

**Ready to secure your builds?** -> [Attestation & Signatures](attestation.md)

**Want to optimize performance?** -> [Cache & Performance](cache-performance.md)