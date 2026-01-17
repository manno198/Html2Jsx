import React from 'react';
import { CheckCircle2, AlertCircle, Info, Code2, ArrowRight } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';

const ExplanationPanel = ({ explanations }) => {
  if (!explanations || explanations.length === 0) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <div className="text-center">
          <Info className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="mt-4 text-sm text-muted-foreground">
            Convert some HTML to see transformation explanations
          </p>
        </div>
      </div>
    );
  }

  const getIcon = (type) => {
    switch (type) {
      case 'transformation':
        return <CheckCircle2 className="h-5 w-5 text-success" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-warning" />;
      case 'info':
        return <Info className="h-5 w-5 text-info" />;
      default:
        return <Code2 className="h-5 w-5 text-primary" />;
    }
  };

  const getBadgeVariant = (type) => {
    switch (type) {
      case 'transformation':
        return 'default';
      case 'warning':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-2 pb-2">
        <Code2 className="h-5 w-5 text-primary" />
        <h3 className="text-sm font-semibold">
          {explanations.length} Transformation{explanations.length !== 1 ? 's' : ''} Applied
        </h3>
      </div>

      <div className="space-y-3">
        {explanations.map((explanation, index) => (
          <Card key={index} className="p-4">
            <div className="flex items-start gap-3">
              <div className="mt-0.5">{getIcon(explanation.type)}</div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">{explanation.title}</h4>
                  <Badge variant={getBadgeVariant(explanation.type)} className="text-xs">
                    {explanation.type}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {explanation.description}
                </p>
                
                {explanation.before && explanation.after && (
                  <div className="mt-3 space-y-2">
                    <div className="rounded-md bg-muted/50 p-3">
                      <div className="text-xs font-medium text-muted-foreground mb-1">
                        Before:
                      </div>
                      <code className="text-xs">
                        {explanation.before}
                      </code>
                    </div>
                    <div className="flex justify-center">
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="rounded-md bg-primary/10 p-3">
                      <div className="text-xs font-medium text-primary mb-1">
                        After:
                      </div>
                      <code className="text-xs text-primary">
                        {explanation.after}
                      </code>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ExplanationPanel;
