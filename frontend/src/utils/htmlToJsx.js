import * as parser from '@babel/parser';
import traverse from '@babel/traverse';
import generate from '@babel/generator';
import * as t from '@babel/types';
import { parseDocument } from 'htmlparser2';
import { DomHandler } from 'htmlparser2';

/**
 * Convert HTML to JSX with detailed explanations
 * @param {string} html - Raw HTML input
 * @param {boolean} wrapInComponent - Whether to wrap output in a React component
 * @returns {Object} - { jsx: string, explanations: array, errors: array }
 */
export const convertHTMLtoJSX = (html, wrapInComponent = false) => {
  const explanations = [];
  const errors = [];
  const warnings = [];

  try {
    // Parse HTML
    const handler = new DomHandler();
    const domParser = parseDocument(html, { 
      lowerCaseAttributeNames: false,
      recognizeSelfClosing: true 
    });

    let jsxCode = processNode(domParser, explanations, errors, warnings);

    // Clean up the output
    jsxCode = jsxCode.trim();

    // Wrap in component if requested
    if (wrapInComponent) {
      jsxCode = wrapInReactComponent(jsxCode);
      explanations.push({
        type: 'info',
        title: 'Component Wrapper',
        description: 'Wrapped JSX in a functional React component.',
        before: jsxCode,
        after: jsxCode
      });
    }

    // Format the output
    jsxCode = formatJSX(jsxCode);

    return {
      jsx: jsxCode,
      explanations: [...explanations, ...warnings],
      errors
    };
  } catch (error) {
    errors.push({
      type: 'error',
      message: `Parsing error: ${error.message}`
    });
    return {
      jsx: '',
      explanations,
      errors
    };
  }
};

/**
 * Process DOM node recursively
 */
const processNode = (node, explanations, errors, warnings) => {
  if (!node) return '';

  // Handle arrays of nodes
  if (Array.isArray(node)) {
    return node.map(n => processNode(n, explanations, errors, warnings)).join('');
  }

  // Handle text nodes
  if (node.type === 'text') {
    return node.data;
  }

  // Handle comments
  if (node.type === 'comment') {
    return `{/* ${node.data} */}`;
  }

  // Handle root/document
  if (node.type === 'root') {
    return processNode(node.children, explanations, errors, warnings);
  }

  // Handle script tags
  if (node.type === 'script' || node.name === 'script') {
    warnings.push({
      type: 'warning',
      title: 'Script Tag Detected',
      description: 'Script tags should be converted to React component logic. Consider extracting inline JavaScript into component methods or hooks.',
      before: '<script>...</script>',
      after: 'useEffect(() => { /* your logic */ }, [])'
    });
    
    // Skip script content but note it
    return ''; 
  }

  // Handle tag elements
  if (node.type === 'tag') {
    return processElement(node, explanations, errors, warnings);
  }

  return '';
};

/**
 * Process HTML element to JSX
 */
const processElement = (element, explanations, errors, warnings) => {
  const tagName = element.name;
  const attributes = element.attribs || {};
  const children = element.children || [];

  // Convert attributes
  const jsxAttributes = [];
  
  Object.entries(attributes).forEach(([key, value]) => {
    const converted = convertAttribute(key, value, tagName, explanations);
    if (converted) {
      jsxAttributes.push(converted);
    }
  });

  const attrsString = jsxAttributes.length > 0 ? ' ' + jsxAttributes.join(' ') : '';
  
  // Self-closing tags
  const selfClosingTags = ['img', 'br', 'hr', 'input', 'meta', 'link', 'area', 'base', 'col', 'embed', 'param', 'source', 'track', 'wbr'];
  
  if (selfClosingTags.includes(tagName) && children.length === 0) {
    if (!element.attribs) {
      explanations.push({
        type: 'transformation',
        title: 'Self-Closing Tag',
        description: `Converted <${tagName}> to self-closing <${tagName} /> for JSX compatibility.`,
        before: `<${tagName}>`,
        after: `<${tagName} />`
      });
    }
    return `<${tagName}${attrsString} />`;
  }

  // Process children
  const childrenString = processNode(children, explanations, errors, warnings);

  return `<${tagName}${attrsString}>${childrenString}</${tagName}>`;
};

/**
 * Convert HTML attribute to JSX attribute
 */
const convertAttribute = (key, value, tagName, explanations) => {
  const originalKey = key;
  const originalValue = value;

  // class -> className
  if (key === 'class') {
    explanations.push({
      type: 'transformation',
      title: 'Class Attribute',
      description: 'HTML "class" attribute converted to "className" for React.',
      before: `class="${value}"`,
      after: `className="${value}"`
    });
    key = 'className';
  }

  // for -> htmlFor
  if (key === 'for') {
    explanations.push({
      type: 'transformation',
      title: 'For Attribute',
      description: 'HTML "for" attribute converted to "htmlFor" for React.',
      before: `for="${value}"`,
      after: `htmlFor="${value}"`
    });
    key = 'htmlFor';
  }

  // Convert style attribute to JSX object with proper formatting
  if (key === 'style' && typeof value === 'string') {
    const styleObject = parseStyleString(value);
    
    // Format style object for JSX with unquoted keys
    const formattedStyle = formatStyleObject(styleObject);
    
    explanations.push({
      type: 'transformation',
      title: 'Inline Style',
      description: 'Converted inline style string to JSX style object with camelCase properties and valid JavaScript syntax.',
      before: `style="${value}"`,
      after: `style={${formattedStyle}}`
    });
    return `style={${formattedStyle}}`;
  }

  // Convert event handlers
  if (key.startsWith('on')) {
    const reactEventName = 'on' + key.charAt(2).toUpperCase() + key.slice(3);
    
    // Normalize event handler value - remove () invocation if present
    let normalizedValue = value.trim();
    
    // If value ends with (), remove it (convert from invocation to reference)
    const hasInvocation = normalizedValue.endsWith('()');
    if (hasInvocation) {
      normalizedValue = normalizedValue.slice(0, -2);
    }
    
    if (reactEventName !== key || hasInvocation) {
      explanations.push({
        type: 'transformation',
        title: 'Event Handler',
        description: `Converted "${key}" to React event handler "${reactEventName}". ${hasInvocation ? 'Changed from function invocation to function reference.' : ''}`,
        before: `${key}="${value}"`,
        after: `${reactEventName}={${normalizedValue}}`
      });
      key = reactEventName;
    }
    
    // Event handlers should be function references, not invocations
    return `${key}={${normalizedValue}}`;
  }

  // Boolean attributes - use shorthand syntax
  const booleanAttributes = ['disabled', 'checked', 'selected', 'readOnly', 'required', 'autoFocus', 'autoPlay', 'controls', 'loop', 'muted', 'multiple', 'default'];
  if (booleanAttributes.includes(key) && (value === '' || value === key || value === 'true')) {
    explanations.push({
      type: 'transformation',
      title: 'Boolean Attribute',
      description: `Converted boolean attribute "${originalKey}" to JSX shorthand syntax (idiomatic React).`,
      before: `${originalKey}${value ? '="' + value + '"' : ''}`,
      after: `${key}`
    });
    return `${key}`;
  }

  // Convert kebab-case to camelCase for data attributes and aria
  if (key.includes('-') && !key.startsWith('data-') && !key.startsWith('aria-')) {
    const camelKey = key.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
    explanations.push({
      type: 'transformation',
      title: 'Attribute Name',
      description: `Converted "${key}" to camelCase "${camelKey}" for React.`,
      before: `${key}="${value}"`,
      after: `${camelKey}="${value}"`
    });
    key = camelKey;
  }

  // Return formatted attribute
  return `${key}="${value}"`;
};

/**
 * Parse CSS style string to valid JSX style object
 */
const parseStyleString = (styleString) => {
  const styleObject = {};
  
  styleString.split(';').forEach(style => {
    const [property, value] = style.split(':').map(s => s.trim());
    if (property && value) {
      // Convert kebab-case to camelCase for JavaScript object keys
      const camelProperty = property.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
      
      // Remove quotes from values if present and use proper JavaScript string syntax
      let cleanValue = value.replace(/^["']|["']$/g, '');
      
      // Add quotes for string values (not numbers)
      if (isNaN(cleanValue) && !cleanValue.match(/^(true|false|null|undefined)$/)) {
        styleObject[camelProperty] = cleanValue;
      } else {
        styleObject[camelProperty] = cleanValue;
      }
    }
  });

  return styleObject;
};

/**
 * Format style object for JSX with proper JavaScript syntax
 */
const formatStyleObject = (styleObj) => {
  if (Object.keys(styleObj).length === 0) {
    return '{}';
  }
  
  const entries = Object.entries(styleObj).map(([key, value]) => {
    // Use unquoted keys (valid JavaScript identifiers)
    // Quote values as strings
    return `${key}: "${value}"`;
  });
  
  return `{{ ${entries.join(', ')} }}`;
};

/**
 * Wrap JSX in a React functional component
 */
const wrapInReactComponent = (jsx) => {
  return `import React from 'react';

export const MyComponent = () => {
  return (
    ${indentCode(jsx, 4)}
  );
};

export default MyComponent;`;
};

/**
 * Indent code by specified spaces
 */
const indentCode = (code, spaces) => {
  const indent = ' '.repeat(spaces);
  return code.split('\n').map(line => indent + line).join('\n');
};

/**
 * Format JSX output (basic formatting)
 */
const formatJSX = (jsx) => {
  // Basic formatting - add newlines for readability
  let formatted = jsx;
  
  // Add newlines after opening tags
  formatted = formatted.replace(/>([^<\s])/g, '>\n$1');
  
  // Add newlines before closing tags
  formatted = formatted.replace(/([^>\s])</g, '$1\n<');
  
  // Clean up multiple newlines
  formatted = formatted.replace(/\n\s*\n/g, '\n');
  
  return formatted;
};
