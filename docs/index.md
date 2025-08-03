---
title: CONTINUUM ATTEST
description: Complete documentation for Continuum Attest - Next-generation CI/CD with cryptographic attestation
template: home.html
hide:
  - toc
---

# Welcome to Continuum Attest

**Verifiable CI/CD Platform with Cryptographic Attestation**

ATTEST is the only CI/CD platform that provides end-to-end cryptographic attestation, from source code to production deployment. Every build step is signed, every artifact is verified, and every deployment is provable.

## Quick Navigation

- **New to ATTEST?** Start with [Overview](overview.md) then [Installation](installation.md)
- **Ready to build?** Jump to [First Steps](first-steps.md)  
- **Core concepts?** Read [Core Concepts](concepts.md)
- **Having issues?** Visit [Troubleshooting](troubleshooting.md)

## What You'll Learn

This user guide will teach you how to:

- **Install and configure** ATTEST on any system
- **Create secure pipelines** with cryptographic attestation
- **Implement GitOps** workflows with Kubernetes
- **Enforce policies** and maintain compliance
- **Optimize performance** with intelligent caching
- **Migrate existing** CI/CD pipelines to ATTEST
- **Scale enterprise-wide** with governance and monitoring

## Getting Started

The fastest way to get started:

```bash
# Install ATTEST
curl -sSL https://raw.githubusercontent.com/Alien6-Studio/continuum-attest/main/scripts/install.sh | sh

# Create your first pipeline
cd your-project
attest init

# Run with full security
attest run --verify --sign
```

## Key Features

- **Cryptographic Attestation**: Every build step signed with Ed25519
- **Content-Addressed Caching**: Blake3-based intelligent caching
- **GitOps Native**: Kubernetes CRDs with verification
- **Policy Enforcement**: OPA/Gatekeeper integration
- **Multi-Cloud**: Deploy across any Kubernetes cluster
- **Audit Ready**: SOX, HIPAA, and compliance frameworks

## Documentation Sections

| Section | Description |
|---------|-------------|
| [**Getting Started**](installation.md) | Installation, first steps, core concepts |
| [**User Guide**](pipeline-configuration.md) | Pipeline config, CLI, attestation, caching |
| [**Advanced Topics**](gitops.md) | GitOps, policies, CI/CD integration, monitoring |
| [**Practical Applications**](examples.md) | Examples, migration, enterprise, troubleshooting |
| [**Reference**](api.md) | API docs, pipeline format, FAQ, glossary |

---

**Ready to revolutionize your CI/CD?** → [Get Started](installation.md)