## A

**Artifact**
: The output files or data produced by a pipeline step, such as compiled binaries, test reports, or deployment packages. ATTEST tracks and signs all artifacts with cryptographic hashes.

**Attestation**
: A cryptographically signed statement that certifies the integrity and authenticity of a build process or artifact. In ATTEST, attestations provide tamper-proof evidence of what happened during pipeline execution.

**ATTEST**
: A modern CI/CD platform that provides cryptographic attestation for build processes, combining content-addressed caching, Ed25519 signatures, and policy enforcement.

## B

**Blake3**
: A cryptographic hash function used by ATTEST for content-addressed caching and integrity verification. Blake3 is faster than SHA-256 while providing the same security level.

**Build**
: The process of transforming source code and dependencies into executable artifacts. In ATTEST, each build step is tracked, cached, and cryptographically signed.

## C

**Cache Hit**
: When ATTEST finds a valid cached result for a step's inputs, allowing it to skip re-execution and use the cached outputs. This dramatically improves build performance.

**Cache Key**
: A unique identifier generated from a step's inputs, command, and environment. ATTEST uses Blake3 hashing to create deterministic cache keys for reliable caching.

**Cache Miss**
: When no valid cached result exists for a step's inputs, requiring the step to be executed. Cache misses can occur due to input changes or cache expiration.

**Content-Addressed Storage**
: A storage system where data is identified by its content hash rather than location. ATTEST uses this approach for reliable, deduplicating cache storage.

**CRD (Custom Resource Definition)**
: A Kubernetes extension mechanism that allows custom resources to be defined. ATTEST uses CRDs for GitOps integration, defining resources like AttestApplication and AttestDeployment.

## D

**Dependency**
: A relationship between pipeline steps where one step must complete before another can begin. ATTEST uses the `needs` field to define step dependencies.

**Deterministic Build**
: A build process that produces identical outputs given identical inputs. ATTEST promotes deterministic builds through content-addressed caching and controlled environments.

## E

**Ed25519**
: An elliptic curve digital signature algorithm used by ATTEST for cryptographic signing. Ed25519 provides strong security with fast signing and verification.

**Environment**
: A set of configuration values (variables, settings) that define the context for pipeline execution. ATTEST supports multiple named environments like "development", "staging", and "production".

## F

**Fingerprint**
: A short, unique identifier derived from a cryptographic key or certificate. ATTEST uses fingerprints to identify signing keys and verify trust relationships.

## G

**Gatekeeper**
: A Kubernetes admission controller that enforces policies using the Open Policy Agent (OPA). ATTEST integrates with Gatekeeper for policy-based pipeline governance.

**GitOps**
: A deployment methodology where the desired state of systems is declared in Git repositories and automatically synchronized. ATTEST includes native GitOps support with verification.

## H

**Hash**
: A fixed-size value computed from input data using a cryptographic function. ATTEST uses Blake3 hashes to identify content, create cache keys, and verify integrity.

**HSM (Hardware Security Module)**
: A dedicated hardware device for secure key storage and cryptographic operations. ATTEST can integrate with HSMs for production-grade key management.

## I

**Input**
: Files or data that a pipeline step reads or depends on. ATTEST tracks inputs to determine when steps need re-execution and to generate appropriate cache keys.

**In-toto**
: A supply chain security framework that ATTEST is compatible with. In-toto provides specifications for secure software supply chain attestation.

## K

**Key Rotation**
: The process of replacing cryptographic keys with new ones for security purposes. ATTEST supports automated key rotation while maintaining trust relationships.

**Kubernetes**
: A container orchestration platform. ATTEST can be deployed on Kubernetes and includes native Kubernetes integration for GitOps workflows.

## L

**Lineage**
: The complete history and dependency chain of how an artifact was produced. ATTEST maintains detailed lineage through signed receipts and attestations.

## M

**Manifest**
: A file describing the desired state of resources or deployments. In GitOps, manifests define what should be deployed and how.

**Matrix Build**
: A build strategy that executes the same pipeline across multiple configurations (e.g., different OS versions, language versions). ATTEST supports matrix builds through configuration templates.

## O

**OPA (Open Policy Agent)**
: A policy engine that uses the Rego language to define and evaluate policies. ATTEST integrates OPA for flexible, code-based policy enforcement.

**Output**
: Files or data produced by a pipeline step. ATTEST tracks outputs for caching, artifact management, and dependency resolution.

## P

**Pipeline**
: A series of automated steps that transform source code into deployable artifacts. ATTEST pipelines are defined declaratively in YAML format.

**Policy**
: A rule or set of rules that govern pipeline behavior. ATTEST policies can enforce security requirements, compliance standards, and operational best practices.

**Provenance**
: Information about the origin and history of an artifact, including how it was built and who built it. ATTEST creates cryptographically signed provenance records.

## R

**Receipt**
: A signed record of pipeline execution containing detailed information about inputs, outputs, commands, and environment. Receipts provide tamper-proof audit trails.

**Rego**
: The policy language used by Open Policy Agent (OPA). Rego allows expressing complex policies as code for automated evaluation.

**Reproducible Build**
: A build process that produces identical outputs when repeated with the same inputs. ATTEST promotes reproducibility through deterministic execution and content addressing.

## S

**Signature**
: A cryptographic proof of authenticity created with a private key. ATTEST signs receipts and attestations to ensure they haven't been tampered with.

**SLSA (Supply-chain Levels for Software Artifacts)**
: A security framework specifying requirements for software supply chain integrity. ATTEST helps achieve SLSA compliance through attestation and verification.

**Step**
: An individual task or command within a pipeline. ATTEST steps can have dependencies, inputs, outputs, and caching configuration.

**Supply Chain Security**
: Practices and technologies that protect the software development and delivery process from attacks. ATTEST enhances supply chain security through cryptographic attestation.

## T

**TPM (Trusted Platform Module)**
: A hardware security chip that can store cryptographic keys and perform secure operations. ATTEST can use TPM for hardware-backed key storage.

**Trust Chain**
: A series of cryptographic signatures that establish trust from a root authority to end entities. ATTEST maintains trust chains for key delegation and verification.

## V

**Verification**
: The process of checking that signatures are valid and policies are satisfied. ATTEST performs verification before deployment to ensure integrity.

**Vulnerability**
: A security weakness in software or systems. ATTEST can integrate vulnerability scanning into pipelines and enforce policies based on scan results.

## W

**Webhook**
: An HTTP callback triggered by events. ATTEST supports webhooks for integration with external systems and notification of pipeline events.

**Workflow**
: Another term for pipeline, referring to the sequence of automated steps in a CI/CD process. ATTEST workflows are defined in `attest.yaml` files.

## Common Acronyms

**API**
: Application Programming Interface - ATTEST provides REST APIs for programmatic access.

**CI/CD**
: Continuous Integration/Continuous Deployment - The practice of automating software build, test, and deployment processes.

**CLI**
: Command Line Interface - ATTEST provides a comprehensive CLI tool for pipeline management.

**CRD**
: Custom Resource Definition - Kubernetes extension mechanism used by ATTEST's GitOps features.

**RBAC**
: Role-Based Access Control - Security model for managing user permissions based on roles.

**SDK**
: Software Development Kit - ATTEST provides SDKs for multiple programming languages.

**YAML**
: Yet Another Markup Language - The configuration format used by ATTEST for pipeline definitions.

## Technical Terms

**Content-Addressed**
: A storage and retrieval method where data is identified by its content hash rather than location or name.

**Cryptographic Hash**
: A mathematical function that produces a fixed-size output from arbitrary input, used for integrity verification and content identification.

**Digital Signature**
: A cryptographic mechanism that provides authentication, non-repudiation, and integrity assurance for digital messages or documents.

**Hermetic Build**
: A build process that is isolated from external dependencies and produces consistent results regardless of the environment.

**Immutable**
: Unable to be changed after creation. ATTEST receipts and signed attestations are immutable to prevent tampering.

**Merkle Tree**
: A tree data structure where each node contains the hash of its children, enabling efficient and secure verification of large data structures.

**Nonce**
: A random number used once in cryptographic operations to prevent replay attacks and ensure uniqueness.

**Zero-Knowledge Proof**
: A cryptographic method where one party can prove knowledge of information without revealing the information itself.

This glossary provides definitions for key terms used throughout ATTEST documentation and the broader CI/CD and security domains.