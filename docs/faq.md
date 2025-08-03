## 1. General Questions

### What is ATTEST?

ATTEST is a modern CI/CD platform that provides cryptographic attestation for build processes. It combines content-addressed caching, Ed25519 signatures, and policy enforcement to create secure, efficient, and verifiable software delivery pipelines.

### How is ATTEST different from other CI/CD tools?

ATTEST focuses on three key differentiators:

1. **Cryptographic Attestation**: Every step is signed with Ed25519 signatures, creating tamper-proof build records
2. **Content-Addressed Caching**: Blake3-based caching provides deterministic, secure cache keys
3. **Policy Enforcement**: Built-in OPA/Gatekeeper integration for compliance and governance

### Is ATTEST open source?

ATTEST core is available under the CoopyrightCode Light License (v1.1), which permits free non-commercial use. Commercial use requires a separate license. Enterprise features and support are available through commercial licensing.

### What platforms does ATTEST support?

ATTEST supports:
- **Operating Systems**: Linux, macOS, Windows
- **Architectures**: x86_64, ARM64
- **Deployment**: Docker, Kubernetes, standalone binaries
- **Cloud Providers**: AWS, GCP, Azure, on-premises

## 2. Installation and Setup

### How do I install ATTEST?

```bash
# Quick install script
curl -sSL https://install.attest.continuu.ms | bash

# Or download specific version
wget https://releases.attest.continuu.ms/v0.1.2/attest-linux-amd64
chmod +x attest-linux-amd64
sudo mv attest-linux-amd64 /usr/local/bin/attest
```

### Can I use ATTEST alongside my existing CI/CD system?

Yes! ATTEST is designed for gradual adoption. You can:
- Run ATTEST in parallel with existing CI/CD
- Use ATTEST for specific projects or environments
- Migrate incrementally using hybrid approaches

### What are the system requirements?

**Minimum Requirements:**
- CPU: 2 cores
- Memory: 4GB RAM
- Storage: 10GB free space
- Network: Internet access for downloads

**Recommended for Production:**
- CPU: 4+ cores
- Memory: 8GB+ RAM
- Storage: 100GB+ SSD
- Network: High-bandwidth connection

## 3. Configuration

### How do I create my first pipeline?

```bash
# Initialize in your project directory
cd your-project/
attest init

# Edit the generated attest.yaml
# Run your pipeline
attest run
```

### Can I import existing CI/CD configurations?

Yes, ATTEST can convert configurations from:
- GitHub Actions (.github/workflows/*.yml)
- GitLab CI (.gitlab-ci.yml)
- Jenkins (Jenkinsfile)
- CircleCI (.circleci/config.yml)

```bash
attest convert --from .github/workflows/ci.yml --to attest.yaml
```

### How do I configure environment-specific settings?

```yaml
# attest.yaml
environments:
  development:
    env:
      DEBUG: "true"
      API_URL: "https://dev-api.company.com"
  production:
    env:
      DEBUG: "false"
      API_URL: "https://api.company.com"
```

## 4. Caching

### How does ATTEST caching work?

ATTEST uses content-addressed caching with Blake3 hashing:
1. **Input Analysis**: All input files are hashed
2. **Cache Key Generation**: Blake3 hash of inputs + command + environment
3. **Cache Lookup**: Check if cache entry exists for this exact key
4. **Cache Storage**: Store outputs with the generated key

### Why is my cache hit rate low?

Common causes and solutions:

1. **Non-deterministic inputs**: 
   ```bash
   # Check for timestamp files, random data
   attest cache analyze --show-misses
   ```

2. **Environment variables changing**:
   ```yaml
   # Exclude non-essential variables
   steps:
     - name: "build"
       run: "npm run build"
       cache_exclude_env: ["BUILD_ID", "TIMESTAMP"]
   ```

3. **File permissions or metadata differences**:
   ```bash
   # Normalize file attributes
   attest config set cache.ignore_file_mode true
   ```

### Can I use external cache storage?

Yes, ATTEST supports multiple backends:

```yaml
cache:
  backend: "s3"
  bucket: "company-attest-cache"
  region: "us-west-2"
  
# Or Redis
cache:
  backend: "redis"
  endpoint: "redis.company.com:6379"
```

## 5. Security and Attestation

### How secure are Ed25519 signatures?

Ed25519 provides:
- **256-bit security level** (equivalent to 3072-bit RSA)
- **Deterministic signatures** (same input = same signature)
- **Fast verification** (microseconds, not milliseconds)
- **Small signature size** (64 bytes)
- **Resistance** to side-channel attacks

### How do I manage signing keys?

```bash
# Generate new key pair
attest keys generate --algorithm ed25519

# Import existing key
attest keys import --private-key signing.pem

# Use HSM or TPM for production
attest keys generate --hsm --slot 0
```

### What happens if my signing key is compromised?

1. **Immediately revoke** the compromised key:
   ```bash
   attest keys revoke ed25519-key-abc123... --reason "compromise"
   ```

2. **Generate new key** and update trust relationships:
   ```bash
   attest keys rotate --emergency
   ```

3. **Re-sign critical receipts** with new key:
   ```bash
   attest resign --key new-key.pem receipts/*.yaml
   ```

### How do I verify build authenticity?

```bash
# Verify single receipt
attest verify receipt_20241201_143052.yaml

# Verify with specific trusted keys
attest verify receipt.yaml --trusted-keys alice.pub,bob.pub

# Batch verification
find .attest/receipts -name "*.yaml" -exec attest verify {} \;
```

## 6. Performance

### Why are my builds slow?

Common performance issues:

1. **Cache misses**: Enable debug mode to see cache hit rates
   ```bash
   attest run --debug --show-cache-stats
   ```

2. **Large file copying**: Use symlinks or optimized copy strategies
   ```yaml
   steps:
     - name: "copy-files"
       run: "cp -al source/ dest/"  # Hard link instead of copy
   ```

3. **Network latency**: Use local or regional cache backends

4. **Resource constraints**: Check CPU/memory usage
   ```bash
   attest monitor resources --duration 5m
   ```

### How can I optimize build performance?

1. **Enable aggressive caching**:
   ```yaml
   cache:
     enabled: true
     compression: true
     max_size: "10GB"
   ```

2. **Parallelize independent steps**:
   ```yaml
   steps:
     - name: "lint"
       needs: ["install"]
     - name: "test"
       needs: ["install"]  # Runs parallel to lint
   ```

3. **Optimize Docker builds**:
   ```yaml
   steps:
     - name: "docker-build"
       run: "docker build --cache-from myapp:cache ."
   ```

### What's the overhead of cryptographic signing?

Signing overhead is minimal:
- **Signing time**: ~1ms per receipt
- **Verification time**: ~0.5ms per receipt
- **Storage overhead**: 64 bytes per signature
- **CPU impact**: <1% for typical workloads

## 7. Policies and Compliance

### How do I enforce security policies?

ATTEST includes built-in policy enforcement:

```yaml
policies:
  - name: "require-security-scan"
    type: "step-required"
    step_pattern: "*security*"
    enforcement: "strict"
    
  - name: "signed-production-builds"
    type: "signature-required"
    condition: "{{ env.ENVIRONMENT == 'production' }}"
```

### Can ATTEST help with compliance requirements?

Yes, ATTEST supports various compliance frameworks:

- **SOX**: Segregation of duties, change management
- **HIPAA**: Audit trails, access controls
- **PCI-DSS**: Secure development practices
- **ISO 27001**: Information security management
- **NIST**: Cybersecurity framework compliance

### How do I implement approval workflows?

```yaml
policies:
  - name: "production-approval"
    type: "approval-required"
    condition: "{{ env.ENVIRONMENT == 'production' }}"
    approvers:
      minimum: 2
      roles: ["security-officer", "release-manager"]
```

## 8. Integration

### Can I integrate ATTEST with my existing tools?

Yes, ATTEST provides:

- **REST API** for programmatic access
- **SDKs** for Python, JavaScript, Go, Rust
- **Webhooks** for event notifications
- **CLI** for scripting and automation

### How do I integrate with monitoring systems?

```yaml
monitoring:
  prometheus:
    enabled: true
    endpoint: ":9090"
  grafana:
    dashboards: true
  alerts:
    webhook: "https://alerts.company.com/webhook"
```

### Can I use ATTEST with GitOps?

ATTEST includes native GitOps support:

```yaml
gitops:
  enabled: true
  repository: "https://github.com/company/k8s-manifests"
  branch: "main"
  path: "applications/"
  verification:
    require_signatures: true
```

## 9. Troubleshooting

### My builds are failing with "permission denied" errors

This usually indicates file permission issues:

```bash
# Check and fix permissions
attest permissions check --fix-permissions

# Or manually fix
chmod -R u+rw .attest/
chown -R $USER:$USER .attest/
```

### I'm getting "cache corruption" errors

Cache corruption can occur due to disk issues or interrupted operations:

```bash
# Verify and repair cache
attest cache verify --repair

# Or rebuild cache completely
attest cache clear --all --rebuild
```

### How do I debug configuration issues?

```bash
# Validate configuration
attest config validate --strict

# Show resolved configuration
attest config show --resolved

# Debug mode for detailed logging
attest run --debug --log-level trace
```

## 10. Licensing and Support

### What license is ATTEST under?

- **Core ATTEST**: CoopyrightCode Light License (v1.1) - free for non-commercial use
- **Enterprise features**: Commercial license required
- **Professional support**: Available with commercial license

### How do I get support?

**Community Support:**
- GitHub Issues: https://github.com/Alien6-Studio/continuum-attest/issues
- Community Forum: https://community.attest.continuu.ms
- Discord: https://discord.gg/attest

**Professional Support:**
- Email: support@alien6.com
- Enterprise customers: Dedicated support channels
- SLA-backed response times for enterprise

### Can I contribute to ATTEST?

Yes! We welcome contributions:

1. **Code contributions**: Submit PRs to GitHub
2. **Documentation**: Help improve docs
3. **Bug reports**: File issues with detailed reproduction steps
4. **Feature requests**: Propose new features via GitHub issues

### How do I report security vulnerabilities?

Please report security issues responsibly:

- **Email**: security@attest.continuu.ms
- **PGP Key**: Available at https://attest.continuu.ms/security.asc
- **Do not** create public GitHub issues for security vulnerabilities

## 11. Enterprise Features

### What enterprise features are available?

Enterprise features include:
- **Multi-tenant management**
- **Advanced RBAC and SSO**
- **Compliance frameworks**
- **Professional support**
- **High availability deployment**
- **Advanced monitoring and analytics**

### How do I migrate from community to enterprise?

Migration is seamless:
1. **Contact sales** at contact@alien6.com
2. **Receive enterprise license key**
3. **Update configuration** with license key
4. **Enable enterprise features** as needed

### What's the pricing model?

Pricing is based on:
- **Number of build minutes** per month
- **Number of users/seats**
- **Enterprise features** required
- **Support level** needed

Contact contact@alien6.com for detailed pricing.

## 12. Best Practices

### What are the recommended best practices?

**Security:**
1. Use HSM or TPM for production signing keys
2. Implement least-privilege access controls
3. Enable comprehensive audit logging
4. Regular key rotation schedules
5. Policy-based compliance enforcement

**Performance:**
1. Enable caching for all expensive operations
2. Use appropriate cache backends for scale
3. Implement parallel execution where possible
4. Monitor and optimize resource usage
5. Regular performance testing and optimization

**Operations:**
1. Implement proper monitoring and alerting
2. Regular backup and disaster recovery testing
3. Gradual rollout of configuration changes
4. Comprehensive documentation and runbooks
5. Team training and knowledge sharing

### How do I scale ATTEST for large organizations?

**Architecture:**
- Use distributed cache backends (Redis Cluster, S3)
- Deploy multiple ATTEST instances with load balancing
- Implement proper resource limits and quotas
- Use Kubernetes for container orchestration

**Management:**
- Centralized configuration management
- Role-based access control (RBAC)
- Policy governance and compliance frameworks
- Comprehensive monitoring and analytics

**Operations:**
- Automated deployment and configuration
- Regular capacity planning and scaling
- Disaster recovery and business continuity
- Performance monitoring and optimization

This FAQ covers the most common questions about ATTEST. For additional help, please consult the documentation or contact support.