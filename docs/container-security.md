# Container Security and Isolation

This document describes the advanced container security features implemented in ATTEST, including syscall filtering, filesystem restrictions, and violation detection.

## Overview

ATTEST provides comprehensive container security through multiple layers of protection:

1. **Seccomp Syscall Filtering** - System call access control
2. **Filesystem Security** - Path-based access restrictions
3. **Enhanced Container Isolation** - Advanced container security
4. **Violation Detection** - Security event monitoring

## Security Levels

ATTEST supports three security levels aligned with operational modes:

### Minimal Security (Light Mode)
- **Target**: Development, testing, personal projects
- **Performance Impact**: ~5-15% overhead
- **Seccomp Profile**: Basic blocking of dangerous syscalls
- **Filesystem**: Default policy with basic protections
- **Isolation**: Process-level isolation

### Standard Security (Verifiable Mode)
- **Target**: Enterprise CI/CD, production builds
- **Performance Impact**: ~15-30% overhead
- **Seccomp Profile**: Syscall allowlist with tracing
- **Filesystem**: Balanced restrictions with monitoring
- **Isolation**: Container-based isolation

### Maximum Security (Formal Proof Mode)
- **Target**: Regulated industries, critical infrastructure
- **Performance Impact**: ~30-50% overhead
- **Seccomp Profile**: Minimal syscall allowlist, kill by default
- **Filesystem**: Strict access controls and limits
- **Isolation**: Enhanced container with comprehensive restrictions

## Seccomp Syscall Filtering

### Built-in Profiles

#### Minimal Profile
```json
{
  "defaultAction": "SCMP_ACT_ALLOW",
  "syscalls": [
    {
      "names": ["ptrace", "kexec_load", "module_load", "reboot"],
      "action": "SCMP_ACT_KILL"
    }
  ]
}
```

#### Standard Profile
```json
{
  "defaultAction": "SCMP_ACT_ERRNO(1)",
  "syscalls": [
    {
      "names": ["read", "write", "open", "openat", "close"],
      "action": "SCMP_ACT_ALLOW"
    },
    {
      "names": ["fork", "vfork", "clone"],
      "action": "SCMP_ACT_TRACE"
    },
    {
      "names": ["socket", "ptrace", "mount"],
      "action": "SCMP_ACT_KILL"
    }
  ]
}
```

#### Maximum Profile
```json
{
  "defaultAction": "SCMP_ACT_KILL",
  "syscalls": [
    {
      "names": ["read", "write", "openat", "close", "mmap", "exit"],
      "action": "SCMP_ACT_ALLOW"
    }
  ]
}
```

### Usage

```rust
use attest::sandbox::{SeccompManager, SecurityLevel};

let mut manager = SeccompManager::new();
manager.set_profile("maximum")?;

// Generate container-compatible profile
let profile_json = manager.generate_container_profile("maximum")?;
```

## Filesystem Security

### Security Policies

The filesystem security manager enforces path-based access controls:

```rust
use attest::sandbox::filesystem_security::*;

let mut manager = FilesystemSecurityManager::with_strict_policy();

// Check path access
let allowed = manager.check_path_access(
    &PathBuf::from("/workspace/file.txt"),
    AccessMode::ReadWrite
)?;
```

### Default Rules

| Path Pattern | Access Mode | Description |
|--------------|-------------|-------------|
| `/tmp/*` | ReadWrite | Temporary directory access |
| `/workspace/*` | ReadWrite | Workspace directory access |
| `/etc/*` | Forbidden | Block system configuration |
| `/proc/*` | Forbidden | Block process filesystem |
| `/sys/*` | Forbidden | Block system filesystem |

### Path Traversal Protection

The system automatically detects and blocks path traversal attempts:

```rust
// These paths will be blocked
let dangerous_paths = [
    "/workspace/../etc/passwd",
    "/tmp/../../root/.ssh/id_rsa",
    "/workspace/subdir/../../../etc/shadow",
];
```

### File Extension Filtering

Dangerous file extensions are automatically blocked:

```rust
let forbidden_extensions = [
    "exe", "bat", "cmd", "com", "scr"
];
```

### Resource Limits

The filesystem security manager enforces resource limits:

- **File Size Limit**: Maximum individual file size
- **Disk Usage Limit**: Total disk usage across all operations
- **File Count Limits**: Maximum number of files

## Enhanced Container Sandbox

### Creation

```rust
use attest::sandbox::*;

let config = container::ContainerUtils::secure_attest_config("alpine:latest");
let mut sandbox = EnhancedContainerSandbox::new(
    config,
    SecurityLevel::Maximum,
    NetworkPolicy::Disabled,
)?;
```

### Secure Execution

```rust
let result = sandbox.execute_secure(
    "echo",
    &["Hello, World!".to_string()],
    &env_vars,
    Some(&workspace_dir),
).await?;
```

### Container Runtime Support

The enhanced sandbox supports multiple container runtimes:

#### Docker
```bash
docker run --rm \
  --security-opt seccomp=/path/to/profile.json \
  --security-opt no-new-privileges:true \
  --cap-drop ALL \
  --read-only \
  --tmpfs /tmp:rw,noexec,nosuid,size=100m \
  alpine:latest echo "Hello"
```

#### Podman
```bash
podman run --rm \
  --security-opt seccomp=/path/to/profile.json \
  --security-opt no-new-privileges \
  --cap-drop ALL \
  --read-only \
  --tmpfs /tmp:rw,noexec,nosuid,size=100m \
  alpine:latest echo "Hello"
```

## Violation Detection and Monitoring

### Seccomp Violations

```rust
#[derive(Debug, Clone)]
pub struct SeccompViolation {
    pub timestamp: DateTime<Utc>,
    pub pid: u32,
    pub syscall: String,
    pub action: SeccompAction,
    pub context: String,
}
```

### Filesystem Violations

```rust
#[derive(Debug, Clone)]
pub struct FilesystemViolation {
    pub timestamp: DateTime<Utc>,
    pub path: PathBuf,
    pub attempted_access: AccessMode,
    pub violation_type: FilesystemViolationType,
    pub context: String,
}
```

### Violation Types

- **ForbiddenPath**: Access to blocked path
- **PathTraversal**: Directory traversal attempt  
- **SymlinkViolation**: Symlink restriction violation
- **FileSizeLimit**: File size limit exceeded
- **DiskUsageLimit**: Disk usage limit exceeded
- **ForbiddenExtension**: Dangerous file extension

### Security Reporting

```rust
let report = sandbox.export_security_report()?;
```

Example security report:
```json
{
  "security_level": "maximum",
  "network_policy": "disabled",
  "seccomp": {
    "profile": {
      "name": "maximum",
      "total_rules": 9,
      "allowed_syscalls": 6,
      "blocked_syscalls": 3,
      "default_action": "Kill"
    },
    "violations": []
  },
  "filesystem": {
    "policy_summary": "Filesystem Security Policy:\n- Default access: Forbidden\n- Rules: 5 active\n- Max file size: Some(10485760)\n- Max disk usage: Some(104857600)",
    "violations": []
  },
  "generated_at": "2024-01-15T10:30:00Z"
}
```

## Integration with Operation Modes

### Light Mode
```yaml
# attest.yaml
mode: light
sandbox:
  isolation_level: process
  security_level: minimal
  seccomp_profile: minimal
```

### Verifiable Mode
```yaml
# attest.yaml
mode: verifiable
sandbox:
  isolation_level: container
  security_level: standard
  seccomp_profile: standard
  network_policy: disabled
```

### Formal Proof Mode
```yaml
# attest.yaml
mode: formal-proof
sandbox:
  isolation_level: strict_container
  security_level: maximum
  seccomp_profile: maximum
  network_policy: disabled
  filesystem_policy: strict
```

## Best Practices

### Development Environment
1. Use **Light Mode** for fast iteration
2. Enable basic syscall filtering
3. Allow filesystem access for debugging

### CI/CD Pipeline
1. Use **Verifiable Mode** for production builds
2. Enable syscall tracing for audit
3. Restrict network access
4. Monitor security violations

### Production/Regulated
1. Use **Formal Proof Mode** for maximum security
2. Enable all security features
3. Strict filesystem controls
4. Comprehensive violation logging
5. Regular security report reviews

## Security Considerations

### Container Escape Prevention
- Seccomp profiles block dangerous syscalls
- Filesystem restrictions prevent path traversal
- Process isolation limits system access
- Network isolation prevents data exfiltration

### Compliance Alignment
- **SLSA Level 4**: Formal proof mode meets highest requirements
- **FedRAMP**: Maximum security suitable for government use
- **SOC 2**: Comprehensive audit logging and controls
- **ISO 27001**: Risk-based security controls

### Performance vs Security Trade-offs
- Light mode: Fast but basic protection
- Standard mode: Balanced performance and security
- Maximum mode: Comprehensive security with performance cost

## Troubleshooting

### Common Issues

#### Seccomp Violations
```
Error: Container killed by seccomp policy
Solution: Review syscall requirements, adjust profile if needed
```

#### Filesystem Access Denied
```
Error: Path access forbidden by policy
Solution: Check filesystem rules, ensure path is in allowlist
```

#### Container Runtime Issues
```
Error: Seccomp profile not supported
Solution: Update container runtime, check compatibility
```

### Debugging

Enable debug logging:
```rust
env_logger::init();
// or
tracing_subscriber::init();
```

Check security reports:
```rust
let report = sandbox.export_security_report()?;
println!("{}", report);
```

### Custom Profiles

Create custom seccomp profile:
```rust
let mut manager = SeccompManager::new();
manager.load_profile_from_file(&custom_profile_path)?;
manager.set_profile("custom")?;
```

Create custom filesystem policy:
```rust
let mut policy = FilesystemSecurityPolicy::default();
policy.rules.push(FilesystemRule {
    path_pattern: "/custom/*".to_string(),
    access_mode: AccessMode::ReadOnly,
    recursive: true,
    priority: 500,
    description: "Custom path access".to_string(),
});
```

## See Also

- [Operation Modes](operation-modes.md) - Overview of ATTEST operation modes
- [Pipeline Configuration](pipeline-configuration.md) - Configuring ATTEST pipelines  
- [Cryptographic Attestation](cryptographic-attestation.md) - Digital signatures and verification
- [Compliance Framework](compliance-framework.md) - Meeting regulatory requirements