import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Settings, Copy, Download, Code, CheckCircle, AlertCircle } from "lucide-react";
import type { Action, Configuration, KarabinerConfiguration } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { generateKarabinerJSON, parseKarabinerJSON } from "@/lib/karabiner-utils";

interface SubLayerActionsConfigProps {
  configuration: Configuration;
  onSublayerCharChange: (char: string) => void;
  onDescriptionChange: (description: string) => void;
  onActionsChange: (actions: Action[]) => void;
}

export function SubLayerActionsConfig({ 
  configuration,
  onSublayerCharChange, 
  onDescriptionChange,
  onActionsChange
}: SubLayerActionsConfigProps) {
  const { toast } = useToast();
  const [importText, setImportText] = useState("");
  const [isValidJSON, setIsValidJSON] = useState(true);
  const [jsonSize, setJsonSize] = useState("0 B");
  
  const generatedJSON = generateKarabinerJSON(configuration);
  const formattedJSON = JSON.stringify(generatedJSON, null, 2);

  // Update JSON size when configuration changes
  useEffect(() => {
    const sizeInBytes = new TextEncoder().encode(formattedJSON).length;
    const sizeInKB = (sizeInBytes / 1024).toFixed(1);
    setJsonSize(sizeInBytes < 1024 ? `${sizeInBytes} B` : `${sizeInKB} KB`);
  }, [formattedJSON]);
  
  const handleSublayerCharChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.slice(-1); // Only take the last character
    onSublayerCharChange(value);
  };

  const addAction = () => {
    const newAction: Action = {
      id: `action-${Date.now()}`,
      keyCode: "",
      description: "",
      commandType: "shell_command",
      command: ""
    };
    onActionsChange([...configuration.actions, newAction]);
  };

  const deleteAction = (id: string) => {
    onActionsChange(configuration.actions.filter(action => action.id !== id));
  };

  const updateAction = (id: string, field: keyof Action, value: string) => {
    onActionsChange(
      configuration.actions.map(action =>
        action.id === id
          ? { ...action, [field]: field === "keyCode" ? value.slice(-1) : value }
          : action
      )
    );
  };

  const clearAll = () => {
    onActionsChange([]);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(formattedJSON);
    toast({
      title: "Copied to clipboard",
      description: "Sublayer configuration JSON copied successfully"
    });
  };

  const copyJSONPreview = async () => {
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
        onSublayerCharChange(parsed.sublayerChar);
        onDescriptionChange(parsed.description);
        onActionsChange(parsed.actions);
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

  const handleExport = () => {
    const jsonString = formattedJSON;
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `karabiner-sublayer-${configuration.sublayerChar}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Configuration exported",
      description: "JSON file has been downloaded to your device."
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-primary" />
            Sublayer Configuration
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              data-testid="button-copy-sublayer"
            >
              <Copy className="w-4 h-4 mr-1" />
              Copy
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              data-testid="button-export-json"
            >
              <Download className="w-4 h-4 mr-1" />
              Export JSON
            </Button>
          </div>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Configure the main sublayer character and description
        </p>
      </CardHeader>
      <CardContent>
        {/* Sublayer Configuration Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="sublayer-char">
              Sublayer Character
              <span className="text-destructive">*</span>
            </Label>
            <Input
              id="sublayer-char"
              data-testid="input-sublayer-char"
              type="text"
              maxLength={1}
              value={configuration.sublayerChar}
              onChange={handleSublayerCharChange}
              className="w-full text-center text-lg font-mono"
              placeholder="o"
            />
            <p className="text-xs text-muted-foreground">
              Single character (a-z, 0-9)
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              data-testid="input-description"
              type="text"
              value={configuration.description}
              onChange={(e) => onDescriptionChange(e.target.value)}
              placeholder="Hyper Key sublayer description"
            />
            <p className="text-xs text-muted-foreground">
              Auto-generated from sublayer character
            </p>
          </div>
        </div>

        {/* Divider */}
        <Separator className="my-6" />

        {/* Actions Configuration Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">Actions</h3>
              <p className="text-sm text-muted-foreground">
                Define key mappings and their corresponding actions
              </p>
            </div>
            <Button onClick={addAction} data-testid="button-add-action">
              <Plus className="w-4 h-4 mr-2" />
              Add Action
            </Button>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-16">Key</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="w-32">Action Type</TableHead>
                  <TableHead>Command</TableHead>
                  <TableHead className="w-16"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {configuration.actions.map((action) => (
                  <TableRow key={action.id} className="hover:bg-muted/30">
                    <TableCell>
                      <Input
                        data-testid={`input-key-code-${action.id}`}
                        type="text"
                        maxLength={1}
                        value={action.keyCode}
                        onChange={(e) => updateAction(action.id, "keyCode", e.target.value)}
                        className="w-12 h-10 text-center font-mono"
                        placeholder="1"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        data-testid={`input-description-${action.id}`}
                        type="text"
                        value={action.description}
                        onChange={(e) => updateAction(action.id, "description", e.target.value)}
                        placeholder="Action description"
                      />
                    </TableCell>
                    <TableCell>
                      <Select
                        value={action.commandType}
                        onValueChange={(value) => updateAction(action.id, "commandType", value)}
                      >
                        <SelectTrigger data-testid={`select-command-type-${action.id}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="shell_command">Shell Command</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Input
                        data-testid={`input-command-${action.id}`}
                        type="text"
                        value={action.command}
                        onChange={(e) => updateAction(action.id, "command", e.target.value)}
                        className="font-mono text-sm"
                        placeholder="Command to execute"
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        data-testid={`button-delete-${action.id}`}
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteAction(action.id)}
                        className="w-8 h-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {configuration.actions.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No actions configured. Click "Add Action" to get started.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-border text-sm">
            <span className="text-muted-foreground">
              <span data-testid="text-actions-count">{configuration.actions.length}</span> actions configured
            </span>
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearAll}
                data-testid="button-clear-all"
                className="text-muted-foreground hover:text-foreground"
              >
                Clear All
              </Button>
            </div>
          </div>
        </div>

        {/* Divider */}
        <Separator className="my-6" />

        {/* JSON Preview Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">JSON Preview</h3>
              <p className="text-sm text-muted-foreground">
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
                onClick={copyJSONPreview}
                data-testid="button-copy-json"
                className="w-8 h-8 p-0"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>

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
        </div>
      </CardContent>
    </Card>
  );
}