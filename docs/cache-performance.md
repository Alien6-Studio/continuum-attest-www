## 1. Overview

ATTEST's content-addressed caching system dramatically improves build performance by intelligently reusing previous results. Understanding and optimizing caching is crucial for efficient CI/CD pipelines.

## 2. Content-Addressed Caching

### 2.1 How It Works

ATTEST uses Blake3 hashing to create unique identifiers for all inputs:

```bash
# Cache key calculation
inputs_hash = blake3(file_contents + file_metadata)
command_hash = blake3(command + environment + working_directory)
cache_key = blake3(inputs_hash + command_hash)
```

### 2.2 Cache Hierarchy

```
.attest/cache/
├── objects/          # Content-addressed objects
│   ├── ab/
│   │   └── cd123...  # Object files
├── refs/             # Cache references
│   ├── inputs/       # Input reference files
│   └── outputs/      # Output reference files
├── metadata/         # Cache metadata
│   ├── stats.json    # Cache statistics
│   └── gc.log        # Garbage collection log
└── receipts/         # Cached receipts
    └── by-hash/      # Receipts indexed by hash
```

## 3. Cache Configuration

### 3.1 Global Cache Settings

```yaml
# ~/.config/attest/config.yaml
cache:
  enabled: true
  max_size: "50GB"
  compression: true
  compression_level: 6
  retention_policy:
    max_age_days: 30
    max_entries: 100000
  gc:
    auto_gc: true
    gc_threshold: 0.8  # GC when 80% full
```

### 3.2 Per-Step Cache Control

```yaml
# attest.yaml
steps:
  fast_test:
    run: "npm test"
    cache: true
    cache_policy:
      ttl: "24h"
      invalidate_on:
        - "package-lock.json"
        - "test/**/*.js"
        
  slow_build:
    run: "cargo build --release"
    cache: true
    cache_policy:
      ttl: "7d"
      compression: true
      
  deploy:
    run: "kubectl apply -f k8s/"
    cache: false  # Never cache deployment
```

### 3.3 Environment-Specific Caching

```yaml
# Different cache settings per environment
environments:
  development:
    cache:
      enabled: true
      max_size: "10GB"
      aggressive_caching: true
      
  ci:
    cache:
      enabled: true
      max_size: "100GB"
      distributed: true
      backend: "s3://company-cache/"
      
  production:
    cache:
      enabled: false  # Always fresh builds
```

## 4. Cache Backends

### 4.1 Local Filesystem (Default)

```yaml
cache:
  backend: "local"
  path: ".attest/cache"
  max_size: "20GB"
```

### 4.2 S3-Compatible Storage

```yaml
cache:
  backend: "s3"
  bucket: "company-attest-cache"
  region: "us-west-2"
  prefix: "cache/"
  credentials:
    access_key_id: "${AWS_ACCESS_KEY_ID}"
    secret_access_key: "${AWS_SECRET_ACCESS_KEY}"
```

### 4.3 Redis

```yaml
cache:
  backend: "redis"
  endpoint: "redis.company.com:6379"
  database: 0
  ttl: "24h"
  auth:
    password: "${REDIS_PASSWORD}"
```

### 4.4 Multi-Tier Caching

```yaml
cache:
  tiers:
    - name: "local"
      backend: "local"
      max_size: "5GB"
      priority: 1
      
    - name: "shared"
      backend: "s3"
      bucket: "team-cache"
      priority: 2
      
    - name: "global"
      backend: "s3"
      bucket: "company-cache"
      priority: 3
      read_only: true
```

## 5. Performance Optimization

### 5.1 Cache Hit Rate Analysis

```bash
# View cache statistics
attest cache stats

# Detailed cache analysis
attest cache analyze --period 30d

# Output:
Cache Analysis (30 days)
========================
Total Requests: 1,234
Cache Hits: 987 (80.0%)
Cache Misses: 247 (20.0%)

Hit Rate by Step:
- test: 95.2% (1,180/1,234)
- build: 75.3% (450/598)
- lint: 98.1% (234/238)

Cache Savings:
- Time Saved: 45.2 hours
- Compute Saved: $234.50
- Network Saved: 15.6 GB
```

### 5.2 Cache Warming

```bash
# Warm cache for common builds
attest cache warm --branches main,develop,staging

# Pre-populate cache from CI
attest cache populate --from-ci-artifacts \
  --build-matrix "os=linux,mac&node=16,18,20"

# Scheduled cache warming
attest cache warm --schedule "0 2 * * *" \
  --targets "test,build,lint"
```

### 5.3 Intelligent Prefetching

```yaml
# .attest/cache-policy.yaml
prefetch:
  enabled: true
  strategies:
    - name: "dependency-based"
      trigger: "package.json changed"
      prefetch: ["npm install", "npm audit"]
      
    - name: "branch-based"
      trigger: "branch checkout"
      prefetch_from: "main"
      max_age: "24h"
      
    - name: "time-based"
      schedule: "0 */6 * * *"
      prefetch: ["build", "test"]
```

## 6. Distributed Caching

### 6.1 Cache Sharing

```yaml
# Team-level cache sharing
cache:
  shared:
    enabled: true
    team: "frontend-team"
    permissions:
      read: ["team:frontend", "team:devops"]
      write: ["team:frontend"]
      admin: ["team:devops"]
```

### 6.2 Cache Synchronization

```bash
# Sync cache between environments
attest cache sync --from ci --to local \
  --filter "step:build,test"

# Push local cache to shared storage
attest cache push --backend s3 \
  --include-metadata

# Pull from shared cache
attest cache pull --backend s3 \
  --merge-strategy newest
```

### 6.3 Cache Clustering

```yaml
# Redis Cluster configuration
cache:
  backend: "redis-cluster"
  nodes:
    - "redis-1.company.com:7000"
    - "redis-2.company.com:7000"
    - "redis-3.company.com:7000"
  consistency: "eventual"
  replication_factor: 3
```

## 7. Advanced Features

### 7.1 Conditional Caching

```yaml
steps:
  conditional_build:
    run: "npm run build"
    cache: true
    cache_conditions:
      - condition: "git diff --name-only HEAD~1 | grep -q '^src/'"
        action: "invalidate"
      - condition: "test $CI_BRANCH = main"
        policy: "aggressive"
      - condition: "test $NODE_ENV = production"
        action: "skip"
```

### 7.2 Cache Compression

```yaml
cache:
  compression:
    algorithm: "zstd"  # Options: gzip, zstd, lz4, brotli
    level: 6           # Compression level (1-9)
    threshold: "1MB"   # Only compress files larger than threshold
    parallel: true     # Use parallel compression
```

### 7.3 Content Deduplication

```bash
# Enable deduplication
attest cache dedupe --scan-all

# View deduplication stats
attest cache dedupe --stats

# Deduplication Report:
Total Objects: 10,450
Unique Objects: 8,234 (78.8%)
Duplicate Objects: 2,216 (21.2%)
Space Saved: 5.6 GB (34.2%)
```

## 8. Cache Management

### 8.1 Garbage Collection

```bash
# Manual garbage collection
attest cache gc

# Aggressive cleanup
attest cache gc --aggressive \
  --max-age 7d \
  --keep-last 10

# Scheduled GC
attest cache gc --schedule "0 3 * * 0" \
  --max-size 80%
```

### 8.2 Cache Inspection

```bash
# List cached objects
attest cache list --format table

# Inspect specific cache entry
attest cache inspect abc123def456...

# Show cache dependency graph
attest cache deps --step build --format dot
```

### 8.3 Cache Repair

```bash
# Verify cache integrity
attest cache verify --fix-corruption

# Rebuild cache index
attest cache reindex

# Recovery from backup
attest cache restore --from s3://backup-bucket/cache/
```

## 9. Performance Monitoring

### 9.1 Metrics Collection

```bash
# Enable performance metrics
export ATTEST_METRICS_ENABLED=true
export ATTEST_METRICS_ENDPOINT=http://prometheus:9090

# Performance counters
attest_cache_hits_total{step="build"}
attest_cache_misses_total{step="build"}
attest_cache_size_bytes{backend="local"}
attest_cache_operations_duration_seconds{operation="read"}
```

### 9.2 Performance Profiling

```bash
# Profile cache performance
attest profile --focus cache \
  --duration 60s \
  --output cache-profile.json

# Analyze bottlenecks
attest analyze cache-profile.json \
  --format html \
  --output cache-analysis.html
```

## 10. Benchmarking

### 10.1 Cache Performance Tests

```bash
# Benchmark cache backends
attest benchmark cache \
  --backends local,s3,redis \
  --operations read,write,delete \
  --sizes 1KB,1MB,100MB

# Results:
Backend    | Read (ms) | Write (ms) | Delete (ms)
-----------|-----------|------------|------------
local      | 0.1       | 0.3        | 0.1
s3         | 15.2      | 45.6       | 8.3
redis      | 2.1       | 3.4        | 1.8
```

### 10.2 Build Time Comparison

```bash
# Compare with and without cache
attest benchmark build \
  --scenarios "no-cache,cold-cache,warm-cache" \
  --iterations 10

# Results:
Scenario    | Avg Time | Std Dev | Cache Hit %
------------|----------|---------|------------
no-cache    | 180.2s   | 5.3s    | 0%
cold-cache  | 175.4s   | 4.8s    | 15%
warm-cache  | 32.1s    | 2.1s    | 85%
```

## 11. Troubleshooting

### 11.1 Common Issues

```bash
# Cache corruption
attest cache verify --repair

# Cache size exceeded
attest cache gc --force --target-size 80%

# Slow cache operations
attest cache benchmark --backend current

# Permission issues
attest cache permissions --fix
```

### 11.2 Debug Mode

```bash
# Enable cache debugging
export ATTEST_CACHE_DEBUG=true
export ATTEST_LOG_LEVEL=debug

# Trace cache operations
attest run --cache-trace build

# Cache operation log:
[DEBUG] Cache lookup: key=abc123... backend=local
[DEBUG] Cache miss: key=abc123...
[DEBUG] Cache store: key=abc123... size=1.2MB backend=local
[DEBUG] Cache store complete: duration=45ms
```

### 11.3 Performance Issues

```bash
# Identify cache bottlenecks
attest cache analyze --bottlenecks

# Common solutions:
1. Increase cache size limits
2. Enable compression for large objects
3. Use faster storage backend
4. Optimize cache key generation
5. Implement cache warming strategies
```

## 12. Best Practices

### 12.1 Cache Strategy

1. **Cache expensive operations** like compilation and testing
2. **Use appropriate TTL** values for different step types
3. **Implement cache warming** for frequently used builds
4. **Monitor cache hit rates** and optimize accordingly
5. **Consider network costs** for distributed caching

### 12.2 Security

1. **Encrypt sensitive cached data**
2. **Implement access controls** for shared caches
3. **Regularly rotate cache encryption keys**
4. **Audit cache access patterns**
5. **Secure cache backend connections**

### 12.3 Cost Optimization

1. **Use tiered storage** for different access patterns
2. **Implement aggressive garbage collection**
3. **Compress large cached objects**
4. **Monitor storage costs** and usage patterns
5. **Use spot instances** for cache warming

The ATTEST caching system provides significant performance improvements while maintaining security and reliability guarantees.