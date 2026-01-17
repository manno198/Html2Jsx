import React from 'react';
import ReactDiffViewer from 'react-diff-viewer-continued';
import { useTheme } from './ThemeProvider';

const DiffViewer = ({ oldValue, newValue }) => {
  const { theme } = useTheme();

  if (!oldValue || !newValue) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <p className="text-sm text-muted-foreground">
          Convert HTML to see the differences
        </p>
      </div>
    );
  }

  const darkModeStyles = {
    variables: {
      dark: {
        diffViewerBackground: 'hsl(222 47% 11%)',
        diffViewerColor: 'hsl(210 40% 98%)',
        addedBackground: 'hsl(142 76% 36% / 0.15)',
        addedColor: 'hsl(142 76% 76%)',
        removedBackground: 'hsl(0 84% 60% / 0.15)',
        removedColor: 'hsl(0 84% 80%)',
        wordAddedBackground: 'hsl(142 76% 36% / 0.3)',
        wordRemovedBackground: 'hsl(0 84% 60% / 0.3)',
        addedGutterBackground: 'hsl(142 76% 36% / 0.2)',
        removedGutterBackground: 'hsl(0 84% 60% / 0.2)',
        gutterBackground: 'hsl(220 13% 18%)',
        gutterBackgroundDark: 'hsl(217 19% 27%)',
        highlightBackground: 'hsl(217 19% 27%)',
        highlightGutterBackground: 'hsl(215 28% 17%)',
      },
    },
  };

  return (
    <div className="diff-viewer-container">
      <ReactDiffViewer
        oldValue={oldValue}
        newValue={newValue}
        splitView={false}
        useDarkTheme={theme === 'dark'}
        styles={theme === 'dark' ? darkModeStyles : {}}
        leftTitle="HTML"
        rightTitle="JSX"
        showDiffOnly={false}
      />
    </div>
  );
};

export default DiffViewer;
