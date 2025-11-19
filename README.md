<div align="center">

# 🔄 JSON to TOON Converter

**A modern web-based converter for the TOON data format**

[![React](https://img.shields.io/badge/React-18.2+-61DAFB?logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0+-646CFF?logo=vite)](https://vitejs.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3+-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

[Features](#-features) • [Getting Started](#-getting-started) • [Usage](#-usage) • [Contributing](#-contributing)

</div>

---

## 📋 About

**JSON to TOON Converter** is a powerful web application that allows you to easily convert between JSON and the [TOON format](https://github.com/toon-format/toon) — a token-oriented data format optimized for LLM processing.

Built with React and Chakra UI, it provides a seamless experience for developers and prompt engineers working with Large Language Models.

## ✨ Features

### 🎯 Core Capabilities

- **🔄 Bidirectional Conversion**
  - Convert JSON to TOON
  - Convert TOON back to JSON

- **⚙️ Advanced Configuration**
  - Support for multiple delimiters (Comma, Tab, Pipe)
  - **Key Folding** support for compact nested structures
  - Strict mode validation

- **📊 Token Analysis**
  - Real-time token counting for both input and output
  - Uses `cl100k_base` encoding (GPT-4 standard)

- **💻 Modern UI/UX**
  - Dark/Light mode support
  - Syntax highlighting (Monaco Editor)
  - Drag & drop file upload
  - One-click copy and download

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm / yarn / pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/eveiljuice/json-to-toon.git
cd json-to-toon

# Install dependencies
npm install

# Start the development server
npm run dev
```

## 📖 Usage

1. **Select Mode**: Toggle between "JSON to TOON" and "TOON to JSON" using the switch in the header.
2. **Input Data**: Paste your code or drag & drop a file into the left editor.
3. **Configure**:
   - Choose your preferred **Delimiter** (Tab is recommended for LLMs).
   - Enable **Key Folding** to flatten nested objects.
4. **Convert**: Click the "Convert" button.
5. **Export**: Copy the result or download it as a file.

## 🏗️ Project Structure

```
json-to-toon/
├── public/              # Static assets
├── src/
│   ├── App.tsx          # Main application logic
│   ├── main.tsx         # Entry point
│   ├── theme.ts         # Chakra UI theme configuration
│   └── ...
├── package.json         # Dependencies and scripts
├── tsconfig.json        # TypeScript configuration
└── vite.config.ts       # Vite configuration
```

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m "Add amazing feature"`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

## 📝 License

This project is licensed under the MIT License.

## 🔗 Links

- [TOON Format Specification](https://github.com/toon-format/toon)
- [VS Code Extension](https://github.com/eveiljuice/vscode-toon)

---

<div align="center">

**Made with ❤️ for the TOON community**

[⭐ Star this repo](https://github.com/eveiljuice/json-to-toon) • [🐛 Report Bug](https://github.com/eveiljuice/json-to-toon/issues)

</div>
