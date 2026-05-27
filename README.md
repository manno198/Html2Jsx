# HTML to JSX Converter
html2-jsx.vercel.app
A production-quality developer tool that converts HTML and basic JavaScript into valid React JSX, with detailed explanations for each transformation. Built as a learning and migration assistant for developers moving from HTML/JS to React.

![HTML to JSX Converter](https://img.shields.io/badge/React-19.0-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue) ![Monaco Editor](https://img.shields.io/badge/Monaco-VS_Code_Editor-blue)

## 🎯 Features

### Core Functionality
- **AST-Based Transformation**: Uses htmlparser2 and Babel for accurate HTML-to-JSX conversion
- **Monaco Editor Integration**: VS Code-like editing experience with syntax highlighting
- **Real-Time Conversion**: Auto-converts as you type (500ms debounce)
- **Component Wrapper**: Optional wrapping of JSX in React functional component

### Advanced Features
- **📝 Detailed Explanations**: Every transformation explained in simple language
- **🔍 Diff View**: Side-by-side comparison showing exactly what changed
- **⚠️ Error Detection**: Identifies common JSX mistakes and edge cases
- **📋 Copy to Clipboard**: One-click copy of converted JSX
- **🎨 Dark/Light Theme**: System-aware theme with manual toggle
- **📚 Example Templates**: Pre-built examples to test different scenarios

### Transformations Handled

| HTML Feature | JSX Conversion | Explanation |
|--------------|----------------|-------------|
| `class="..."` | `className="..."` | JSX uses className for CSS classes |
| `for="..."` | `htmlFor="..."` | JSX uses htmlFor for label association |
| `style="padding: 20px"` | `style={{ padding: "20px" }}` | Inline styles become objects |
| `onclick="..."` | `onClick={...}` | Event handlers are camelCased |
| `<input>` | `<input />` | Self-closing tags require `/` |
| `disabled` | `disabled={true}` | Boolean attributes become expressions |
| `data-*` / `aria-*` | Preserved | Data and ARIA attributes maintained |
| `<script>` tags | Detected & warned | Suggests React hooks/methods |

## 🏗️ Architecture

### Tech Stack
- **Frontend**: React 19, Tailwind CSS
- **Editors**: Monaco Editor (@monaco-editor/react)
- **Parsing**: htmlparser2 for HTML, Babel for JSX AST
- **UI Components**: Shadcn/UI with Radix primitives
- **Styling**: Tailwind CSS with custom design tokens
- **State Management**: React hooks (useState, useEffect, useCallback)

### Project Structure
```
frontend/
├── src/
│   ├── components/
│   │   ├── ui/                    # Shadcn UI components
│   │   ├── Header.jsx             # App header with theme toggle
│   │   ├── HTMLtoJSXConverter.jsx # Main converter component
│   │   ├── ExplanationPanel.jsx  # Transformation explanations
│   │   ├── DiffViewer.jsx         # Side-by-side diff view
│   │   └── ThemeProvider.jsx     # Theme context provider
│   ├── utils/
│   │   └── htmlToJsx.js           # Core conversion logic
│   ├── App.js                     # Root component
│   └── index.css                  # Design system tokens
└── package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and Yarn
- Modern browser with ES6+ support

### Installation

```bash
# Clone the repository
git clone <repository-url>

# Navigate to frontend directory
cd frontend

# Install dependencies
yarn install

# Start development server
yarn start
```

The app will open at `http://localhost:3000`

### Build for Production

```bash
yarn build
```

## 💡 Usage Examples

### Basic HTML Conversion
**Input:**
```html
<div class="container" style="padding: 20px;">
  <h1>Hello World</h1>
</div>
```

**Output:**
```jsx
<div className="container" style={{ padding: "20px" }}>
  <h1>Hello World</h1>
</div>
```

### Form Elements
**Input:**
```html
<label for="username">Username:</label>
<input type="text" id="username" required />
```

**Output:**
```jsx
<label htmlFor="username">Username:</label>
<input type="text" id="username" required={true} />
```

### Event Handlers
**Input:**
```html
<button onclick="handleClick()">Click Me</button>
```

**Output:**
```jsx
<button onClick={handleClick()}>Click Me</button>
```

### With Component Wrapper
Enable "Wrap in React component" to get:
```jsx
import React from 'react';

export const MyComponent = () => {
  return (
    <div className="container">
      <h1>Hello World</h1>
    </div>
  );
};

export default MyComponent;
```

## 🎨 Design System

The app uses a VS Code-inspired dark theme with a cohesive design system:

### Color Tokens (HSL)
- **Primary**: `217 91% 60%` - Tech blue for interactive elements
- **Editor Background**: `220 13% 18%` - Dark VS Code-like background
- **Success**: `142 76% 36%` - Green for successful transformations
- **Warning**: `38 92% 50%` - Amber for warnings
- **Destructive**: `0 84% 60%` - Red for errors

### Typography
- **Body**: Inter (400, 500, 600, 700)
- **Code**: Fira Code (400, 500) for monospace

## 🧪 Example Templates

The app includes 6 pre-built examples:
1. **Basic HTML** - Simple div with class and style
2. **Form Elements** - Input fields with labels
3. **Special Attributes** - Boolean and data attributes
4. **Event Handlers** - onclick and onchange events
5. **Complex Layout** - Nested elements with various attributes
6. **With Script Tag** - HTML with inline JavaScript (shows warnings)

## 🔧 Configuration

### Editor Options
Customize Monaco editor in `HTMLtoJSXConverter.jsx`:
```javascript
const editorOptions = {
  minimap: { enabled: false },
  fontSize: 14,
  lineNumbers: 'on',
  scrollBeyondLastLine: false,
  automaticLayout: true,
  tabSize: 2,
  wordWrap: 'on',
};
```

### Theme Customization
Modify design tokens in `src/index.css`:
```css
:root {
  --primary: 217 91% 60%;
  --editor-bg: 220 13% 18%;
  /* ... other tokens */
}
```

## 📦 Key Dependencies

```json
{
  "@monaco-editor/react": "^4.7.0",
  "htmlparser2": "^10.0.0",
  "@babel/parser": "^7.28.6",
  "@babel/traverse": "^7.28.6",
  "@babel/generator": "^7.28.6",
  "react-diff-viewer-continued": "^3.4.0",
  "@radix-ui/react-*": "Various versions",
  "lucide-react": "^0.507.0",
  "tailwindcss": "^3.4.17"
}
```

## 🚫 Limitations & Non-Goals

- **No legacy browser support** (IE, old Safari)
- **Not for full production migration** - Manual review still needed
- **No backend required** for v1 - All processing client-side
- **Script tags** are detected but not fully converted (shows warnings)

## 🧠 How It Works

### Conversion Pipeline

1. **HTML Parsing**: htmlparser2 parses HTML into DOM tree
2. **Tree Traversal**: Recursively process each node
3. **Attribute Conversion**: Transform HTML attributes to JSX props
4. **Style Processing**: Convert style strings to objects
5. **Event Handler Transformation**: CamelCase event names
6. **Explanation Generation**: Track each transformation
7. **Optional Wrapping**: Wrap in React component if requested
8. **Formatting**: Basic JSX formatting for readability

### AST Transformation
The conversion uses Abstract Syntax Tree (AST) parsing rather than regex:
- **htmlparser2** creates DOM tree from HTML
- **Babel parser** could extend this for JS-in-HTML scenarios
- Ensures accurate, maintainable transformations

## 🤝 Contributing

This is a portfolio/learning project. Contributions are welcome!

### Development Guidelines
- Follow existing code style (ESLint + Prettier)
- Use semantic commit messages
- Test transformations thoroughly
- Update examples for new features

## 📝 License

MIT License - feel free to use this project for learning and portfolio purposes.

## 🎓 Learning Resources

This tool demonstrates:
- React 19 hooks and modern patterns
- Monaco Editor integration
- AST-based code transformation
- Shadcn/UI component library
- Tailwind CSS design systems
- TypeScript-ready architecture

Perfect for:
- Bootcamp students learning React
- Developers migrating to React
- Portfolio projects showcasing frontend skills
- Understanding HTML → JSX differences

## 🙏 Acknowledgments

- Monaco Editor by Microsoft
- Shadcn/UI by shadcn
- htmlparser2 by fb55
- Babel by the Babel team
- Radix UI primitives

---

**Built with ❤️ as a developer tooling showcase project**
