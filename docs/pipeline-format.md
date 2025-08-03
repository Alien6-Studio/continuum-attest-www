## 1. Overview

ATTEST uses a declarative YAML format to define CI/CD pipelines. This document provides a comprehensive reference for the pipeline configuration format, including all available options and advanced features.

## 2. Basic Structure

### 2.1 Minimal Pipeline

```yaml
version: "0.1"
name: "basic-pipeline"

steps:
  - name: "hello"
    run: "echo 'Hello, World!'"
```

### 2.2 Complete Pipeline Structure

```yaml
version: "0.1"                    # Required: Format version
name: "complete-pipeline"         # Required: Pipeline name
description: "Example pipeline"   # Optional: Description

# Global configuration
defaults:
  cache: true
  timeout: "30m"
  
env:
  GLOBAL_VAR: "value"
  
# Environment definitions
environments:
  development:
    env:
      NODE_ENV: "development"
  production:
    env:
      NODE_ENV: "production"
      
# Step definitions
steps:
  - name: "build"
    description: "Build application"
    run: "npm run build"
    # ... step configuration
    
# Post-pipeline actions
cleanup:
  - name: "cleanup-temp"
    run: "rm -rf /tmp/build"
```

## 3. Version

The `version` field specifies the format version:

```yaml
version: "0.1"  # Current version
```

Supported versions:
- `0.1` - Initial format (current)

## 4. Metadata

### 4.1 Name and Description

```yaml
name: "web-application-build"
description: |
  Complete build pipeline for the web application
  including testing, building, and security scanning
```

### 4.2 Labels and Annotations

```yaml
labels:
  team: "frontend"
  project: "webapp"
  environment: "production"
  
annotations:
  docs: "https://wiki.company.com/webapp-pipeline"
  contact: "frontend-team@company.com"
  compliance: "sox,hipaa"
```

## 5. Global Defaults

Set default values for all steps:

```yaml
defaults:
  cache: true
  timeout: "15m"
  shell: "/bin/bash"
  working_directory: "/workspace"
  retry:
    attempts: 3
    backoff: "exponential"
```

## 6. Environment Variables

### 6.1 Global Environment Variables

```yaml
env:
  NODE_ENV: "production"
  API_URL: "https://api.company.com"
  DEBUG: "false"
```

### 6.2 Environment-Specific Variables

```yaml
environments:
  development:
    env:
      DEBUG: "true"
      API_URL: "https://dev-api.company.com"
      
  staging:
    env:
      DEBUG: "false"
      API_URL: "https://staging-api.company.com"
      
  production:
    env:
      DEBUG: "false"
      API_URL: "https://api.company.com"
      MONITORING: "enabled"
```

### 6.3 Secret Variables

```yaml
secrets:
  - name: "DATABASE_PASSWORD"
    source: "vault:secret/db/password"
  - name: "API_KEY"
    source: "env:API_KEY"
  - name: "SIGNING_KEY"
    source: "file:/etc/attest/signing.key"
```

## 7. Steps

### 7.1 Basic Step

```yaml
steps:
  - name: "test"
    run: "npm test"
```

### 7.2 Complete Step Configuration

```yaml
steps:
  - name: "build"
    description: "Build the application"
    run: "npm run build"
    
    # Dependencies
    needs: ["install", "lint"]
    
    # Input/Output specification
    inputs:
      - "src/**/*.js"
      - "src/**/*.ts"
      - "package.json"
      - "tsconfig.json"
    outputs:
      - "dist/"
      - "build-manifest.json"
      
    # Environment
    env:
      NODE_ENV: "production"
      BUILD_TARGET: "es2020"
      
    # Execution configuration
    shell: "/bin/bash"
    working_directory: "/app"
    timeout: "20m"
    
    # Retry configuration
    retry:
      attempts: 3
      backoff: "exponential"
      on_failure: ["network_error", "timeout"]
      
    # Caching
    cache: true
    cache_key: "build-{{ checksum 'package-lock.json' }}-{{ env.NODE_ENV }}"
    
    # Conditions
    condition: "{{ env.CI_BRANCH == 'main' }}"
    
    # Continue on failure
    continue_on_error: false
```

### 7.3 Multi-Command Steps

```yaml
steps:
  - name: "setup-and-test"
    run: |
      set -e
      echo "Setting up environment..."
      npm ci
      echo "Running tests..."
      npm test
      echo "Tests completed successfully"
```

### 7.4 Conditional Steps

```yaml
steps:
  - name: "deploy-production"
    run: "kubectl apply -f k8s/"
    condition: |
      {{ env.CI_BRANCH == 'main' and 
         env.CI_COMMIT_TAG starts_with 'v' }}
```

## 8. Dependencies

### 8.1 Step Dependencies

```yaml
steps:
  - name: "install"
    run: "npm ci"
    
  - name: "lint"
    run: "npm run lint"
    needs: ["install"]
    
  - name: "test"
    run: "npm test"
    needs: ["install"]
    
  - name: "build"
    run: "npm run build"
    needs: ["lint", "test"]
```

### 8.2 Parallel Execution

```yaml
steps:
  - name: "install"
    run: "npm ci"
    
  # These run in parallel after install
  - name: "lint"
    run: "npm run lint"
    needs: ["install"]
    
  - name: "test-unit"
    run: "npm run test:unit"
    needs: ["install"]
    
  - name: "test-integration"
    run: "npm run test:integration"
    needs: ["install"]
    
  # This waits for all parallel steps
  - name: "build"
    run: "npm run build"
    needs: ["lint", "test-unit", "test-integration"]
```

## 9. Input/Output Specification

### 9.1 File Patterns

```yaml
inputs:
  - "src/**/*.{js,ts,jsx,tsx}"  # Glob patterns
  - "package.json"              # Specific files
  - "!src/**/*.test.js"         # Exclusions
  - "config/"                   # Directories

outputs:
  - "dist/"
  - "coverage/"
  - "*.log"
```

### 9.2 Content-Based Inputs

```yaml
inputs:
  - path: "src/"
    exclude: ["**/*.test.js", "**/*.spec.js"]
  - path: "package.json"
    required: true
  - path: "config/"
    optional: true
```

### 9.3 Output Artifacts

```yaml
outputs:
  - name: "build-artifacts"
    paths: ["dist/"]
    retention: "30d"
  - name: "test-results"
    paths: ["coverage/", "test-results.xml"]
    retention: "7d"
    public: true
```

## 10. Caching

### 10.1 Basic Caching

```yaml
steps:
  - name: "install"
    run: "npm ci"
    cache: true  # Enable caching
```

### 10.2 Custom Cache Keys

```yaml
steps:
  - name: "install"
    run: "npm ci"
    cache: true
    cache_key: "npm-{{ checksum 'package-lock.json' }}-{{ env.NODE_VERSION }}"
```

### 10.3 Cache Configuration

```yaml
steps:
  - name: "build"
    run: "npm run build"
    cache:
      enabled: true
      key: "build-{{ checksum 'src/**/*.js' }}"
      paths: ["dist/", "build/"]
      ttl: "24h"
      compression: true
```

### 10.4 Cache Strategies

```yaml
cache_strategy:
  # Aggressive caching for development
  development:
    default_ttl: "1h"
    compression: false
    
  # Conservative caching for production  
  production:
    default_ttl: "24h"
    compression: true
    require_exact_match: true
```

## 11. Conditions and Control Flow

### 11.1 Simple Conditions

```yaml
steps:
  - name: "deploy"
    run: "kubectl apply -f k8s/"
    condition: "{{ env.BRANCH == 'main' }}"
```

### 11.2 Complex Conditions

```yaml
steps:
  - name: "security-scan"
    run: "security-scanner scan"
    condition: |
      {{ env.SECURITY_SCAN_ENABLED and
         (env.BRANCH == 'main' or 
          env.BRANCH starts_with 'release/') }}
```

### 11.3 Conditional Execution Based on Changes

```yaml
steps:
  - name: "frontend-build"
    run: "npm run build"
    condition: "{{ changes include 'frontend/**' }}"
    
  - name: "backend-build" 
    run: "go build"
    condition: "{{ changes include 'backend/**' }}"
```

## 12. Error Handling

### 12.1 Retry Configuration

```yaml
steps:
  - name: "flaky-test"
    run: "npm run test:e2e"
    retry:
      attempts: 3
      backoff: "exponential"  # linear, exponential, fixed
      initial_delay: "5s"
      max_delay: "60s"
      on_failure: 
        - "network_error"
        - "timeout"
        - "exit_code:1"
```

### 12.2 Continue on Error

```yaml
steps:
  - name: "optional-check"
    run: "optional-tool check"
    continue_on_error: true
    
  - name: "required-build"
    run: "npm run build"
    # This runs even if optional-check fails
```

### 12.3 Custom Error Handling

```yaml
steps:
  - name: "database-migration"
    run: "migrate up"
    on_failure:
      - name: "rollback"
        run: "migrate down"
      - name: "notify"
        run: "send-alert 'Migration failed'"
```

## 13. Advanced Features

### 13.1 Matrix Builds

```yaml
matrix:
  node_version: ["16", "18", "20"]
  os: ["ubuntu-latest", "macos-latest"]
  
steps:
  - name: "test"
    run: "npm test"
    env:
      NODE_VERSION: "{{ matrix.node_version }}"
    runs_on: "{{ matrix.os }}"
```

### 13.2 Dynamic Steps

```yaml
steps:
  - name: "generate-tests"
    run: "generate-test-matrix"
    outputs: ["test-matrix.json"]
    
  - name: "run-tests"
    run: "run-test {{ item.name }}"
    for_each: "{{ fromJson(file('test-matrix.json')) }}"
    env:
      TEST_CONFIG: "{{ item.config }}"
```

### 13.3 Service Dependencies

```yaml
services:
  postgres:
    image: "postgres:13"
    env:
      POSTGRES_PASSWORD: "test"
    ports:
      - "5432:5432"
      
  redis:
    image: "redis:6"
    ports:
      - "6379:6379"

steps:
  - name: "integration-test"
    run: "npm run test:integration"
    env:
      DATABASE_URL: "postgres://postgres:test@localhost:5432/test"
      REDIS_URL: "redis://localhost:6379"
```

## 14. Attestation Configuration

### 14.1 Signing Configuration

```yaml
attestation:
  sign: true
  algorithm: "ed25519"
  key_source: "vault:secret/signing-key"
  
verification:
  enabled: true
  require_signatures: true
  trusted_keys:
    - "ed25519:abc123..."
    - "ed25519:def456..."
```

### 14.2 Custom Attestation

```yaml
attestation:
  custom_fields:
    build_id: "{{ env.BUILD_ID }}"
    commit_sha: "{{ env.GIT_COMMIT }}"
    compliance_level: "sox"
    
  policies:
    - "require-tests"
    - "security-scan"
    - "approval-required"
```

## 15. Template and Reuse

### 15.1 Step Templates

```yaml
# _templates.yaml
templates:
  node_setup: &node_setup
    name: "setup-node"
    run: |
      nvm use {{ env.NODE_VERSION }}
      npm ci
    inputs: ["package.json", "package-lock.json"]
    outputs: ["node_modules/"]

# pipeline.yaml
steps:
  - <<: *node_setup
    env:
      NODE_VERSION: "18"
```

### 15.2 Pipeline Includes

```yaml
# common-steps.yaml
common_steps:
  - name: "security-scan"
    run: "security-scanner scan"
  - name: "dependency-check"
    run: "npm audit"

# main-pipeline.yaml
version: "0.1"
name: "main-pipeline"

includes:
  - "common-steps.yaml"

steps:
  - name: "build"
    run: "npm run build"
  - include: "common_steps"
```

### 15.3 Variables and Interpolation

```yaml
variables:
  app_name: "my-app"
  version: "{{ env.VERSION | default('1.0.0') }}"
  build_dir: "dist/{{ variables.app_name }}"

steps:
  - name: "build"
    run: "npm run build"
    env:
      OUTPUT_DIR: "{{ variables.build_dir }}"
```

## 16. Validation

### 16.1 Schema Validation

```yaml
# Built-in validation
validation:
  strict: true  # Fail on unknown fields
  required_fields: ["name", "version", "steps"]
  
# Custom validation
custom_validation:
  - rule: "steps[*].name must be unique"
  - rule: "inputs must exist before step execution"
  - rule: "circular dependencies are not allowed"
```

### 16.2 Linting

```bash
# Validate pipeline format
attest pipeline validate pipeline.yaml

# Lint for best practices
attest pipeline lint pipeline.yaml --rules production
```

## 17. Comments and Documentation

```yaml
# Pipeline for building and testing the web application
version: "0.1"
name: "webapp-build"

# Global environment variables used throughout the pipeline
env:
  NODE_ENV: "production"  # Set Node.js environment
  
steps:
  # Install dependencies from package-lock.json
  - name: "install"
    run: "npm ci"
    # Cache node_modules based on lockfile hash
    cache_key: "npm-{{ checksum 'package-lock.json' }}"
    
  # Run linting to ensure code quality
  - name: "lint"
    run: "npm run lint"
    needs: ["install"]
    # Continue pipeline even if linting has warnings
    continue_on_error: true
```

## 18. Best Practices

### 18.1 Pipeline Organization

1. **Use meaningful step names** that describe the action
2. **Group related steps** logically
3. **Leverage parallel execution** where possible
4. **Keep steps focused** on single responsibilities
5. **Use descriptive comments** for complex logic

### 18.2 Performance Optimization

1. **Enable caching** for expensive operations
2. **Specify precise inputs** to improve cache hits
3. **Use parallel execution** for independent steps
4. **Minimize output artifacts** to reduce transfer time
5. **Set appropriate timeouts** to prevent hanging

### 18.3 Security Considerations

1. **Never hardcode secrets** in pipeline files
2. **Use minimal required permissions** for each step
3. **Validate all inputs** and outputs
4. **Enable signing** for production pipelines
5. **Implement proper error handling** without exposing sensitive data

This pipeline format provides a powerful and flexible way to define CI/CD workflows while maintaining simplicity and readability.