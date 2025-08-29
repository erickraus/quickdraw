import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings } from "lucide-react";

interface SubLayerConfigProps {
  sublayerChar: string;
  description: string;
  onSublayerCharChange: (char: string) => void;
  onDescriptionChange: (description: string) => void;
}

export function SubLayerConfig({ 
  sublayerChar, 
  description, 
  onSublayerCharChange, 
  onDescriptionChange 
}: SubLayerConfigProps) {
  const handleSublayerCharChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.slice(-1); // Only take the last character
    onSublayerCharChange(value);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-primary" />
          Sublayer Configuration
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Configure the main sublayer character and description
        </p>
      </CardHeader>
      <CardContent>
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
              value={sublayerChar}
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
              value={description}
              onChange={(e) => onDescriptionChange(e.target.value)}
              placeholder="Hyper Key sublayer description"
            />
            <p className="text-xs text-muted-foreground">
              Auto-generated from sublayer character
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
