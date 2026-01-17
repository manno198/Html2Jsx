import React from 'react';
import { ThemeProvider } from './components/ThemeProvider';
import HTMLtoJSXConverter from './components/HTMLtoJSXConverter';
import Header from './components/Header';
import { Toaster } from './components/ui/sonner';
import AdSense from './components/AdSense';

export const App = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="htmljsx-theme">
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex">
          {/* Left Sidebar Ad Space */}
          <aside className="hidden xl:block w-48 flex-shrink-0 p-4">
            <div className="sticky top-20">
              <AdSense format="vertical" className="mx-auto" />
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            <HTMLtoJSXConverter />
          </main>

          {/* Right Sidebar Ad Space */}
          <aside className="hidden xl:block w-48 flex-shrink-0 p-4">
            <div className="sticky top-20">
              <AdSense format="vertical" className="mx-auto" />
            </div>
          </aside>
        </div>

        {/* Bottom Ad Space */}
        <div className="w-full p-4 border-t border-border">
          <div className="container mx-auto max-w-4xl">
            <AdSense format="horizontal" className="mx-auto" />
          </div>
        </div>

        <Toaster />
      </div>
    </ThemeProvider>
  );
};

export default App;
