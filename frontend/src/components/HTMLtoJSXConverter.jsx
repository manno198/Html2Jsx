import React, { useState, useCallback, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { AlertCircle, Code, FileText, Info, Sparkles, Copy, Check } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Alert, AlertDescription } from './ui/alert';
import { toast } from 'sonner';
import { convertHTMLtoJSX } from '../utils/htmlToJsx';
import ExplanationPanel from './ExplanationPanel';
import DiffViewer from './DiffViewer';

const HTMLtoJSXConverter = () => {
  const [htmlInput, setHtmlInput] = useState('');
  const [jsxOutput, setJsxOutput] = useState('');
  const [wrapInComponent, setWrapInComponent] = useState(false);
  const [explanations, setExplanations] = useState([]);
  const [errors, setErrors] = useState([]);
  const [activeTab, setActiveTab] = useState('output');
  const [copied, setCopied] = useState(false);
  const [isConverting, setIsConverting] = useState(false);

  const handleConvert = useCallback(() => {
    if (!htmlInput.trim()) {
      toast.error('Please enter some HTML to convert');
      return;
    }

    setIsConverting(true);
    
    // Small delay to show loading state
    setTimeout(() => {
      try {
        const result = convertHTMLtoJSX(htmlInput, wrapInComponent);
        setJsxOutput(result.jsx);
        setExplanations(result.explanations);
        setErrors(result.errors);
        toast.success('Conversion completed!');
      } catch (error) {
        toast.error('Conversion failed: ' + error.message);
        setErrors([{ type: 'error', message: error.message }]);
      } finally {
        setIsConverting(false);
      }
    }, 300);
  }, [htmlInput, wrapInComponent]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(jsxOutput);
    setCopied(true);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  }, [jsxOutput]);


  // Auto-convert on input change (debounced)
  useEffect(() => {
    if (!htmlInput.trim()) {
      setJsxOutput('');
      setExplanations([]);
      setErrors([]);
      return;
    }

    const timer = setTimeout(() => {
      handleConvert();
    }, 500);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [htmlInput, wrapInComponent]);

  const editorOptions = {
    minimap: { enabled: false },
    fontSize: 14,
    lineNumbers: 'on',
    scrollBeyondLastLine: false,
    automaticLayout: true,
    tabSize: 2,
    wordWrap: 'on',
    padding: { top: 16, bottom: 16 },
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Options Bar */}
      <Card className="mb-4 p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-end">
          <div className="flex items-center gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="wrap-component"
                checked={wrapInComponent}
                onCheckedChange={setWrapInComponent}
              />
              <Label htmlFor="wrap-component" className="text-sm">
                Wrap in React component
              </Label>
            </div>
            
            <Button
              onClick={handleConvert}
              disabled={!htmlInput.trim() || isConverting}
              className="gap-2"
            >
              <Sparkles className="h-4 w-4" />
              {isConverting ? 'Converting...' : 'Convert'}
            </Button>
          </div>
        </div>

        {errors.length > 0 && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-1">
                {errors.map((error, idx) => (
                  <div key={idx} className="text-sm">
                    {error.message}
                  </div>
                ))}
              </div>
            </AlertDescription>
          </Alert>
        )}
      </Card>

      {/* Editor Grid */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* HTML Input */}
        <Card className="flex flex-col">
          <div className="flex items-center justify-between border-b border-border p-3">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">HTML Input</span>
            </div>
            <Badge variant="secondary">Editable</Badge>
          </div>
          <div className="flex-1 monaco-editor-container border-0">
            <Editor
              height="500px"
              defaultLanguage="html"
              value={htmlInput}
              onChange={(value) => setHtmlInput(value || '')}
              theme="vs-dark"
              options={editorOptions}
            />
          </div>
        </Card>

        {/* JSX Output with Tabs */}
        <Card className="flex flex-col">
          <div className="flex items-center justify-between border-b border-border p-3">
            <div className="flex items-center gap-2">
              <Code className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">JSX Output</span>
            </div>
            <div className="flex items-center gap-2">
              {jsxOutput && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopy}
                  className="gap-2"
                >
                  {copied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                  {copied ? 'Copied!' : 'Copy'}
                </Button>
              )}
              <Badge variant="secondary">Read-only</Badge>
            </div>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <div className="border-b border-border px-3">
              <TabsList className="h-9">
                <TabsTrigger value="output" className="text-xs">
                  Output
                </TabsTrigger>
                <TabsTrigger value="diff" className="text-xs">
                  Diff View
                </TabsTrigger>
                <TabsTrigger value="explanations" className="text-xs">
                  <Info className="mr-1 h-3 w-3" />
                  Explanations
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="output" className="flex-1 mt-0">
              <div className="monaco-editor-container border-0">
                <Editor
                  height="453px"
                  defaultLanguage="javascript"
                  value={jsxOutput || '// Your JSX output will appear here...'}
                  theme="vs-dark"
                  options={{ ...editorOptions, readOnly: true }}
                />
              </div>
            </TabsContent>

            <TabsContent value="diff" className="flex-1 mt-0">
              <ScrollArea className="h-[453px]">
                <DiffViewer oldValue={htmlInput} newValue={jsxOutput} />
              </ScrollArea>
            </TabsContent>

            <TabsContent value="explanations" className="flex-1 mt-0">
              <ScrollArea className="h-[453px]">
                <ExplanationPanel explanations={explanations} />
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default HTMLtoJSXConverter;
