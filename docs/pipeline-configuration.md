## 1. Complete Pipeline Reference

This guide covers everything you need to know about configuring ATTEST pipelines, from basic setups to advanced enterprise configurations.

## 2. Basic Structure

### 2.1 Minimal Pipeline

```yaml
version: "0.1"
name: "basic-pipeline"

steps:
  build:
    run: "make build"
```

### 2.2 Complete Pipeline Template

```yaml
version: "0.1"                    # Required: Schema version
name: "comprehensive-pipeline"    # Optional: Human-readable name
description: "Full-featured pipeline example"

# Global environment variables
env:
  NODE_ENV: production
  RUST_BACKTRACE: 1
  CUSTOM_VAR: "global-value"

# Global attestation configuration
attestation:
  sign_all_steps: true           # Sign every step
  verify_dependencies: true      # Verify input integrity
  require_reproducible: false    # Global reproducibility requirement

# Pipeline steps
steps:
  step_name:
    # REQUIRED: Command to execute
    run: "npm run build"
    
    # OPTIONAL: Files this step reads
    inputs: ["src/", "package.json"]
    
    # OPTIONAL: Files this step produces
    outputs: ["dist/", "build.log"]
    
    # OPTIONAL: Steps that must complete first
    needs: ["lint", "test"]
    
    # OPTIONAL: Step-specific environment
    env:
      NODE_ENV: development
      STEP_SPECIFIC: "value"
    
    # OPTIONAL: Working directory
    working_dir: "frontend/"
    
    # OPTIONAL: Docker image for execution
    image: "node:18-alpine"
    
    # OPTIONAL: Enable/disable caching
    cache: true
    
    # OPTIONAL: Timeout in seconds
    timeout_secs: 300
    
    # OPTIONAL: Isolation level
    isolation: container
    
    # OPTIONAL: Step-specific attestation
    attestation:
      type: "build"
      reproducible: true
      generate_slsa: true
```

## 3. Step Configuration

### 3.1 Command Execution

#### Simple Commands
```yaml
steps:
  build:
    run: "npm run build"
  
  test:
    run: "cargo test --all"
  
  deploy:
    run: "./scripts/deploy.sh production"
```

#### Multi-line Commands
```yaml
steps:
  complex_build:
    run: |
      echo "Starting build process..."
      npm ci
      npm run lint
      npm run test
      npm run build
      echo "Build completed successfully"
  
  conditional_step:
    run: |
      if [ "$NODE_ENV" = "production" ]; then
        npm run build:prod
      else
        npm run build:dev
      fi
```

#### Shell-specific Commands
```yaml
steps:
  bash_script:
    run: |
      #!/bin/bash
      set -euo pipefail
      source .env
      ./complex-script.sh
  
  powershell_script:
    run: |
      # PowerShell script
      $ErrorActionPreference = "Stop"
      Write-Host "Building application..."
      npm run build
```

### 3.2 Input and Output Management

#### File Patterns
```yaml
steps:
  comprehensive_io:
    inputs:
      - "src/**/*.js"           # Glob patterns
      - "package.json"          # Specific files
      - "config/"               # Directories
      - "assets/images/*.png"   # Nested patterns
      - "docs/*.md"             # Documentation
    outputs:
      - "dist/"                 # Build artifacts
      - "coverage/"             # Test coverage
      - "logs/*.log"            # Log files
      - "reports/junit.xml"     # Test reports
```

#### Optional Inputs
```yaml
steps:
  flexible_step:
    inputs:
      - "src/"                  # Required
      - "config.json?"          # Optional (? suffix)
      - "local-overrides.yaml?" # Optional configuration
```

#### Dynamic Outputs
```yaml
steps:
  dynamic_build:
    run: |
      VERSION=$(cat package.json | jq -r .version)
      npm run build
      tar -czf "app-${VERSION}.tar.gz" dist/
    outputs:
      - "dist/"
      - "app-*.tar.gz"          # Pattern matches dynamic names
```

### 3.3 Dependencies and Execution Order

#### Linear Dependencies
```yaml
steps:
  install:
    run: "npm ci"
  
  lint:
    run: "npm run lint"
    needs: ["install"]
  
  test:
    run: "npm test"
    needs: ["install"]
  
  build:
    run: "npm run build"
    needs: ["lint", "test"]     # Waits for both
```

#### Parallel Execution
```yaml
steps:
  # These run in parallel
  frontend_build:
    run: "npm run build:frontend"
    inputs: ["frontend/"]
    outputs: ["dist/frontend/"]
  
  backend_build:
    run: "cargo build --release"
    inputs: ["backend/"]
    outputs: ["target/release/"]
  
  docs_build:
    run: "mdbook build"
    inputs: ["docs/"]
    outputs: ["book/"]
  
  # This waits for all builds
  integration:
    run: "./scripts/integration-test.sh"
    needs: ["frontend_build", "backend_build", "docs_build"]
```

#### Complex DAG
```yaml
steps:
  # Level 1: Independent steps
  lint_js:
    run: "eslint src/"
  
  lint_rust:
    run: "cargo clippy"
  
  unit_test_js:
    run: "npm test:unit"
  
  unit_test_rust:
    run: "cargo test"
  
  # Level 2: Language-specific builds
  build_js:
    run: "npm run build"
    needs: ["lint_js", "unit_test_js"]
  
  build_rust:
    run: "cargo build --release"
    needs: ["lint_rust", "unit_test_rust"]
  
  # Level 3: Integration tests
  integration_test:
    run: "./scripts/integration-test.sh"
    needs: ["build_js", "build_rust"]
  
  # Level 4: Deployment
  deploy:
    run: "./scripts/deploy.sh"
    needs: ["integration_test"]
```

## 4. Environment Configuration

### 4.1 Global Environment
```yaml
env:
  # Build configuration
  NODE_ENV: production
  RUST_BACKTRACE: 1
  PYTHONPATH: "/app/src"
  
  # Credentials (use secrets management)
  API_URL: "https://api.production.com"
  REGISTRY_URL: "registry.company.com"
  
  # Tool configuration
  CARGO_TERM_COLOR: always
  NPM_CONFIG_CACHE: ".attest/cache/npm"
  PIP_CACHE_DIR: ".attest/cache/pip"
```

### 4.2 Step-specific Environment
```yaml
steps:
  test:
    run: "npm test"
    env:
      NODE_ENV: test            # Override global
      CI: "true"                # Test-specific
      COVERAGE: "true"          # Enable coverage
  
  build:
    run: "npm run build"
    env:
      NODE_ENV: production      # Production build
      OPTIMIZE: "true"          # Enable optimizations
      SOURCE_MAPS: "false"      # Disable source maps
```

### 4.3 Dynamic Environment
```yaml
steps:
  dynamic_env:
    run: |
      export VERSION=$(cat package.json | jq -r .version)
      export BUILD_DATE=$(date -u +%Y-%m-%dT%H:%M:%SZ)
      npm run build
    env:
      # Static environment
      NODE_ENV: production
      # Dynamic variables set in script
```

## 5. Container Integration

### 5.1 Basic Container Usage
```yaml
steps:
  build:
    run: "npm run build"
    image: "node:18-alpine"     # Official Node.js image
    inputs: ["package.json", "src/"]
    outputs: ["dist/"]
```

### 5.2 Custom Container Configuration
```yaml
steps:
  advanced_container:
    run: "cargo build --release"
    image: "rust:1.75-bullseye"
    container:
      # Container-specific configuration
      working_dir: "/workspace"
      user: "1000:1000"         # Run as specific user
      memory_limit: "4GB"       # Memory constraint
      cpu_limit: "2.0"          # CPU constraint
      networks:
        - "build-network"       # Custom network
      volumes:
        - "/cache:/cache:rw"    # Additional volumes
      environment:
        CARGO_HOME: "/cache/cargo"
```

### 5.3 Multi-stage Container Builds
```yaml
steps:
  prepare:
    run: "npm ci"
    image: "node:18-alpine"
    outputs: ["node_modules/"]
  
  build:
    run: "npm run build"
    image: "node:18-alpine"
    needs: ["prepare"]
    inputs: ["node_modules/", "src/"]
    outputs: ["dist/"]
  
  package:
    run: |
      FROM nginx:alpine
      COPY dist/ /usr/share/nginx/html/
    image: "docker:dind"        # Docker-in-Docker
    needs: ["build"]
    inputs: ["dist/"]
    outputs: ["app-image.tar"]
```

## 6. Performance Optimization

### 6.1 Caching Strategies

#### Enable Caching
```yaml
steps:
  expensive_build:
    run: "cargo build --release"
    cache: true                 # Enable caching (default)
    inputs: ["src/", "Cargo.toml", "Cargo.lock"]
    outputs: ["target/release/"]
```

#### Disable Caching
```yaml
steps:
  always_run:
    run: "deploy.sh"
    cache: false               # Always execute
  
  timestamp_dependent:
    run: "echo $(date) > build-time.txt"
    cache: false               # Non-deterministic
```

#### Cache Configuration
```yaml
# Global cache settings
cache:
  enabled: true
  max_size: "10GB"
  compression: true
  retention_days: 30
  
steps:
  cached_step:
    run: "expensive-operation"
    cache:
      enabled: true
      key_suffix: "v2"         # Cache versioning
      max_age: "7d"            # Cache expiration
```

### 6.2 Parallel Execution
```yaml
steps:
  # These run in parallel automatically
  lint_frontend:
    run: "eslint frontend/"
    inputs: ["frontend/"]
  
  lint_backend:
    run: "cargo clippy"
    inputs: ["backend/"]
  
  lint_docs:
    run: "markdownlint docs/"
    inputs: ["docs/"]
  
  # Explicit parallelization
  test_matrix:
    run: |
      # Run multiple test suites in parallel
      npm run test:unit &
      npm run test:integration &
      npm run test:e2e &
      wait  # Wait for all background jobs
```

### 6.3 Resource Management
```yaml
steps:
  resource_intensive:
    run: "cargo build --release"
    timeout_secs: 1800         # 30 minutes max
    container:
      memory_limit: "8GB"      # Ensure enough memory
      cpu_limit: "4.0"         # Use 4 CPU cores
    
  memory_efficient:
    run: "npm run build"
    container:
      memory_limit: "1GB"      # Limit memory usage
    env:
      NODE_OPTIONS: "--max-old-space-size=768"  # Node.js memory limit
```

## 7. Security Configuration

### 7.1 Attestation Settings

#### Global Attestation
```yaml
attestation:
  sign_all_steps: true         # Sign every step
  verify_dependencies: true    # Verify all inputs
  require_reproducible: true   # Enforce reproducibility
```

#### Step-specific Attestation
```yaml
steps:
  critical_build:
    run: "cargo build --release"
    attestation:
      type: "build"            # Attestation type
      reproducible: true       # Must be reproducible
      generate_slsa: true      # Generate SLSA metadata
      verify_chain: true       # Verify dependency chain
  
  deployment:
    run: "kubectl apply -f k8s/"
    attestation:
      type: "deploy"
      verify_chain: true       # Verify entire build chain
      require_signatures: true # All dependencies must be signed
```

### 7.2 Isolation Levels
```yaml
steps:
  # Process isolation (default, fastest)
  quick_test:
    run: "npm test"
    isolation: process
  
  # Container isolation (good security/performance balance)
  build:
    run: "cargo build"
    isolation: container
    image: "rust:1.75-alpine"
  
  # VM isolation (maximum security, slower)
  security_scan:
    run: "security-scanner"
    isolation: vm
    vm_image: "ubuntu-22.04"
```

### 7.3 Secrets Management
```yaml
steps:
  deploy:
    run: |
      # Use external secrets management
      kubectl create secret generic app-secrets \
        --from-literal=api-key="$API_KEY" \
        --from-literal=db-password="$DB_PASSWORD"
    env:
      # Reference secrets (managed externally)
      API_KEY: "${VAULT_API_KEY}"
      DB_PASSWORD: "${VAULT_DB_PASSWORD}"
```

## 8. Monitoring and Observability

### 8.1 Health Checks
```yaml
steps:
  web_service:
    run: |
      npm start &
      SERVER_PID=$!
      
      # Wait for service to start
      sleep 10
      
      # Health check
      curl -f http://localhost:3000/health
      
      # Cleanup
      kill $SERVER_PID
```

### 8.2 Metrics Collection
```yaml
steps:
  instrumented_build:
    run: |
      # Collect build metrics
      start_time=$(date +%s)
      
      cargo build --release
      
      end_time=$(date +%s)
      duration=$((end_time - start_time))
      
      # Report metrics
      echo "build_duration_seconds: $duration" >> metrics.txt
    outputs: ["target/release/", "metrics.txt"]
```

### 8.3 Logging Configuration
```yaml
steps:
  verbose_step:
    run: |
      # Structured logging
      echo '{"level":"info","message":"Starting build","timestamp":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'"}'
      
      npm run build 2>&1 | while read line; do
        echo '{"level":"info","message":"'$line'","component":"build"}'
      done
      
      echo '{"level":"info","message":"Build completed","timestamp":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'"}'
```

## 9. Advanced Patterns

### 9.1 Conditional Execution
```yaml
steps:
  conditional_deploy:
    run: |
      # Only deploy if on main branch
      if [ "$GIT_BRANCH" = "main" ]; then
        echo "Deploying to production..."
        ./scripts/deploy-prod.sh
      else
        echo "Skipping deployment (not on main branch)"
      fi
    env:
      GIT_BRANCH: "${CI_COMMIT_REF_NAME:-dev}"
```

### 9.2 Matrix Builds
```yaml
steps:
  test_matrix:
    run: |
      # Test multiple Node.js versions
      for version in 16 18 20; do
        echo "Testing with Node.js $version"
        docker run --rm -v $(pwd):/app node:$version-alpine sh -c "
          cd /app
          npm ci
          npm test
        "
      done
```

### 9.3 Dynamic Step Generation
```yaml
steps:
  discover_services:
    run: |
      # Discover services to build
      find services/ -name "Dockerfile" -exec dirname {} \; > services.txt
    outputs: ["services.txt"]
  
  build_services:
    run: |
      # Build each discovered service
      while read service; do
        echo "Building $service"
        docker build -t $(basename $service) $service/
      done < services.txt
    needs: ["discover_services"]
    inputs: ["services.txt", "services/"]
```

### 9.4 Error Handling
```yaml
steps:
  robust_step:
    run: |
      # Set error handling
      set -euo pipefail
      
      # Retry logic
      for i in {1..3}; do
        if npm run build; then
          echo "Build succeeded on attempt $i"
          break
        else
          echo "Build failed on attempt $i"
          if [ $i -eq 3 ]; then
            echo "All build attempts failed"
            exit 1
          fi
          sleep $((i * 10))  # Exponential backoff
        fi
      done
      
      # Cleanup on success
      trap 'echo "Cleaning up..."; rm -f temp-files.*' EXIT
```

## 10. Pipeline Templates

### 10.1 Microservices Template
```yaml
version: "0.1"
name: "microservices-pipeline"

env:
  DOCKER_REGISTRY: "registry.company.com"
  NAMESPACE: "production"

steps:
  # Discover all microservices
  discover:
    run: |
      find services/ -name "Dockerfile" -exec dirname {} \; | sort > services.list
    outputs: ["services.list"]
  
  # Build all services in parallel
  build_services:
    run: |
      # Read services list and build each
      while read service; do
        echo "Building $service"
        SERVICE_NAME=$(basename $service)
        docker build -t ${DOCKER_REGISTRY}/${SERVICE_NAME}:${BUILD_VERSION:-latest} $service/
        docker push ${DOCKER_REGISTRY}/${SERVICE_NAME}:${BUILD_VERSION:-latest}
      done < services.list
    needs: ["discover"]
    inputs: ["services.list", "services/"]
    outputs: ["build-manifest.json"]
    
  # Run tests for all services
  test_services:
    run: |
      while read service; do
        echo "Testing $service"
        cd $service
        if [ -f "package.json" ]; then
          npm test
        elif [ -f "Cargo.toml" ]; then
          cargo test
        fi
        cd ..
      done < services.list
    needs: ["discover"]
    inputs: ["services.list", "services/"]
    
  # Deploy all services
  deploy_services:
    run: |
      while read service; do
        SERVICE_NAME=$(basename $service)
        kubectl set image deployment/${SERVICE_NAME} \
          ${SERVICE_NAME}=${DOCKER_REGISTRY}/${SERVICE_NAME}:${BUILD_VERSION:-latest} \
          --namespace=${NAMESPACE}
      done < services.list
    needs: ["build_services", "test_services"]
    inputs: ["services.list"]
```

### 10.2 Web Application Template
```yaml
version: "0.1"
name: "web-app-pipeline"

env:
  NODE_ENV: production
  BUILD_PATH: "dist"
  PUBLIC_URL: "https://app.company.com"

steps:
  # Install dependencies
  install:
    run: "npm ci"
    inputs: ["package.json", "package-lock.json"]
    outputs: ["node_modules/"]
    cache: true
    
  # Code quality checks
  lint:
    run: |
      npm run lint:js
      npm run lint:css
      npm run lint:html
    needs: ["install"]
    inputs: ["src/", "node_modules/"]
    
  # Type checking (if using TypeScript)
  typecheck:
    run: "npm run typecheck"
    needs: ["install"]
    inputs: ["src/", "tsconfig.json", "node_modules/"]
    
  # Unit tests
  test_unit:
    run: "npm run test:unit -- --coverage"
    needs: ["install"]
    inputs: ["src/", "tests/unit/", "node_modules/"]
    outputs: ["coverage/"]
    
  # Integration tests
  test_integration:
    run: "npm run test:integration"
    needs: ["install"]
    inputs: ["src/", "tests/integration/", "node_modules/"]
    
  # Build application
  build:
    run: "npm run build"
    needs: ["lint", "typecheck", "test_unit"]
    inputs: ["src/", "public/", "node_modules/"]
    outputs: ["dist/"]
    env:
      GENERATE_SOURCEMAP: "false"
      
  # End-to-end tests
  test_e2e:
    run: |
      # Start local server
      npm run serve &
      SERVER_PID=$!
      
      # Wait for server
      sleep 10
      
      # Run E2E tests
      npm run test:e2e
      
      # Cleanup
      kill $SERVER_PID
    needs: ["build"]
    inputs: ["dist/", "tests/e2e/", "node_modules/"]
    
  # Security audit
  audit:
    run: |
      npm audit --audit-level high
      npm run security:scan
    needs: ["build"]
    inputs: ["package-lock.json", "dist/"]
    
  # Performance testing
  perf_test:
    run: |
      # Lighthouse CI
      npm run lighthouse -- --upload
      
      # Bundle analysis
      npm run analyze
    needs: ["build"]
    inputs: ["dist/"]
    outputs: ["lighthouse-report.json", "bundle-analysis.json"]
    
  # Package for deployment
  package:
    run: |
      # Create deployment package
      tar -czf web-app-${BUILD_VERSION:-$(date +%Y%m%d-%H%M%S)}.tar.gz -C dist .
      
      # Generate deployment manifest
      cat > deployment-manifest.json << EOF
      {
        "version": "${BUILD_VERSION:-latest}",
        "build_date": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
        "commit": "${GIT_COMMIT:-unknown}",
        "files": $(find dist -type f | wc -l)
      }
      EOF
    needs: ["test_integration", "test_e2e", "audit", "perf_test"]
    inputs: ["dist/"]
    outputs: ["*.tar.gz", "deployment-manifest.json"]
```

### 10.3 Machine Learning Pipeline Template
```yaml
version: "0.1"
name: "ml-pipeline"

env:
  PYTHON_VERSION: "3.9"
  CUDA_VERSION: "11.8"
  MLFLOW_TRACKING_URI: "https://mlflow.company.com"

steps:
  # Setup environment
  setup:
    run: |
      python -m venv venv
      source venv/bin/activate
      pip install -r requirements.txt
    inputs: ["requirements.txt"]
    outputs: ["venv/"]
    cache: true
    
  # Data validation
  validate_data:
    run: |
      source venv/bin/activate
      python scripts/validate_data.py --input data/raw/ --output data/validated/
    needs: ["setup"]
    inputs: ["data/raw/", "scripts/validate_data.py", "venv/"]
    outputs: ["data/validated/", "data_validation_report.json"]
    
  # Feature engineering
  feature_engineering:
    run: |
      source venv/bin/activate
      python scripts/feature_engineering.py \
        --input data/validated/ \
        --output data/features/ \
        --config config/features.yaml
    needs: ["validate_data"]
    inputs: ["data/validated/", "scripts/feature_engineering.py", "config/features.yaml", "venv/"]
    outputs: ["data/features/", "feature_importance.json"]
    
  # Model training
  train:
    run: |
      source venv/bin/activate
      python scripts/train_model.py \
        --data data/features/ \
        --config config/model.yaml \
        --output models/
    needs: ["feature_engineering"]
    inputs: ["data/features/", "scripts/train_model.py", "config/model.yaml", "venv/"]
    outputs: ["models/", "training_metrics.json"]
    image: "tensorflow/tensorflow:2.13.0-gpu"  # GPU support
    container:
      memory_limit: "16GB"
      
  # Model evaluation
  evaluate:
    run: |
      source venv/bin/activate
      python scripts/evaluate_model.py \
        --model models/best_model.pkl \
        --test-data data/test/ \
        --output evaluation/
    needs: ["train"]
    inputs: ["models/", "data/test/", "scripts/evaluate_model.py", "venv/"]
    outputs: ["evaluation/", "model_performance.json"]
    
  # Model validation
  validate_model:
    run: |
      source venv/bin/activate
      python scripts/validate_model.py \
        --model models/best_model.pkl \
        --threshold 0.85 \
        --metrics evaluation/model_performance.json
    needs: ["evaluate"]
    inputs: ["models/", "evaluation/", "scripts/validate_model.py", "venv/"]
    
  # Package model
  package_model:
    run: |
      source venv/bin/activate
      
      # Create model package
      python scripts/package_model.py \
        --model models/best_model.pkl \
        --output dist/model-${MODEL_VERSION:-$(date +%Y%m%d-%H%M%S)}.tar.gz
      
      # Generate model card
      python scripts/generate_model_card.py \
        --model models/best_model.pkl \
        --metrics evaluation/model_performance.json \
        --output dist/model_card.json
    needs: ["validate_model"]
    inputs: ["models/", "evaluation/", "scripts/", "venv/"]
    outputs: ["dist/"]
```

## 11. Pipeline Validation

### 11.1 Validation Levels

```bash
# Basic validation (syntax and structure)
attest pipeline validate

# Strict validation (includes best practices)
attest pipeline validate --strict

# Security validation (checks for security issues)
attest pipeline validate --strict --security-check

# Custom validation with specific rules
attest pipeline validate --rules custom-rules.yaml
```

### 11.2 Validation Rules

```yaml
# custom-rules.yaml
validation_rules:
  # Require specific attestation for production
  - name: "production-attestation"
    condition: "env.NODE_ENV == 'production'"
    requirement: "attestation.sign_all_steps == true"
    severity: "error"
    message: "Production builds must be signed"
    
  # Warn about missing cache
  - name: "cache-optimization"
    condition: "step.run contains 'npm ci' or step.run contains 'cargo build'"
    requirement: "step.cache == true"
    severity: "warning"
    message: "Consider enabling cache for expensive operations"
    
  # Require timeout for long-running steps
  - name: "timeout-requirement"
    condition: "step.run contains 'test' or step.run contains 'build'"
    requirement: "step.timeout_secs != null"
    severity: "info"
    message: "Consider setting timeout for reliability"
```

### 11.3 Common Validation Errors

#### Circular Dependencies
```yaml
#  This will fail validation
steps:
  step_a:
    needs: ["step_b"]
  step_b:
    needs: ["step_a"]  # Circular dependency!
```

#### Missing Dependencies
```yaml
#  This will fail validation
steps:
  build:
    needs: ["nonexistent_step"]  # Step doesn't exist!
```

#### Invalid File Patterns
```yaml
#  Absolute paths not allowed
steps:
  build:
    inputs: ["/absolute/path"]     # Invalid!
    outputs: ["C:\\Windows\\"]      # Invalid!
```

#### Resource Conflicts
```yaml
#  This may cause issues
steps:
  step_a:
    outputs: ["shared/"]
  step_b:
    outputs: ["shared/"]  # Both write to same directory
```

## 12. Best Practices

### 12.1 Design Principles

1. **Single Responsibility**: Each step should do one thing well
```yaml
#  Good: Focused steps
steps:
  lint: { run: "npm run lint" }
  test: { run: "npm test" }
  build: { run: "npm run build" }

#  Bad: Monolithic step
steps:
  everything:
    run: |
      npm run lint
      npm test
      npm run build
      npm run deploy
```

2. **Minimize Dependencies**: Reduce coupling between steps
```yaml
#  Good: Independent steps can run in parallel
steps:
  lint_js: { run: "eslint src/" }
  lint_css: { run: "stylelint styles/" }
  test_unit: { run: "npm run test:unit" }
  
  build:
    needs: ["lint_js", "lint_css", "test_unit"]

#  Bad: Unnecessary linear dependencies
steps:
  lint_js: { run: "eslint src/" }
  lint_css: 
    run: "stylelint styles/"
    needs: ["lint_js"]  # Unnecessary dependency!
```

3. **Explicit Inputs/Outputs**: Be specific about file dependencies
```yaml
#  Good: Explicit file tracking
steps:
  build:
    inputs: ["src/", "package.json", "webpack.config.js"]
    outputs: ["dist/"]

#  Bad: Vague or missing file tracking
steps:
  build:
    run: "npm run build"  # What files does this need/produce?
```

### 12.2 Performance Optimization

1. **Enable Caching for Expensive Operations**
```yaml
steps:
  install_deps:
    run: "npm ci"
    cache: true           # Cache node_modules
    inputs: ["package.json", "package-lock.json"]
    outputs: ["node_modules/"]
    
  compile:
    run: "cargo build --release"
    cache: true           # Cache compilation artifacts
    inputs: ["src/", "Cargo.toml", "Cargo.lock"]
    outputs: ["target/release/"]
```

2. **Parallelize Independent Work**
```yaml
steps:
  # These run in parallel
  lint_frontend:
    run: "eslint frontend/"
    inputs: ["frontend/"]
    
  lint_backend:
    run: "cargo clippy"
    inputs: ["backend/"]
    
  test_frontend:
    run: "npm test"
    inputs: ["frontend/"]
    
  test_backend:
    run: "cargo test"
    inputs: ["backend/"]
```

3. **Optimize Resource Usage**
```yaml
steps:
  memory_intensive:
    run: "cargo build --release"
    container:
      memory_limit: "8GB"    # Ensure enough memory
      cpu_limit: "4.0"       # Use multiple cores
    timeout_secs: 1800        # 30 minute timeout
```

### 12.3 Security Best Practices

1. **Use Attestation for Critical Steps**
```yaml
attestation:
  sign_all_steps: true        # Sign everything
  verify_dependencies: true   # Verify inputs
  
steps:
  build:
    run: "npm run build"
    attestation:
      type: "build"
      reproducible: true      # Enforce reproducibility
      generate_slsa: true     # Generate SLSA metadata
```

2. **Implement Proper Isolation**
```yaml
steps:
  untrusted_code:
    run: "./third-party-script.sh"
    isolation: container      # Container isolation
    image: "alpine:latest"
    
  highly_sensitive:
    run: "sign-release.sh"
    isolation: vm            # Maximum isolation
    vm_image: "ubuntu-22.04"
```

3. **Manage Secrets Properly**
```yaml
steps:
  deploy:
    run: |
      # Use external secret management
      kubectl create secret generic app-secrets \
        --from-literal=api-key="$(vault kv get -field=api-key secret/app)" \
        --from-literal=db-password="$(vault kv get -field=password secret/db)"
    # Don't put secrets directly in pipeline YAML!
```

### 12.4 Maintenance and Debugging

1. **Use Descriptive Names and Documentation**
```yaml
version: "0.1"
name: "web-app-ci-cd"
description: |
  Complete CI/CD pipeline for the company web application.
  Includes linting, testing, building, security scanning, and deployment.
  
steps:
  security_scan:
    run: "npm audit --audit-level high"
    # This step ensures no high-severity vulnerabilities
    inputs: ["package-lock.json"]
```

2. **Add Health Checks and Validation**
```yaml
steps:
  deploy:
    run: |
      kubectl apply -f k8s/
      
      # Wait for deployment to be ready
      kubectl rollout status deployment/app --timeout=300s
      
      # Health check
      kubectl exec deployment/app -- curl -f http://localhost:8080/health
```

3. **Implement Error Handling**
```yaml
steps:
  robust_build:
    run: |
      set -euo pipefail  # Fail fast on errors
      
      # Cleanup function
      cleanup() {
        echo "Cleaning up temporary files..."
        rm -f /tmp/build-*
      }
      trap cleanup EXIT
      
      # Retry logic for flaky operations
      for i in {1..3}; do
        if npm run build; then
          break
        elif [ $i -eq 3 ]; then
          echo "Build failed after 3 attempts"
          exit 1
        else
          echo "Build attempt $i failed, retrying..."
          sleep 10
        fi
      done
```

## 13. Next Steps

Now that you understand pipeline configuration:

1. **[Command Line Interface](cli.md)** - Master the ATTEST CLI tools
2. **[Attestation & Signatures](attestation.md)** - Implement cryptographic security
3. **[Cache & Performance](cache-performance.md)** - Optimize your pipelines
4. **[Practical Examples](examples.md)** - See real-world implementations

---

**Ready to master the CLI?** -> [Command Line Interface](cli.md)

**Want to dive into security?** -> [Attestation & Signatures](attestation.md)