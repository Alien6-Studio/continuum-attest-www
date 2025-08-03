## 1. Overview

ATTEST provides comprehensive monitoring and observability features through metrics, logging, and distributed tracing to ensure pipeline health and performance.

## 2. Metrics

### 2.1 Prometheus Integration

```yaml
# Enable Prometheus metrics
monitoring:
  prometheus:
    enabled: true
    endpoint: ":9090"
    path: "/metrics"
    namespace: "attest"
```

### 2.2 Core Metrics

```
# Pipeline metrics
attest_pipeline_executions_total{status="success|failure"}
attest_pipeline_duration_seconds{pipeline="name"}
attest_step_duration_seconds{step="name",status="success|failure"}

# Cache metrics  
attest_cache_hits_total{backend="local|s3|redis"}
attest_cache_misses_total{backend="local|s3|redis"}
attest_cache_size_bytes{backend="local|s3|redis"}

# Verification metrics
attest_verifications_total{type="signature|receipt|policy"}
attest_verification_failures_total{reason="invalid_signature|expired|policy_violation"}
attest_verification_duration_seconds{type="signature|receipt|policy"}
```

## 3. Logging

### 3.1 Structured Logging

```json
{
  "timestamp": "2024-12-01T14:30:52Z",
  "level": "INFO",
  "target": "attest::pipeline",
  "message": "Pipeline execution completed",
  "fields": {
    "pipeline": "build-test-deploy",
    "duration_ms": 45230,
    "steps_total": 5,
    "steps_success": 5,
    "cache_hit_rate": 0.8
  }
}
```

### 3.2 Log Levels

```bash
# Configure log levels
export ATTEST_LOG_LEVEL=debug
attest run --log-level info
attest config set log_level warn
```

## 4. Distributed Tracing

### 4.1 OpenTelemetry Integration

```yaml
# Enable distributed tracing
tracing:
  enabled: true
  service_name: "attest-pipeline"
  exporter:
    type: "jaeger"
    endpoint: "http://jaeger:14268/api/traces"
    
  # Trace sampling
  sampling:
    rate: 0.1  # Sample 10% of traces
    always_sample_errors: true
```

### 4.2 Trace Context

```bash
# Pipeline execution with tracing
TRACEPARENT=00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01 \
attest run --trace
```

## 5. Dashboards

### 5.1 Grafana Dashboard

```json
{
  "dashboard": {
    "title": "ATTEST Pipeline Monitoring",
    "panels": [
      {
        "title": "Pipeline Success Rate",
        "type": "stat",
        "targets": [
          {
            "expr": "rate(attest_pipeline_executions_total{status=\"success\"}[5m]) / rate(attest_pipeline_executions_total[5m])"
          }
        ]
      },
      {
        "title": "Cache Hit Rate",
        "type": "stat", 
        "targets": [
          {
            "expr": "rate(attest_cache_hits_total[5m]) / (rate(attest_cache_hits_total[5m]) + rate(attest_cache_misses_total[5m]))"
          }
        ]
      }
    ]
  }
}
```

## 6. Alerting

### 6.1 Prometheus Alerts

```yaml
groups:
- name: attest-pipeline
  rules:
  - alert: PipelineFailureRate
    expr: rate(attest_pipeline_executions_total{status="failure"}[5m]) > 0.1
    for: 2m
    annotations:
      summary: "High pipeline failure rate detected"
      
  - alert: CachePerformanceDegraded
    expr: rate(attest_cache_hits_total[5m]) / (rate(attest_cache_hits_total[5m]) + rate(attest_cache_misses_total[5m])) < 0.5
    for: 5m
    annotations:
      summary: "Cache hit rate below threshold"
```

## 7. Health Checks

### 7.1 Endpoint Configuration

```yaml
# Health check endpoints
health:
  enabled: true
  endpoints:
    liveness: "/health/live"
    readiness: "/health/ready"
    metrics: "/metrics"
```

### 7.2 Custom Health Checks

```rust
// Custom health check
impl HealthCheck for CacheHealthCheck {
    async fn check(&self) -> HealthStatus {
        match self.cache.ping().await {
            Ok(_) => HealthStatus::Healthy,
            Err(e) => HealthStatus::Unhealthy(format!("Cache unavailable: {}", e))
        }
    }
}
```

## 8. Performance Monitoring

### 8.1 Profiling

```bash
# CPU profiling
attest run --profile cpu --profile-output cpu.prof

# Memory profiling  
attest run --profile memory --profile-output memory.prof

# Analyze profiles
attest analyze cpu.prof --format html --output cpu-analysis.html
```

### 8.2 Benchmarking

```bash
# Benchmark pipeline performance
attest benchmark pipeline --iterations 10 --output benchmark.json

# Compare performance across versions
attest benchmark compare \
  --baseline v0.1.0 \
  --current v0.2.0 \
  --format table
```

This monitoring system provides comprehensive visibility into ATTEST pipeline operations and performance.