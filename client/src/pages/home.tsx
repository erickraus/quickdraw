import { useState, useEffect } from "react";
import { Keyboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HyperKeyConfig } from "@/components/hyperkey-config";
import { SubLayerActionsConfig } from "@/components/sublayer-actions-config";
import type { Configuration } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const { toast } = useToast();
  const [configuration, setConfiguration] = useState<Configuration>({
    sublayerChar: "o",
    description: 'Hyper Key sublayer "o"',
    actions: [],
  });

  // Auto-update description when sublayer character changes
  useEffect(() => {
    if (configuration.sublayerChar) {
      setConfiguration((prev) => ({
        ...prev,
        description: `Hyper Key sublayer "${configuration.sublayerChar}"`,
      }));
    }
  }, [configuration.sublayerChar]);

  const handleSublayerCharChange = (char: string) => {
    setConfiguration((prev) => ({
      ...prev,
      sublayerChar: char,
    }));
  };

  const handleDescriptionChange = (description: string) => {
    setConfiguration((prev) => ({
      ...prev,
      description,
    }));
  };

  const handleActionsChange = (actions: Configuration["actions"]) => {
    setConfiguration((prev) => ({
      ...prev,
      actions,
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Keyboard className="w-4 h-4 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-foreground">
                  Karabiner Elements Configuration Builder
                </h1>
                <p className="text-sm text-muted-foreground">
                  Create and edit Hyper Key and sublayer configurations (e.g.
                  HyperKey + o + f = "Open Finder")
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="space-y-6">
          <HyperKeyConfig />

          <SubLayerActionsConfig
            configuration={configuration}
            onSublayerCharChange={handleSublayerCharChange}
            onDescriptionChange={handleDescriptionChange}
            onActionsChange={handleActionsChange}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 mt-12">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center space-x-4">
              <span>Karabiner Elements Configuration Builder</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>Built for productivity</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
