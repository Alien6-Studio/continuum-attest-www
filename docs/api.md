ATTEST provides comprehensive REST APIs and SDKs for programmatic access to pipeline management, attestation services, and verification capabilities. This enables deep integration with existing tools and custom automation.

## 1. REST API

### 1.1 Authentication

#### API Key Authentication

```bash
# Get API key
attest auth generate-key --name "ci-automation" --scope "pipelines:write"

# Use in requests
curl -H "Authorization: Bearer attest_key_abc123..." \
  https://api.attest.continuu.ms/v1/pipelines
```

#### JWT Token Authentication

```bash
# Get JWT token
attest auth login --output-token

# Use token
export ATTEST_TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
curl -H "Authorization: Bearer $ATTEST_TOKEN" \
  https://api.attest.continuu.ms/v1/user/profile
```

### Base URL and Versioning

```
Base URL: https://api.attest.continuu.ms
Current Version: v1
API Endpoint: https://api.attest.continuu.ms/v1
```

### Pipelines API

#### Create Pipeline

```http
POST /v1/pipelines
Content-Type: application/json
Authorization: Bearer <token>

{
  "name": "web-app-build",
  "description": "Frontend application build pipeline",
  "config": {
    "version": "0.1",
    "steps": [
      {
        "name": "install",
        "run": "npm ci",
        "inputs": ["package.json", "package-lock.json"],
        "outputs": ["node_modules/"]
      },
      {
        "name": "build",
        "run": "npm run build",
        "inputs": ["src/", "public/"],
        "outputs": ["dist/"],
        "needs": ["install"]
      }
    ]
  }
}
```

#### List Pipelines

```http
GET /v1/pipelines?limit=20&offset=0&sort=created_at:desc
Authorization: Bearer <token>

Response:
{
  "pipelines": [
    {
      "id": "pip_abc123",
      "name": "web-app-build",
      "status": "active",
      "created_at": "2024-12-01T10:00:00Z",
      "updated_at": "2024-12-01T15:30:00Z",
      "executions": 45,
      "success_rate": 0.94
    }
  ],
  "total": 15,
  "has_more": false
}
```

#### Execute Pipeline

```http
POST /v1/pipelines/pip_abc123/executions
Content-Type: application/json
Authorization: Bearer <token>

{
  "environment": "production",
  "variables": {
    "NODE_ENV": "production",
    "API_URL": "https://api.company.com"
  },
  "options": {
    "sign": true,
    "verify": true,
    "cache": true
  }
}

Response:
{
  "execution_id": "exec_def456",
  "status": "running",
  "started_at": "2024-12-01T16:00:00Z",
  "pipeline_url": "/v1/pipelines/pip_abc123",
  "logs_url": "/v1/executions/exec_def456/logs",
  "receipt_url": "/v1/executions/exec_def456/receipt"
}
```

### Executions API

#### Get Execution Status

```http
GET /v1/executions/exec_def456
Authorization: Bearer <token>

Response:
{
  "id": "exec_def456",
  "pipeline_id": "pip_abc123",
  "status": "completed",
  "exit_code": 0,
  "started_at": "2024-12-01T16:00:00Z",
  "completed_at": "2024-12-01T16:05:30Z",
  "duration_seconds": 330,
  "steps": [
    {
      "name": "install",
      "status": "completed",
      "exit_code": 0,
      "duration_seconds": 120,
      "cache_hit": true
    },
    {
      "name": "build",
      "status": "completed", 
      "exit_code": 0,
      "duration_seconds": 180,
      "cache_hit": false
    }
  ]
}
```

#### Get Execution Logs

```http
GET /v1/executions/exec_def456/logs?step=build&tail=100
Authorization: Bearer <token>

Response:
{
  "logs": [
    {
      "timestamp": "2024-12-01T16:03:15Z",
      "step": "build",
      "level": "info",
      "message": "Starting build process..."
    },
    {
      "timestamp": "2024-12-01T16:05:20Z",
      "step": "build",
      "level": "info",
      "message": "Build completed successfully"
    }
  ],
  "total_lines": 1247,
  "has_more": true
}
```

### Receipts API

#### Get Receipt

```http
GET /v1/executions/exec_def456/receipt
Authorization: Bearer <token>

Response:
{
  "receipt": {
    "pipeline_hash": "blake3:abc123def456...",
    "timestamp": "2024-12-01T16:05:30Z",
    "total_duration_secs": 330,
    "attest_version": "0.1.2",
    "steps": [...],
    "signature": "ed25519:signature_hex...",
    "signer_public_key": "ed25519:public_key_hex..."
  },
  "verification": {
    "signature_valid": true,
    "timestamp_valid": true,
    "chain_of_trust": "verified"
  }
}
```

#### Verify Receipt

```http
POST /v1/receipts/verify
Content-Type: application/json
Authorization: Bearer <token>

{
  "receipt": { ... },
  "trusted_keys": ["ed25519:key1...", "ed25519:key2..."],
  "policies": ["require-signature", "max-age-24h"]
}

Response:
{
  "valid": true,
  "signature_verification": {
    "valid": true,
    "signer": "ci-system@company.com",
    "algorithm": "ed25519"
  },
  "policy_compliance": {
    "passed": true,
    "violations": []
  },
  "timestamp_check": {
    "valid": true,
    "age_hours": 2.5
  }
}
```

### Cache API

#### Get Cache Statistics

```http
GET /v1/cache/stats
Authorization: Bearer <token>

Response:
{
  "total_size_bytes": 1073741824,
  "total_entries": 1234,
  "hit_rate": 0.85,
  "miss_rate": 0.15,
  "backends": {
    "local": {
      "size_bytes": 536870912,
      "entries": 567,
      "hit_rate": 0.92
    },
    "s3": {
      "size_bytes": 536870912,
      "entries": 667,
      "hit_rate": 0.78
    }
  }
}
```

#### Cache Operations

```http
DELETE /v1/cache/objects/blake3:abc123def456...
Authorization: Bearer <token>

POST /v1/cache/gc
Content-Type: application/json
Authorization: Bearer <token>

{
  "max_age_days": 7,
  "target_size_percent": 80,
  "aggressive": false
}
```

## 2. SDKs

### Python SDK

#### 3.1.1 Installation

```bash
pip install attest-sdk
```

#### 3.1.2 Basic Usage

```python
from attest import AttestClient

# Initialize client
client = AttestClient(
    api_key="attest_key_abc123...",
    base_url="https://api.attest.continuu.ms"
)

# Create pipeline
pipeline = client.pipelines.create(
    name="python-app",
    config={
        "version": "0.1",
        "steps": [
            {
                "name": "test",
                "run": "python -m pytest",
                "inputs": ["src/", "tests/"],
                "outputs": ["coverage.xml"]
            }
        ]
    }
)

# Execute pipeline
execution = pipeline.execute(
    environment="staging",
    variables={"PYTHON_ENV": "test"},
    options={"sign": True, "verify": True}
)

# Wait for completion
execution.wait_for_completion(timeout=300)

# Get receipt
receipt = execution.get_receipt()
if receipt.verify():
    print("Pipeline executed successfully with valid attestation")
else:
    print("Verification failed")
```

#### Advanced Features

```python
# Streaming logs
for log_entry in execution.stream_logs():
    print(f"[{log_entry.step}] {log_entry.message}")

# Custom verification
verifier = client.create_verifier(
    trusted_keys=["ed25519:key1...", "ed25519:key2..."],
    policies=["require-tests", "security-scan"]
)

is_valid = verifier.verify_receipt(receipt)

# Cache management
cache = client.cache
stats = cache.get_stats()
print(f"Cache hit rate: {stats.hit_rate:.2%}")

# Bulk operations
results = client.pipelines.bulk_execute([
    {"pipeline_id": "pip_1", "environment": "staging"},
    {"pipeline_id": "pip_2", "environment": "production"}
])
```

### JavaScript/TypeScript SDK

#### 3.2.1 Installation

```bash
npm install @attest/sdk
```

#### 3.2.2 Basic Usage

```typescript
import { AttestClient } from '@attest/sdk';

const client = new AttestClient({
  apiKey: 'attest_key_abc123...',
  baseUrl: 'https://api.attest.continuu.ms'
});

// Create and execute pipeline
const pipeline = await client.pipelines.create({
  name: 'node-app',
  config: {
    version: '0.1',
    steps: [
      {
        name: 'install',
        run: 'npm ci',
        inputs: ['package.json', 'package-lock.json'],
        outputs: ['node_modules/']
      },
      {
        name: 'build',
        run: 'npm run build',
        inputs: ['src/', 'public/'],
        outputs: ['dist/'],
        needs: ['install']
      }
    ]
  }
});

const execution = await pipeline.execute({
  environment: 'production',
  variables: { NODE_ENV: 'production' },
  options: { sign: true, verify: true }
});

// Monitor execution
execution.on('status_changed', (status) => {
  console.log(`Pipeline status: ${status}`);
});

execution.on('step_completed', (step) => {
  console.log(`Step ${step.name} completed in ${step.duration}s`);
});

const result = await execution.waitForCompletion();
const receipt = await execution.getReceipt();

if (await receipt.verify()) {
  console.log('Pipeline completed with valid attestation');
}
```

### Go SDK

#### 3.3.1 Installation

```bash
go get github.com/attest-dev/go-sdk
```

#### 3.3.2 Basic Usage

```go
package main

import (
    "context"
    "fmt"
    "github.com/attest-dev/go-sdk/attest"
)

func main() {
    client := attest.NewClient(&attest.Config{
        APIKey:  "attest_key_abc123...",
        BaseURL: "https://api.attest.continuu.ms",
    })

    // Create pipeline
    pipeline, err := client.Pipelines.Create(context.Background(), &attest.PipelineConfig{
        Name: "go-app",
        Config: &attest.Config{
            Version: "0.1",
            Steps: []attest.Step{
                {
                    Name:    "test",
                    Run:     "go test ./...",
                    Inputs:  []string{"*.go", "go.mod", "go.sum"},
                    Outputs: []string{"coverage.out"},
                },
                {
                    Name:    "build",
                    Run:     "go build -o app",
                    Inputs:  []string{"*.go"},
                    Outputs: []string{"app"},
                    Needs:   []string{"test"},
                },
            },
        },
    })
    if err != nil {
        panic(err)
    }

    // Execute pipeline
    execution, err := pipeline.Execute(context.Background(), &attest.ExecuteOptions{
        Environment: "production",
        Variables: map[string]string{
            "CGO_ENABLED": "0",
            "GOOS":        "linux",
        },
        Sign:   true,
        Verify: true,
    })
    if err != nil {
        panic(err)
    }

    // Wait for completion
    result, err := execution.WaitForCompletion(context.Background())
    if err != nil {
        panic(err)
    }

    // Verify receipt
    receipt, err := execution.GetReceipt(context.Background())
    if err != nil {
        panic(err)
    }

    valid, err := receipt.Verify(context.Background())
    if err != nil {
        panic(err)
    }

    if valid {
        fmt.Println("Pipeline completed with valid attestation")
    }
}
```

### Rust SDK

#### 3.4.1 Installation

```toml
[dependencies]
attest-sdk = "0.1"
tokio = { version = "1.0", features = ["full"] }
```

#### 3.4.2 Basic Usage

```rust
use attest_sdk::{AttestClient, PipelineConfig, Step, ExecuteOptions};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let client = AttestClient::new("attest_key_abc123...", "https://api.attest.continuu.ms")?;

    // Create pipeline
    let pipeline = client.pipelines().create(PipelineConfig {
        name: "rust-app".to_string(),
        config: attest_sdk::Config {
            version: "0.1".to_string(),
            steps: vec![
                Step {
                    name: "test".to_string(),
                    run: "cargo test".to_string(),
                    inputs: vec!["src/".to_string(), "Cargo.toml".to_string()],
                    outputs: vec!["target/debug/".to_string()],
                    needs: vec![],
                },
                Step {
                    name: "build".to_string(),
                    run: "cargo build --release".to_string(),
                    inputs: vec!["src/".to_string(), "Cargo.toml".to_string()],
                    outputs: vec!["target/release/".to_string()],
                    needs: vec!["test".to_string()],
                },
            ],
        },
    }).await?;

    // Execute pipeline
    let execution = pipeline.execute(ExecuteOptions {
        environment: Some("production".to_string()),
        variables: vec![
            ("RUSTFLAGS".to_string(), "-C target-cpu=native".to_string()),
        ].into_iter().collect(),
        sign: true,
        verify: true,
        ..Default::default()
    }).await?;

    // Stream logs
    let mut log_stream = execution.stream_logs().await?;
    while let Some(log_entry) = log_stream.next().await {
        println!("[{}] {}", log_entry.step, log_entry.message);
    }

    // Get result
    let result = execution.wait_for_completion().await?;
    let receipt = execution.get_receipt().await?;

    if receipt.verify().await? {
        println!("Pipeline completed with valid attestation");
    }

    Ok(())
}
```

## 3. Webhooks

### Configuration

```http
POST /v1/webhooks
Content-Type: application/json
Authorization: Bearer <token>

{
  "url": "https://ci.company.com/attest-webhook",
  "events": ["execution.completed", "execution.failed", "receipt.signed"],
  "secret": "webhook_secret_key",
  "active": true
}
```

### Event Types

#### Execution Events

```json
{
  "event": "execution.completed",
  "timestamp": "2024-12-01T16:05:30Z",
  "data": {
    "execution_id": "exec_def456",
    "pipeline_id": "pip_abc123",
    "status": "completed",
    "duration_seconds": 330,
    "exit_code": 0,
    "receipt_url": "/v1/executions/exec_def456/receipt"
  }
}
```

#### Receipt Events

```json
{
  "event": "receipt.signed",
  "timestamp": "2024-12-01T16:05:30Z",
  "data": {
    "execution_id": "exec_def456",
    "receipt_hash": "blake3:abc123def456...",
    "signature": "ed25519:signature_hex...",
    "signer": "ci-system@company.com"
  }
}
```

### Webhook Verification

```python
import hmac
import hashlib

def verify_webhook(payload, signature, secret):
    expected = hmac.new(
        secret.encode(),
        payload.encode(),
        hashlib.sha256
    ).hexdigest()
    
    return hmac.compare_digest(f"sha256={expected}", signature)

# Usage
if verify_webhook(request.body, request.headers['X-Attest-Signature'], webhook_secret):
    process_webhook(request.json())
else:
    return 401  # Unauthorized
```

## 4. Rate Limiting

### Limits

```
Tier          | Requests/minute | Burst
--------------|-----------------|-------
Free          | 100            | 200
Professional  | 1,000          | 2,000
Enterprise    | 10,000         | 20,000
```

### Rate Limit Headers

```http
HTTP/1.1 200 OK
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1638360000
```

### Handling Rate Limits

```python
import time
from attest_sdk.exceptions import RateLimitExceeded

try:
    result = client.pipelines.execute(pipeline_id)
except RateLimitExceeded as e:
    wait_time = int(e.reset_at) - int(time.time())
    time.sleep(wait_time)
    result = client.pipelines.execute(pipeline_id)  # Retry
```

## 5. Error Handling

### Error Response Format

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid pipeline configuration",
    "details": {
      "field": "steps[0].run",
      "issue": "Command cannot be empty"
    },
    "request_id": "req_abc123"
  }
}
```

### Common Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| AUTHENTICATION_FAILED | 401 | Invalid or expired token |
| AUTHORIZATION_FAILED | 403 | Insufficient permissions |
| VALIDATION_ERROR | 400 | Invalid request data |
| RESOURCE_NOT_FOUND | 404 | Resource doesn't exist |
| RATE_LIMIT_EXCEEDED | 429 | Too many requests |
| INTERNAL_ERROR | 500 | Server error |

## 6. Best Practices

### API Usage

1. **Use appropriate timeouts** for long-running operations
2. **Implement retry logic** with exponential backoff
3. **Handle rate limits gracefully**
4. **Validate responses** before processing
5. **Use webhook events** instead of polling when possible

### 7.2 Security

1. **Store API keys securely** (never in code)
2. **Use HTTPS only** for all API calls
3. **Validate webhook signatures** 
4. **Implement proper error handling** without exposing secrets
5. **Rotate API keys regularly**

### 7.3 Performance  

1. **Use bulk operations** when available
2. **Cache API responses** when appropriate
3. **Implement connection pooling** for high-volume usage
4. **Use streaming endpoints** for real-time data
5. **Monitor API usage** and optimize calls

The ATTEST API and SDKs provide powerful programmatic access to all platform capabilities, enabling seamless integration with existing development workflows and tools.