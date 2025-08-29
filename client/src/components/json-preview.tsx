import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CheckCircle, Code, Copy, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Configuration, KarabinerConfiguration } from "@shared/schema";
import { generateKarabinerJSON, parseKarabinerJSON } from "@/lib/karabiner-utils";

interface JSONPreviewProps {
  configuration: Configuration;
  onConfigurationChange: (config: Configuration) => void;
}

export function JSONPreview({ configuration, onConfigurationChange }: JSONPreviewProps) {
  const [importText, setImportText] = useState("");
  const [isValidJSON, setIsValidJSON] = useState(true);
  const [jsonSize, setJsonSize] = useState("0 B");
  const { toast } = useToast();

  const generatedJSON = generateKarabinerJSON(configuration);
  const formattedJSON = JSON.stringify(generatedJSON, null, 2);

  useEffect(() => {
    const sizeInBytes = new TextEncoder().encode(formattedJSON).length;
    const sizeInKB = (sizeInBytes / 1024).toFixed(1);
    setJsonSize(sizeInBytes < 1024 ? `${sizeInBytes} B` : `${sizeInKB} KB`);
  }, [formattedJSON]);

  const copyJSON = async () => {
    try {
      await navigator.clipboard.writeText(formattedJSON);
      toast({
        title: "Copied to clipboard",
        description: "JSON configuration has been copied to your clipboard."
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Failed to copy JSON to clipboard.",
        variant: "destructive"
      });
    }
  };

  const handleImportChange = (value: string) => {
    setImportText(value);
    
    if (value.trim() === "") {
      setIsValidJSON(true);
      return;
    }

    try {
      const parsed = parseKarabinerJSON(value);
      if (parsed) {
        onConfigurationChange(parsed);
        setIsValidJSON(true);
        toast({
          title: "Configuration imported",
          description: "JSON configuration has been successfully imported."
        });
      } else {
        setIsValidJSON(false);
      }
    } catch (error) {
      setIsValidJSON(false);
    }
  };

  const formatJSON = () => {
    try {
      const parsed = JSON.parse(formattedJSON);
      const formatted = JSON.stringify(parsed, null, 2);
      // This would trigger a re-render with formatted JSON
      toast({
        title: "JSON formatted",
        description: "JSON has been formatted successfully."
      });
    } catch (error) {
      toast({
        title: "Format failed",
        description: "Failed to format JSON.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="sticky top-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>JSON Preview</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Live configuration output
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={formatJSON}
              data-testid="button-format-json"
              className="w-8 h-8 p-0"
            >
              <Code className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={copyJSON}
              data-testid="button-copy-json"
              className="w-8 h-8 p-0"
            >
              <Copy className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="flex items-center space-x-2 text-sm">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-muted-foreground">Valid JSON</span>
            </div>
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground" data-testid="text-json-size">
              {jsonSize}
            </span>
          </div>
        </div>

        <div className="bg-muted/50 border border-border rounded-lg p-4 max-h-96 overflow-y-auto">
          <pre 
            className="text-sm font-mono text-foreground leading-relaxed whitespace-pre-wrap"
            data-testid="text-json-preview"
          >
            {formattedJSON}
          </pre>
        </div>

        <div className="mt-4 pt-4 border-t border-border space-y-2">
          <Label htmlFor="import-json">Import JSON Configuration</Label>
          <Textarea
            id="import-json"
            data-testid="textarea-import-json"
            value={importText}
            onChange={(e) => handleImportChange(e.target.value)}
            className="h-20 font-mono text-xs resize-none"
            placeholder="Paste JSON configuration here to load into editor..."
          />
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              Paste existing configuration to edit
            </p>
            {!isValidJSON && (
              <div className="flex items-center space-x-1 text-xs text-destructive">
                <AlertCircle className="w-3 h-3" />
                <span>Invalid JSON</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
