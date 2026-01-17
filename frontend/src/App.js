import React from 'react';
import { ThemeProvider } from './components/ThemeProvider';
import HTMLtoJSXConverter from './components/HTMLtoJSXConverter';
import Header from './components/Header';
import { Toaster } from './components/ui/sonner';

export const App = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="htmljsx-theme">
      <div className="min-h-screen bg-background">
        <Header />
        <main>
          <HTMLtoJSXConverter />
        </main>
        <Toaster />
      </div>
    </ThemeProvider>
  );
};

export default App;
