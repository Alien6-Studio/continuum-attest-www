## 1. Overview

ATTEST uses cryptographic attestation to create tamper-proof records of build processes. Every step in your pipeline is cryptographically signed and verifiable, providing complete audit trails and supply chain security.

## 2. Ed25519 Cryptographic Signatures

### 2.1 Why Ed25519?

ATTEST uses Ed25519 signatures for optimal security and performance:

- **Fast**: Extremely fast signing and verification
- **Secure**: Cryptographically strong (256-bit security)
- **Deterministic**: Same input always produces same signature
- **Small**: Compact signature size (64 bytes)
- **Widely supported**: Standard across security tools

### 2.2 Key Management

```bash
# Generate new key pair
attest keys generate --algorithm ed25519

# View public key (safe to share)
attest keys show --public

# Import existing key
attest keys import --private-key path/to/key.pem

# List all keys
attest keys list
```

## 3. Receipt Structure

### 3.1 Complete Receipt Format

```yaml
# receipt_20241201_143052.yaml
pipeline_hash: "blake3:abc123def456..."
timestamp: "2024-12-01T14:30:52Z"
total_duration_secs: 127
attest_version: "0.1.2"

environment:
  host_os: "linux"
  host_arch: "x86_64"
  user: "ci-user"
  working_directory: "/workspace"

steps:
  - name: "build"
    command: "npm run build"
    exit_code: 0
    duration_secs: 45
    start_time: "2024-12-01T14:30:07Z"
    end_time: "2024-12-01T14:30:52Z"
    inputs:
      - path: "src/"
        hash: "blake3:def456abc123..."
        size_bytes: 15420
      - path: "package.json"
        hash: "blake3:789xyz456abc..."
        size_bytes: 1024
    outputs:
      - path: "dist/"
        hash: "blake3:xyz789def456..."
        size_bytes: 45120
    environment_snapshot:
      NODE_ENV: "production"
      CI: "true"

# Cryptographic proof
signature: "ed25519:signature_hex_string..."
signer_public_key: "ed25519:public_key_hex..."
signature_algorithm: "ed25519"
```

## 4. Attestation Types

### 4.1 Build Attestations

Prove that artifacts were built correctly:

```yaml
attestations:
  build:
    type: "attest/build"
    predicate:
      builder:
        id: "attest@v0.1.2"
      recipe:
        type: "attest/pipeline"
        defined_in: "attest.yaml"
      materials:
        - uri: "git+https://github.com/company/app@abc123"
          digest: "sha256:def456..."
      byproducts:
        - name: "build-log"
          uri: "file://build.log"
```

### 4.2 Test Attestations

Verify test execution and results:

```yaml
attestations:
  test:
    type: "attest/test"
    predicate:
      test_framework: "jest"
      test_results:
        total: 150
        passed: 148
        failed: 2
        skipped: 0
      coverage:
        lines: 85.4
        branches: 82.1
        functions: 90.2
```

### 4.3 Security Scan Attestations

Document security scanning results:

```yaml
attestations:
  security:
    type: "attest/vulnerability-scan"
    predicate:
      scanner:
        name: "trivy"
        version: "0.45.0"
      results:
        vulnerabilities:
          critical: 0
          high: 2
          medium: 5
          low: 12
        scan_date: "2024-12-01T14:25:00Z"
```

## 5. Verification Process

### 5.1 Signature Verification

```bash
# Verify a single receipt
attest verify receipt_20241201_143052.yaml

# Verify with specific public key
attest verify receipt_20241201_143052.yaml \
  --public-key ed25519-key-abc123...

# Verify against trusted keyring
attest verify receipt_20241201_143052.yaml \
  --trusted-keys-file trusted-keys.pem

# Batch verification
find .attest/receipts -name "*.yaml" -exec attest verify {} \;
```

### 5.2 Trust Chains

```bash
# Establish trust relationships
attest keys trust alice@company.com.pub \
  --role developer \
  --scope "project:myapp"

# Verify trust chain
attest verify receipt.yaml --check-trust-chain

# Show trust relationships
attest keys trust-graph --format dot
```

## 6. Supply Chain Security

### 6.1 SLSA Compliance

ATTEST provides SLSA (Supply chain Levels for Software Artifacts) compliance:

```yaml
# SLSA Level 3 compliance
slsa:
  build_level: 3
  requirements:
    - "Hermetic build environment"
    - "Cryptographically signed provenance"
    - "Tamper-resistant build service"
    - "Build parameters verified"
```

### 6.2 In-toto Integration

Compatible with in-toto supply chain security framework:

```bash
# Generate in-toto metadata
attest export --format in-toto \
  --layout supply-chain.layout \
  --output metadata/

# Verify supply chain
in-toto-verify --layout supply-chain.layout \
  --layout-keys alice.pub bob.pub
```

## 7. Advanced Verification

### 7.1 Custom Verification Rules

```yaml
# .attest/verification.yaml
verification:
  rules:
    - name: "require-build-attestation"
      type: "attestation-required"
      attestation_type: "attest/build"
      
    - name: "trusted-builder-only"
      type: "signer-allowed"
      allowed_signers:
        - "ci-system@company.com"
        - "release-manager@company.com"
        
    - name: "recent-build-only"
      type: "max-age"
      max_age: "24h"
```

### 7.2 Policy-Based Verification

```rego
package attest.verification

# Verify build integrity
allow {
    input.attestation.type == "attest/build"
    input.signature.verified == true
    trusted_signer(input.signature.signer)
    recent_build(input.attestation.timestamp)
}

trusted_signer(signer) {
    signer in data.trusted_signers
}

recent_build(timestamp) {
    time.now_ns() - time.parse_rfc3339_ns(timestamp) < 86400000000000  # 24 hours
}
```

## 8. Integration Examples

### 8.1 CI/CD Pipeline Integration

```yaml
# GitHub Actions
- name: Sign and Attest
  run: |
    attest run --sign --verify
    attest upload-receipt --destination s3://company-receipts/

# GitLab CI
attest:
  stage: build
  script:
    - attest run --sign
    - attest verify receipt_*.yaml --strict
  artifacts:
    paths:
      - .attest/receipts/
```

### 8.2 Container Registry Integration

```bash
# Sign container images
attest container sign myapp:v1.2.3 \
  --key-file signing.key \
  --attach-receipt

# Verify container before deployment
attest container verify myapp:v1.2.3 \
  --require-attestation \
  --trusted-keys trusted.pub
```

## 9. Key Rotation

### 9.1 Automated Key Rotation

```bash
# Generate new key pair
attest keys rotate --current-key old-key.pem \
  --new-key new-key.pem \
  --transition-period 30d

# Update trust relationships
attest keys update-trust \
  --old-key old-key-fingerprint \
  --new-key new-key-fingerprint
```

### 9.2 Emergency Key Revocation

```bash
# Revoke compromised key
attest keys revoke ed25519-key-abc123... \
  --reason "Key compromise" \
  --effective-date 2024-12-01T00:00:00Z

# Update revocation list
attest keys publish-crl \
  --output company-crl.pem \
  --upload-to https://crl.company.com/
```

## 10. Hardware Security Modules

### 10.1 HSM Integration

```yaml
# .attest/hsm.yaml
hsm:
  enabled: true
  provider: "pkcs11"
  library: "/usr/lib/libpkcs11.so"
  slot: 0
  pin_source: "env:HSM_PIN"
  
signing:
  use_hsm: true
  key_label: "attest-signing-key"
```

### 10.2 TPM Integration

```bash
# Use TPM for signing
attest run --sign --tpm-key-handle 0x81000001

# Generate TPM-backed key
attest keys generate --tpm --persistent-handle 0x81000001
```

## 11. Monitoring and Auditing

### 11.1 Signature Metrics

```
# Signature operations
attest_signatures_created_total{algorithm="ed25519"}
attest_signatures_verified_total{result="valid"}
attest_signature_verification_duration_seconds

# Key usage
attest_key_usage_total{key_id="abc123",operation="sign"}
attest_key_rotation_total{reason="scheduled"}
```

### 11.2 Audit Logging

```json
{
  "timestamp": "2024-12-01T14:30:52Z",
  "event": "signature_created",
  "key_id": "ed25519-abc123...",
  "resource": "receipt_20241201_143052.yaml",
  "algorithm": "ed25519",
  "user": "ci-system@company.com"
}
```

## 12. Best Practices

### 12.1 Key Management

1. **Use dedicated keys** for different environments
2. **Implement key rotation** on a regular schedule
3. **Store private keys securely** (HSM, TPM, or secure vaults)
4. **Never commit private keys** to version control
5. **Monitor key usage** and detect anomalies

### 12.2 Verification

1. **Always verify signatures** before deployment
2. **Use trust chains** for delegation
3. **Implement time-based validity** checks
4. **Maintain revocation lists** for compromised keys
5. **Audit verification results** regularly

### 12.3 Compliance

1. **Document key management procedures**
2. **Implement access controls** for signing operations
3. **Maintain audit trails** for all signature operations
4. **Regular security assessments** of cryptographic practices
5. **Compliance reporting** for regulatory requirements

## 13. Troubleshooting

### 13.1 Common Issues

```bash
# Signature verification fails
attest verify receipt.yaml --debug

# Key not found
attest keys import --help

# HSM connection issues
attest hsm test-connection --verbose

# Time synchronization problems
attest verify receipt.yaml --tolerance 5m
```

The ATTEST attestation system provides cryptographic proof of build integrity, enabling secure supply chains and compliance with security standards.