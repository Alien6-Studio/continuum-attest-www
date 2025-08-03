## 1. Overview

This guide covers common issues, diagnostic tools, and solutions for ATTEST deployments. Use this reference to quickly resolve problems and optimize your pipeline performance.

## 2. Common Issues

### Build Failures

#### Step Execution Failures

```bash
# Check step logs
attest logs --step build --verbose

# Common causes and solutions:
# 1. Missing dependencies
attest deps check --fix-missing

# 2. Environment variable issues
attest env check --show-missing

# 3. Permission problems
attest permissions check --fix-permissions

# 4. Resource constraints
attest resources check --recommend-limits
```

#### Cache-Related Build Failures

```bash
# Diagnose cache issues
attest cache diagnose --step build

# Clear corrupted cache
attest cache clear --key abc123... --force

# Rebuild cache index
attest cache reindex --verify

# Disable cache temporarily
attest run --no-cache --step build
```

### Performance Issues

#### Slow Build Times

```bash
# Profile build performance
attest profile build --duration 5m --output profile.json

# Analyze bottlenecks
attest analyze profile.json --format table

# Common optimizations:
# 1. Enable caching
attest config set cache.enabled true

# 2. Parallelize steps
attest config set execution.parallel true

# 3. Optimize Docker layers
attest optimize dockerfile --layer-caching
```

#### High Memory Usage

```bash
# Monitor memory usage
attest monitor memory --duration 10m

# Check for memory leaks
attest debug memory-leaks --heap-profile

# Optimize memory settings
attest config set resources.memory_limit "4Gi"
attest config set cache.max_size "1Gi"
```

### Verification Failures

#### Signature Verification Issues

```bash
# Debug signature verification
attest verify receipt.yaml --debug

# Common issues:
# 1. Clock skew
attest verify receipt.yaml --tolerance 5m

# 2. Wrong public key
attest keys list --show-fingerprints
attest verify receipt.yaml --key correct-key.pub

# 3. Corrupted receipt
attest receipt validate receipt.yaml --repair
```

#### Policy Violations

```bash
# Check policy violations  
attest policy check --show-violations

# Debug specific policy
attest policy debug security-scan-required --trace

# Temporarily bypass policy (emergency only)
attest run --policy-override emergency-bypass
```

### Networking Issues

#### Connection Timeouts

```bash
# Test network connectivity
attest network test --endpoints all

# Check proxy settings
attest config show network.proxy

# Configure timeouts
attest config set network.timeout "30s"
attest config set network.retries 3
```

#### DNS Resolution Problems

```bash
# Test DNS resolution
attest network dns-test --domains required

# Use custom DNS
attest config set network.dns_servers "8.8.8.8,1.1.1.1"

# Bypass DNS for specific hosts
attest config set network.hosts_file "/etc/attest/hosts"
```

## 3. Diagnostic Tools

### Health Check

```bash
# Comprehensive health check
attest health check --comprehensive

# Sample output:
System Health Check
==================
OK ATTEST version: 0.1.2 (latest)
OK Configuration: valid
OK Cache: healthy (85% hit rate)
OK Network: all endpoints reachable
WARNING Memory: high usage (87%)
ERROR Disk: low space (92% full)

Recommendations:
- Increase memory limit or optimize usage
- Clean up old cache entries or increase disk space
```

### System Information

```bash
# Gather system information
attest system info --full

# Output includes:
# - ATTEST version and configuration
# - Operating system details
# - Resource usage statistics
# - Network configuration
# - Cache status
# - Recent errors
```

### Debug Mode

```bash
# Enable debug logging
export ATTEST_LOG_LEVEL=debug
attest run --debug

# Trace specific operations
attest run --trace=cache,signature --step build

# Debug configuration
attest config debug --show-resolved --show-sources
```

## 4. Error Messages

### Common Error Patterns

#### "Command not found"

```bash
# Error: attest: command not found
# Solution: Install or update PATH
curl -sSL https://install.attest.continuu.ms | bash
export PATH="$HOME/.attest/bin:$PATH"
```

#### "Permission denied"

```bash
# Error: permission denied accessing .attest/
# Solution: Fix ownership or permissions
sudo chown -R $USER:$USER .attest/
chmod -R u+rw .attest/
```

#### "Cache corruption detected"

```bash
# Error: cache corruption detected in object abc123
# Solution: Repair or rebuild cache
attest cache repair --object abc123
# or
attest cache clear --all --rebuild
```

#### "Signature verification failed"

```bash
# Error: signature verification failed for receipt.yaml
# Solutions:
# 1. Check clock synchronization
sudo ntpdate -s time.nist.gov

# 2. Verify correct public key
attest keys show --public --fingerprint

# 3. Check receipt integrity
attest receipt verify --checksum receipt.yaml
```

#### "Policy violation"

```bash
# Error: policy violation: security-scan-required
# Solutions:
# 1. Run required security scan
attest run security-scan

# 2. Update policy configuration
attest policy update security-scan-required --disabled

# 3. Request policy exemption
attest policy exempt --policy security-scan-required \
  --reason "legacy-system" --approver manager@company.com
```

## 5. Performance Troubleshooting

### Identifying Bottlenecks

```bash
# Performance analysis
attest performance analyze --period 7d

# Step-by-step timing
attest profile steps --show-details

# Resource utilization
attest monitor resources --duration 1h --export csv
```

### Cache Performance

```bash
# Cache hit rate analysis
attest cache stats --detailed

# Cache size optimization
attest cache optimize --target-hit-rate 85%

# Cache cleanup
attest cache gc --aggressive --max-age 7d
```

### Network Performance

```bash
# Network latency test
attest network latency --endpoints cache,registry,api

# Bandwidth test
attest network bandwidth --test-upload --test-download

# Connection pooling optimization
attest config set network.connection_pool_size 20
```

## 6. Configuration Issues

### Invalid Configuration

```bash
# Validate configuration
attest config validate --strict

# Show configuration sources
attest config sources --show-overrides

# Reset to defaults
attest config reset --confirm
```

### Environment Variables

```bash
# Check environment variables
attest env validate --show-missing --show-conflicts

# Export current environment
attest env export --format yaml > current-env.yaml

# Load environment from file
attest env load --file production.env
```

### File Permissions

```bash
# Check file permissions
attest permissions audit --fix-issues

# Set correct permissions
chmod 600 ~/.attest/keys/*  # Private keys
chmod 644 ~/.attest/config.yaml  # Configuration
chmod 755 ~/.attest/bin/*  # Binaries
```

## 7. Recovery Procedures

### Cache Recovery

```bash
# Backup current cache
attest cache backup --output cache-backup.tar.gz

# Restore from backup
attest cache restore --input cache-backup.tar.gz

# Rebuild cache from scratch
attest cache rebuild --from-artifacts
```

### Configuration Recovery

```bash
# Backup configuration
attest config backup --output config-backup.yaml

# Restore configuration
attest config restore --input config-backup.yaml

# Reset to factory defaults
attest config factory-reset --keep-keys
```

### Key Recovery

```bash
# List available keys
attest keys list --show-backups

# Restore from backup
attest keys restore --backup-id abc123 --confirm

# Generate new keys (emergency)
attest keys generate --emergency --backup-old
```

## 8. Monitoring and Alerting

### Error Monitoring

```bash
# Monitor for errors
attest monitor errors --duration 1h --threshold 5

# Set up error alerts
attest alerts configure error-rate \
  --threshold 10 \
  --window 5m \
  --webhook https://alerts.company.com/webhook
```

### Performance Monitoring

```bash
# Performance dashboards
attest dashboard create performance \
  --metrics "build_time,cache_hit_rate,error_rate" \
  --export grafana-dashboard.json
```

### Health Monitoring

```bash
# Continuous health monitoring
attest monitor health \
  --interval 30s \
  --alert-webhook https://health.company.com/webhook
```

## 9. Advanced Debugging

### Core Dumps

```bash
# Generate core dump for analysis
attest debug core-dump --on-crash

# Analyze core dump
attest debug analyze-core core.dump --symbols
```

### Memory Profiling

```bash
# Enable memory profiling
attest profile memory --duration 10m --output memory.prof

# Analyze memory usage
attest analyze memory.prof --top 20 --format graph
```

### Network Tracing

```bash
# Network trace
attest trace network --duration 5m --output network.pcap

# Analyze network trace
attest analyze network.pcap --show-slow-requests
```

## 10. Environment-Specific Issues

### Docker Issues

```bash
# Docker daemon issues
attest docker diagnose --fix-common-issues

# Docker permission issues
attest docker fix-permissions --user $USER

# Docker storage issues
attest docker cleanup --remove-unused --free-space 2GB
```

### Kubernetes Issues

```bash
# Kubernetes connectivity
attest k8s diagnose --namespace attest-system

# Resource constraints
attest k8s resources check --recommend-limits

# RBAC issues
attest k8s rbac verify --fix-permissions
```

### CI/CD Platform Issues

```bash
# GitHub Actions issues
attest ci diagnose --platform github-actions
attest ci logs --workflow-run 123456789

# GitLab CI issues  
attest ci diagnose --platform gitlab-ci
attest ci logs --job-id 987654321
```

## 11. Getting Help

### Support Channels

```bash
# Community support
attest community --topic troubleshooting

# Documentation search
attest docs search "error message"

# Submit bug report
attest bug-report --include-logs --include-config
```

### Professional Support

```bash
# Enterprise support
attest support create-ticket \
  --priority high \
  --category troubleshooting \
  --attach-diagnostics

# Emergency support
attest support emergency \
  --incident-id INC-123456 \
  --contact +1-555-0123
```

## 12. Prevention Best Practices

### Regular Maintenance

```bash
# Scheduled maintenance
attest maintenance schedule \
  --weekly "cache-cleanup,log-rotation" \
  --monthly "key-rotation,backup-verification"
```

### Monitoring Setup

```bash
# Comprehensive monitoring
attest monitoring setup \
  --prometheus \
  --grafana \
  --alertmanager \
  --log-aggregation
```

### Backup Verification

```bash
# Regular backup tests
attest backup test \
  --restore-to-temp \
  --verify-integrity \
  --schedule weekly
```

## 13. Quick Reference

### Emergency Commands

```bash
# Stop all running builds
attest stop --all

# Emergency cache clear
attest cache clear --all --force

# Bypass all policies (emergency only)
attest run --bypass-all-policies --emergency-override

# Factory reset (keeps user data)
attest reset --factory --keep-user-data
```

### Status Commands

```bash
# Quick status check
attest status

# Detailed system status
attest status --verbose --all-components

# Export diagnostics
attest diagnostics export --full --output diagnostics.tar.gz
```

This troubleshooting guide provides comprehensive solutions for common ATTEST issues and debugging techniques for advanced problems.