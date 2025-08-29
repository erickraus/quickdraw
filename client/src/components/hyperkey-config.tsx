import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Copy, Download, Keyboard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const HYPER_KEYS = [
  { value: "caps_lock", label: "caps_lock" },
  { value: "tab", label: "tab" },
  { value: "escape", label: "escape" },
  { value: "left_command", label: "left_command" },
  { value: "left_control", label: "left_control" },
  { value: "left_option", label: "left_option" },
  { value: "left_shift", label: "left_shift" },
  { value: "right_command", label: "right_command" },
  { value: "right_control", label: "right_control" },
  { value: "right_option", label: "right_option" },
  { value: "right_shift", label: "right_shift" },
  { value: "fn", label: "fn" },
  { value: "command", label: "any command" },
  { value: "control", label: "any control" },
  { value: "option", label: "any option" },
  { value: "shift", label: "any shift" },
];

const MODIFIER_KEYS = [
  { value: "left_shift", label: "left_shift" },
  { value: "right_shift", label: "right_shift" },
  { value: "shift", label: "any shift" },
  { value: "left_command", label: "left_command" },
  { value: "right_command", label: "right_command" },
  { value: "command", label: "any command" },
  { value: "fn", label: "fn" },
  { value: "left_control", label: "left_control" },
  { value: "right_control", label: "right_control" },
  { value: "control", label: "any control" },
  { value: "left_option", label: "left_option" },
  { value: "right_option", label: "right_option" },
  { value: "option", label: "any option" },
];

export function HyperKeyConfig() {
  const [description, setDescription] = useState("");
  const [hyperKey, setHyperKey] = useState("");
  const [variable, setVariable] = useState("hyper");
  const [modifiers, setModifiers] = useState<string[]>([]);
  const [keyCode, setKeyCode] = useState("");
  const { toast } = useToast();

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.slice(0, 256);
    setDescription(value);
  };

  const handleVariableChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.slice(0, 128);
    // Remove quotes on blur
    value = value.replace(/['"]/g, "");
    setVariable(value);
  };

  const handleKeyCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    // Remove quotes on blur
    value = value.replace(/['"]/g, "");
    setKeyCode(value);
  };

  const handleModifierChange = (keyValue: string, checked: boolean) => {
    if (checked) {
      // Don't allow selecting the same key as hyper key
      if (keyValue === hyperKey) return;

      let newModifiers = [...modifiers, keyValue];

      // Handle "any" variants - when selected, remove and disable specific variants
      if (keyValue === "shift") {
        newModifiers = newModifiers.filter(
          (mod) => !["left_shift", "right_shift"].includes(mod),
        );
      } else if (keyValue === "command") {
        newModifiers = newModifiers.filter(
          (mod) => !["left_command", "right_command"].includes(mod),
        );
      } else if (keyValue === "control") {
        newModifiers = newModifiers.filter(
          (mod) => !["left_control", "right_control"].includes(mod),
        );
      } else if (keyValue === "option") {
        newModifiers = newModifiers.filter(
          (mod) => !["left_option", "right_option"].includes(mod),
        );
      }

      // Handle specific variants - when selected, remove "any" variant if present
      if (["left_shift", "right_shift"].includes(keyValue)) {
        newModifiers = newModifiers.filter((mod) => mod !== "shift");
      } else if (["left_command", "right_command"].includes(keyValue)) {
        newModifiers = newModifiers.filter((mod) => mod !== "command");
      } else if (["left_control", "right_control"].includes(keyValue)) {
        newModifiers = newModifiers.filter((mod) => mod !== "control");
      } else if (["left_option", "right_option"].includes(keyValue)) {
        newModifiers = newModifiers.filter((mod) => mod !== "option");
      }

      setModifiers(newModifiers);
    } else {
      setModifiers((prev) => prev.filter((mod) => mod !== keyValue));
    }
  };

  // Helper function to check if a modifier should be disabled
  const isModifierDisabled = (keyValue: string) => {
    if (keyValue === hyperKey) return true;

    // Disable specific variants when "any/either" variant is selected as hyper key
    if (
      hyperKey === "shift" &&
      ["left_shift", "right_shift"].includes(keyValue)
    )
      return true;
    if (
      hyperKey === "command" &&
      ["left_command", "right_command"].includes(keyValue)
    )
      return true;
    if (
      hyperKey === "control" &&
      ["left_control", "right_control"].includes(keyValue)
    )
      return true;
    if (
      hyperKey === "option" &&
      ["left_option", "right_option"].includes(keyValue)
    )
      return true;

    // Disable specific variants when "any" variant is selected as modifier
    if (
      ["left_shift", "right_shift"].includes(keyValue) &&
      modifiers.includes("shift")
    )
      return true;
    if (
      ["left_command", "right_command"].includes(keyValue) &&
      modifiers.includes("command")
    )
      return true;
    if (
      ["left_control", "right_control"].includes(keyValue) &&
      modifiers.includes("control")
    )
      return true;
    if (
      ["left_option", "right_option"].includes(keyValue) &&
      modifiers.includes("option")
    )
      return true;

    return false;
  };

  const handleHyperKeyChange = (value: string) => {
    setHyperKey(value);

    // Remove the selected hyper key from modifiers if it was selected
    let updatedModifiers = modifiers.filter((mod) => mod !== value);

    // Also uncheck specific variants when "any/either" variant is selected as hyper key
    if (value === "shift") {
      updatedModifiers = updatedModifiers.filter(
        (mod) => !["left_shift", "right_shift"].includes(mod),
      );
    } else if (value === "command") {
      updatedModifiers = updatedModifiers.filter(
        (mod) => !["left_command", "right_command"].includes(mod),
      );
    } else if (value === "control") {
      updatedModifiers = updatedModifiers.filter(
        (mod) => !["left_control", "right_control"].includes(mod),
      );
    } else if (value === "option") {
      updatedModifiers = updatedModifiers.filter(
        (mod) => !["left_option", "right_option"].includes(mod),
      );
    }

    setModifiers(updatedModifiers);
  };

  const generateJSON = () => {
    if (!description || !hyperKey) {
      toast({
        title: "Missing required fields",
        description: "Please provide both description and Hyper Key",
        variant: "destructive",
      });
      return null;
    }

    const to: any[] = [];

    // Add variable setting if specified
    if (variable.trim()) {
      to.push({
        set_variable: {
          name: variable.trim(),
          value: 1,
        },
      });
    }

    // Add modifier combination if any modifiers are selected
    if (modifiers.length > 0) {
      const [firstKey, ...otherKeys] = modifiers;
      const modifierObj: any = {
        key_code: firstKey,
      };
      if (otherKeys.length > 0) {
        modifierObj.modifiers = otherKeys;
      }
      to.push(modifierObj);
    }

    const manipulator: any = {
      description: `mapping ${hyperKey} to hyper`,
      from: { key_code: hyperKey },
      type: "basic",
    };

    if (to.length > 0) {
      manipulator.to = to;
    }

    // Add to_after_key_up if variable is specified
    if (variable.trim()) {
      manipulator.to_after_key_up = [
        {
          set_variable: {
            name: variable.trim(),
            value: 0,
          },
        },
      ];
    }

    // Add to_if_alone if key code is specified
    if (keyCode.trim()) {
      manipulator.to_if_alone = [{ key_code: keyCode.trim() }];
    }

    return {
      description,
      manipulators: [manipulator],
    };
  };

  const handleCopy = () => {
    const json = generateJSON();
    if (json) {
      navigator.clipboard.writeText(JSON.stringify(json, null, 2));
      toast({
        title: "Copied to clipboard",
        description: "Hyper Key configuration JSON copied successfully",
      });
    }
  };

  const handleExport = () => {
    const json = generateJSON();
    if (json) {
      const blob = new Blob([JSON.stringify(json, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `hyperkey-config-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "File downloaded",
        description: "Hyper Key configuration JSON exported successfully",
      });
    }
  };

  // Get all modifiers (don't filter them out, just disable them)
  const availableModifiers = MODIFIER_KEYS;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Keyboard className="w-5 h-5 text-primary" />
            Hyper Key Configuration
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              data-testid="button-copy-hyperkey"
              disabled={!description || !hyperKey}
            >
              <Copy className="w-4 h-4 mr-1" />
              Copy
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              data-testid="button-export-hyperkey"
              disabled={!description || !hyperKey}
            >
              <Download className="w-4 h-4 mr-1" />
              Export JSON
            </Button>
          </div>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Configure Hyper Key mappings with variable settings and modifier
          combinations
        </p>
      </CardHeader>
      <CardContent>
        {/* Main Section */}
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="hyper-description">
                Description
                <span className="text-destructive">*</span>
              </Label>
              <Input
                id="hyper-description"
                data-testid="input-hyper-description"
                type="text"
                maxLength={256}
                value={description}
                onChange={handleDescriptionChange}
                placeholder="Hyper Key configuration description"
              />
              <p className="text-xs text-muted-foreground">
                {description.length}/256 characters
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="hyper-key">
                Hyper Key
                <span className="text-destructive">*</span>
              </Label>
              <Select value={hyperKey} onValueChange={handleHyperKeyChange}>
                <SelectTrigger data-testid="select-hyper-key">
                  <SelectValue placeholder="Select hyper key" />
                </SelectTrigger>
                <SelectContent>
                  {HYPER_KEYS.map((key) => (
                    <SelectItem key={key.value} value={key.value}>
                      {key.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Key to use as Hyper Key
              </p>
            </div>
          </div>

          {/* Actions Section */}
          <div className="border-t pt-6 space-y-6">
            <h3 className="text-lg font-medium">Actions</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="variable">Set Variable</Label>
                <Input
                  id="variable"
                  data-testid="input-variable"
                  type="text"
                  maxLength={128}
                  value={variable}
                  onChange={handleVariableChange}
                  onBlur={handleVariableChange}
                  placeholder="hyper"
                />
                <p className="text-xs text-muted-foreground">
                  Variable name used for sublayer activation (optional. default:
                  use "hyper")
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="key-code">Key Code</Label>
                <Input
                  id="key-code"
                  data-testid="input-key-code"
                  type="text"
                  value={keyCode}
                  onChange={handleKeyCodeChange}
                  onBlur={handleKeyCodeChange}
                  placeholder="valid key_code e.g. escape or tab"
                />
                <p className="text-xs text-muted-foreground">
                  Action when Hyper Key is pressed alone (optional)
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <Label>Modifier</Label>
              <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
                {/* None Column */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="modifier-none"
                      data-testid="checkbox-modifier-none"
                      checked={modifiers.length === 0}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setModifiers([]);
                        }
                      }}
                    />
                    <Label htmlFor="modifier-none" className="text-sm">
                      None
                    </Label>
                  </div>
                </div>

                {/* Shift Column */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Shift
                  </h4>
                  {availableModifiers
                    .filter((key) => key.value.includes("shift"))
                    .map((key) => (
                      <div
                        key={key.value}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`modifier-${key.value}`}
                          data-testid={`checkbox-modifier-${key.value}`}
                          checked={modifiers.includes(key.value)}
                          onCheckedChange={(checked: boolean) => {
                            handleModifierChange(key.value, checked);
                          }}
                          disabled={isModifierDisabled(key.value)}
                        />
                        <Label
                          htmlFor={`modifier-${key.value}`}
                          className={`text-sm ${isModifierDisabled(key.value) ? "text-muted-foreground line-through" : ""}`}
                        >
                          {key.label}
                        </Label>
                      </div>
                    ))}
                </div>

                {/* Command Column */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Command
                  </h4>
                  {availableModifiers
                    .filter((key) => key.value.includes("command"))
                    .map((key) => (
                      <div
                        key={key.value}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`modifier-${key.value}`}
                          data-testid={`checkbox-modifier-${key.value}`}
                          checked={modifiers.includes(key.value)}
                          onCheckedChange={(checked: boolean) => {
                            handleModifierChange(key.value, checked);
                          }}
                          disabled={isModifierDisabled(key.value)}
                        />
                        <Label
                          htmlFor={`modifier-${key.value}`}
                          className={`text-sm ${isModifierDisabled(key.value) ? "text-muted-foreground line-through" : ""}`}
                        >
                          {key.label}
                        </Label>
                      </div>
                    ))}
                </div>

                {/* Function Column */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Function
                  </h4>
                  {availableModifiers
                    .filter((key) => key.value === "fn")
                    .map((key) => (
                      <div
                        key={key.value}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`modifier-${key.value}`}
                          data-testid={`checkbox-modifier-${key.value}`}
                          checked={modifiers.includes(key.value)}
                          onCheckedChange={(checked: boolean) => {
                            handleModifierChange(key.value, checked);
                          }}
                          disabled={isModifierDisabled(key.value)}
                        />
                        <Label
                          htmlFor={`modifier-${key.value}`}
                          className={`text-sm ${isModifierDisabled(key.value) ? "text-muted-foreground line-through" : ""}`}
                        >
                          {key.label}
                        </Label>
                      </div>
                    ))}
                </div>

                {/* Control Column */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Control
                  </h4>
                  {availableModifiers
                    .filter((key) => key.value.includes("control"))
                    .map((key) => (
                      <div
                        key={key.value}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`modifier-${key.value}`}
                          data-testid={`checkbox-modifier-${key.value}`}
                          checked={modifiers.includes(key.value)}
                          onCheckedChange={(checked: boolean) => {
                            handleModifierChange(key.value, checked);
                          }}
                          disabled={isModifierDisabled(key.value)}
                        />
                        <Label
                          htmlFor={`modifier-${key.value}`}
                          className={`text-sm ${isModifierDisabled(key.value) ? "text-muted-foreground line-through" : ""}`}
                        >
                          {key.label}
                        </Label>
                      </div>
                    ))}
                </div>

                {/* Option Column */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Option
                  </h4>
                  {availableModifiers
                    .filter((key) => key.value.includes("option"))
                    .map((key) => (
                      <div
                        key={key.value}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`modifier-${key.value}`}
                          data-testid={`checkbox-modifier-${key.value}`}
                          checked={modifiers.includes(key.value)}
                          onCheckedChange={(checked: boolean) => {
                            handleModifierChange(key.value, checked);
                          }}
                          disabled={isModifierDisabled(key.value)}
                        />
                        <Label
                          htmlFor={`modifier-${key.value}`}
                          className={`text-sm ${isModifierDisabled(key.value) ? "text-muted-foreground line-through" : ""}`}
                        >
                          {key.label}
                        </Label>
                      </div>
                    ))}
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Modifier keys that are mapped to holding the Hyper Key
                (optional)
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
