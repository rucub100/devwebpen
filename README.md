# 🌐 webpen: A Developer's Swiss Army Knife for Web Applications 🖊️

Are you tired of juggling multiple tools for API testing and web security? Webpen is a desktop application that streamlines your workflow by combining essential features found in tools like [Postman](https://www.postman.com/)™️, [Insomnia](https://insomnia.rest/)™️, [Burp Suite](https://portswigger.net/burp)™️, and [ZAP](https://www.zaproxy.org/)™️. While those powerhouses excel in specialized areas, webpen focuses on providing a modern, user-friendly experience for everyday web development and security testing.

Designed with developers and security professionals in mind, webpen empowers you to:

- **Test APIs:** Send requests, analyze responses, and automate your API testing workflow.
- **Scan for Vulnerabilities:** Identify security risks in your web applications with integrated scanning tools.
- **Develop Securely:** Integrate security testing seamlessly into your development process.

## Getting Started

### Prerequisites

- [Tauri](https://v2.tauri.app/start/prerequisites/)

### Development Workflow

### Related Topics

- [Tauri](https://v2.tauri.app/)
- [Rust](https://www.rust-lang.org/)
- [Node.js](https://nodejs.org/en)
- [Vite](https://vite.dev/)
- [React](https://react.dev/)
- [GraalVM](https://www.graalvm.org/)
- [PortSwigger](https://portswigger.net/web-security)
- [ZAP](https://www.zaproxy.org/)
- [OWASP](https://owasp.org/projects/)

### Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)

## Key Features

- [ ] **Proxy with Interception:** Inspect and modify HTTP/HTTPS traffic.
- [ ] **HTTP Client:** Send requests, analyze responses, and test APIs.
- [ ] **Web Spider:** Automatically crawl and map websites.
- [ ] **Security Scanner:** Identify vulnerabilities and security risks.
- [ ] **Encoding/Decoding Tools:** Base64, URL encoding, and more.
- [ ] **Extensibility:** Support for plugins and scripts.

TODO: Screenshots

## Concepts

This section provides a deeper dive into the core concepts and design choices behind `webpen`.

### Architecture

- **Frontend:** Tauri + React + TypeScript (responsible for the user interface and user interactions)
- **Backend (core):** Rust (handles core logic, data processing, and communication with the daemon)
- **Daemon:** Java (provides long-running tasks, background processing, and potentially interacts with external services)
- **Communication:** gRPC (efficient and secure communication between the Tauri app and the Java daemon)

[Optional/TODO: Include a diagram to visually represent the architecture]

### [TODO: Concept 2 Title (e.g., Security Scanning)]

TODO
