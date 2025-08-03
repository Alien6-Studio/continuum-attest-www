## 1. Overview

This section provides real-world examples of ATTEST implementations across different industries and use cases.

## 2. Web Application Pipeline

### Node.js Application

```yaml
# attest.yaml
version: "0.1"
name: "web-app"

steps:
  install:
    run: "npm ci"
    inputs: ["package.json", "package-lock.json"]
    outputs: ["node_modules/"]
    
  lint:
    run: "npm run lint"
    inputs: ["src/", ".eslintrc.js"]
    needs: ["install"]
    
  test:
    run: "npm test"
    inputs: ["src/", "test/", "jest.config.js"]
    outputs: ["coverage/"]
    needs: ["install"]
    
  build:
    run: "npm run build"
    inputs: ["src/", "public/", "webpack.config.js"]
    outputs: ["dist/"]
    needs: ["lint", "test"]
    
  docker-build:
    run: "docker build -t myapp:$BUILD_ID ."
    inputs: ["dist/", "Dockerfile"]
    outputs: ["docker-image:myapp:$BUILD_ID"]
    needs: ["build"]
```

## 3. Microservices Architecture

### Go Service

```yaml
# attest.yaml
version: "0.1"
name: "user-service"

env:
  GO_VERSION: "1.21"
  CGO_ENABLED: "0"

steps:
  deps:
    run: "go mod download"
    inputs: ["go.mod", "go.sum"]
    
  generate:
    run: "go generate ./..."
    inputs: ["internal/", "*.go"]
    outputs: ["generated/"]
    needs: ["deps"]
    
  test:
    run: "go test -v -race -coverprofile=coverage.out ./..."
    inputs: ["internal/", "cmd/", "*.go"]
    outputs: ["coverage.out"]
    needs: ["generate"]
    
  build:
    run: "go build -o bin/user-service cmd/main.go"
    inputs: ["internal/", "cmd/", "*.go"]
    outputs: ["bin/user-service"]
    needs: ["test"]
    
  security-scan:
    run: "gosec ./..."
    inputs: ["internal/", "cmd/", "*.go"]
    outputs: ["security-report.json"]
    needs: ["build"]
```

## 4. Machine Learning Pipeline

### Python ML Model

```yaml
# attest.yaml
version: "0.1"
name: "ml-model-training"

steps:
  data-validation:
    run: "python scripts/validate_data.py"
    inputs: ["data/raw/", "schemas/"]
    outputs: ["data/validated/"]
    
  feature-engineering:
    run: "python scripts/feature_engineering.py"
    inputs: ["data/validated/", "configs/features.yaml"]
    outputs: ["data/features/"]
    needs: ["data-validation"]
    
  model-training:
    run: "python scripts/train_model.py"
    inputs: ["data/features/", "configs/model.yaml"]
    outputs: ["models/", "metrics/"]
    needs: ["feature-engineering"]
    
  model-validation:
    run: "python scripts/validate_model.py"
    inputs: ["models/", "data/test/"]
    outputs: ["validation-report.json"]
    needs: ["model-training"]
    
  model-packaging:
    run: "python scripts/package_model.py"
    inputs: ["models/", "requirements.txt"]
    outputs: ["artifacts/model.tar.gz"]
    needs: ["model-validation"]
```

## 5. Infrastructure as Code

### Terraform Pipeline

```yaml
# attest.yaml
version: "0.1"
name: "infrastructure-deployment"

steps:
  terraform-init:
    run: "terraform init"
    inputs: ["*.tf", "terraform.tfvars"]
    outputs: [".terraform/"]
    
  terraform-plan:
    run: "terraform plan -out=tfplan"
    inputs: ["*.tf", "terraform.tfvars", ".terraform/"]
    outputs: ["tfplan"]
    needs: ["terraform-init"]
    
  terraform-validate:
    run: "terraform validate"
    inputs: ["*.tf"]
    needs: ["terraform-init"]
    
  security-scan:
    run: "tfsec . --format json --out tfsec-report.json"
    inputs: ["*.tf"]
    outputs: ["tfsec-report.json"]
    needs: ["terraform-validate"]
    
  terraform-apply:
    run: "terraform apply tfplan"
    inputs: ["tfplan"]
    outputs: ["terraform.tfstate"]
    needs: ["terraform-plan", "security-scan"]
```

## 6. Mobile Application

### React Native App

```yaml
# attest.yaml
version: "0.1"
name: "mobile-app"

environments:
  ios:
    env:
      PLATFORM: "ios"
      XCODE_VERSION: "15.0"
  android:
    env:
      PLATFORM: "android"
      ANDROID_API_LEVEL: "34"

steps:
  install:
    run: "npm ci && cd ios && pod install"
    inputs: ["package.json", "package-lock.json", "ios/Podfile"]
    outputs: ["node_modules/", "ios/Pods/"]
    
  test:
    run: "npm test"
    inputs: ["src/", "__tests__/"]
    needs: ["install"]
    
  lint:
    run: "npm run lint"
    inputs: ["src/", ".eslintrc.js"]
    needs: ["install"]
    
  build-ios:
    run: "npx react-native build-ios --mode Release"
    inputs: ["src/", "ios/", "node_modules/"]
    outputs: ["ios/build/"]
    needs: ["test", "lint"]
    env:
      match: "ios"
      
  build-android:
    run: "npx react-native build-android --mode Release"
    inputs: ["src/", "android/", "node_modules/"]
    outputs: ["android/app/build/"]
    needs: ["test", "lint"]
    env:
      match: "android"
```

## 7. Database Migration

### Database Schema Changes

```yaml
# attest.yaml
version: "0.1"
name: "database-migration"

steps:
  schema-validation:
    run: "dbmate validate"
    inputs: ["db/migrations/"]
    
  dry-run:
    run: "dbmate --dry-run migrate"
    inputs: ["db/migrations/"]
    outputs: ["migration-plan.sql"]
    needs: ["schema-validation"]
    
  backup:
    run: "pg_dump $DATABASE_URL > backup.sql"
    outputs: ["backup.sql"]
    needs: ["dry-run"]
    
  migrate:
    run: "dbmate migrate"
    inputs: ["db/migrations/"]
    needs: ["backup"]
    
  verify:
    run: "python scripts/verify_migration.py"
    inputs: ["tests/migration/"]
    needs: ["migrate"]
```

## 8. Multi-Language Monorepo

### Full-Stack Application

```yaml
# attest.yaml
version: "0.1"
name: "fullstack-monorepo"

steps:
  # Frontend (React)
  frontend-install:
    run: "cd frontend && npm ci"
    inputs: ["frontend/package.json", "frontend/package-lock.json"]
    outputs: ["frontend/node_modules/"]
    
  frontend-test:
    run: "cd frontend && npm test"
    inputs: ["frontend/src/", "frontend/__tests__/"]
    needs: ["frontend-install"]
    
  frontend-build:
    run: "cd frontend && npm run build"
    inputs: ["frontend/src/", "frontend/public/"]
    outputs: ["frontend/dist/"]
    needs: ["frontend-test"]
    
  # Backend (Python)
  backend-install:
    run: "cd backend && pip install -r requirements.txt"
    inputs: ["backend/requirements.txt"]
    outputs: ["backend/.venv/"]
    
  backend-test:
    run: "cd backend && python -m pytest"
    inputs: ["backend/src/", "backend/tests/"]
    needs: ["backend-install"]
    
  backend-build:
    run: "cd backend && python setup.py sdist"
    inputs: ["backend/src/", "backend/setup.py"]
    outputs: ["backend/dist/"]
    needs: ["backend-test"]
    
  # Integration
  integration-test:
    run: "docker-compose -f docker-compose.test.yml up --abort-on-container-exit"
    inputs: ["frontend/dist/", "backend/dist/", "docker-compose.test.yml"]
    needs: ["frontend-build", "backend-build"]
    
  # Deployment
  docker-build:
    run: "docker build -t fullstack-app:$BUILD_ID ."
    inputs: ["frontend/dist/", "backend/dist/", "Dockerfile"]
    outputs: ["docker-image:fullstack-app:$BUILD_ID"]
    needs: ["integration-test"]
```

## 9. Compliance-Heavy Environment

### Financial Services

```yaml
# attest.yaml
version: "0.1"
name: "trading-system"

attestation:
  sign_all_steps: true
  require_reproducible: true
  
verification:
  enabled: true
  policy: "Strict"
  trusted_keys: ["fintech-ci-key"]
  
steps:
  compliance-check:
    run: "python scripts/compliance_check.py"
    inputs: ["src/", "compliance/rules.yaml"]
    outputs: ["compliance-report.json"]
    
  security-scan:
    run: "bandit -r src/ -f json -o security-report.json"
    inputs: ["src/"]
    outputs: ["security-report.json"]
    
  dependency-audit:
    run: "safety check --json --output audit-report.json"
    inputs: ["requirements.txt"]
    outputs: ["audit-report.json"]
    
  test:
    run: "python -m pytest --junitxml=test-results.xml"
    inputs: ["src/", "tests/"]
    outputs: ["test-results.xml", "coverage.xml"]
    needs: ["compliance-check", "security-scan"]
    
  build:
    run: "python setup.py sdist bdist_wheel"
    inputs: ["src/", "setup.py"]
    outputs: ["dist/"]
    needs: ["test", "dependency-audit"]
    
  artifact-signing:
    run: "gpg --armor --detach-sig dist/*.whl"
    inputs: ["dist/"]
    outputs: ["dist/*.asc"]
    needs: ["build"]
```

## 10. Performance-Critical Pipeline

### High-Frequency Trading System

```yaml
# attest.yaml
version: "0.1"
name: "hft-system"

cache:
  enabled: true
  max_size: "100GB"
  compression: true

steps:
  benchmark-baseline:
    run: "cargo bench --output-format json > baseline.json"
    inputs: ["src/", "benches/"]
    outputs: ["baseline.json"]
    
  optimize-build:
    run: "cargo build --release --target x86_64-unknown-linux-gnu"
    inputs: ["src/", "Cargo.toml", "Cargo.lock"]
    outputs: ["target/release/"]
    
  performance-test:
    run: "cargo bench --output-format json > results.json"
    inputs: ["target/release/", "benches/"]
    outputs: ["results.json"]
    needs: ["optimize-build"]
    
  performance-analysis:
    run: "python scripts/analyze_performance.py baseline.json results.json"
    inputs: ["baseline.json", "results.json"]
    outputs: ["performance-report.html"]
    needs: ["benchmark-baseline", "performance-test"]
    
  latency-test:
    run: "./scripts/latency_test.sh"
    inputs: ["target/release/"]
    outputs: ["latency-results.json"]
    needs: ["optimize-build"]
```

## 11. Best Practices by Industry

### Healthcare (HIPAA)

```yaml
# Healthcare-specific considerations
attestation:
  sign_all_steps: true
  encryption_at_rest: true
  
verification:
  policy_validation:
    enabled: true
    compliance_frameworks: ["HIPAA", "SOC2"]
    
steps:
  phi-scan:
    run: "python scripts/scan_phi.py"
    inputs: ["src/", "data/"]
    outputs: ["phi-report.json"]
    
  # Regular pipeline steps...
```

### Automotive (ISO 26262)

```yaml
# Automotive safety-critical systems
attestation:
  safety_level: "ASIL-D"
  require_reproducible: true
  
verification:
  functional_safety: true
  
steps:
  safety-analysis:
    run: "safety_analyzer --standard ISO26262"
    inputs: ["src/", "safety/requirements.xml"]
    outputs: ["safety-report.xml"]
```

### Aerospace (DO-178C)

```yaml
# Aerospace software development
attestation:
  certification_level: "DAL-A"
  traceability: true
  
steps:
  requirements-tracing:
    run: "trace_requirements.py"
    inputs: ["requirements/", "src/"]
    outputs: ["traceability-matrix.html"]
    
  formal-verification:
    run: "cbmc src/critical_functions.c"
    inputs: ["src/critical_functions.c"]
    outputs: ["verification-results.xml"]
```

These examples demonstrate ATTEST's flexibility across different domains while maintaining security and compliance requirements.