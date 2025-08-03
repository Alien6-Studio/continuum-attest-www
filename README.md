# CONTINUUM ATTEST - Documentation

[![Documentation Status](https://readthedocs.org/projects/continuum-attest-www/badge/?version=latest)](https://continuum-attest-www.readthedocs.io/en/latest/?badge=latest)

This repository contains the public documentation for **CONTINUUM ATTEST**, a verifiable CI/CD platform with cryptographic attestation.

## 📖 Documentation

The documentation is hosted on Read the Docs: **[continuum-attest-www.readthedocs.io](https://continuum-attest-www.readthedocs.io/)**

## 🚀 Local Development

### Prerequisites

- Python 3.11+
- pip

### Setup

1. Clone this repository:
   ```bash
   git clone https://github.com/Alien6-Studio/continuum-attest-www.git
   cd continuum-attest-www
   ```

2. Install dependencies:
   ```bash
   make install
   # or
   pip install -r requirements.txt
   ```

3. Serve the documentation locally:
   ```bash
   make serve
   # or
   mkdocs serve
   ```

4. Open your browser to `http://localhost:8000`

### Building

To build the static documentation:

```bash
make build
# or
mkdocs build
```

## 📁 Structure

```
continuum-attest-www/
├── docs/                 # Documentation source files
├── assets/              # Images, stylesheets, and scripts
├── overrides/           # Custom MkDocs templates
├── mkdocs.yml          # MkDocs configuration
├── .readthedocs.yaml   # Read the Docs configuration
├── requirements.txt    # Python dependencies
└── README.md          # This file
```

## 🤝 Contributing

We welcome contributions to improve the documentation! Please:

1. Fork this repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This documentation is licensed under the CoopyrightCode Light License.

## 🔗 Related

- **Main Project**: [Continuum Attest](https://github.com/Alien6-Studio/continuum-attest) (Private Repository)
- **Contact**: [contact@alien6.com](mailto:contact@alien6.com)

---

**Powered by [MkDocs](https://www.mkdocs.org/) and [Material for MkDocs](https://squidfunk.github.io/mkdocs-material/)**
