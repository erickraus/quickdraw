import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2, List } from "lucide-react";
import type { Action } from "@shared/schema";

interface ActionsTableProps {
  actions: Action[];
  onActionsChange: (actions: Action[]) => void;
}

export function ActionsTable({ actions, onActionsChange }: ActionsTableProps) {
  const addAction = () => {
    const newAction: Action = {
      id: `action-${Date.now()}`,
      keyCode: "",
      description: "",
      commandType: "shell_command",
      command: ""
    };
    onActionsChange([...actions, newAction]);
  };

  const deleteAction = (id: string) => {
    onActionsChange(actions.filter(action => action.id !== id));
  };

  const updateAction = (id: string, field: keyof Action, value: string) => {
    onActionsChange(
      actions.map(action =>
        action.id === id
          ? { ...action, [field]: field === "keyCode" ? value.slice(-1) : value }
          : action
      )
    );
  };

  const clearAll = () => {
    onActionsChange([]);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <List className="w-5 h-5 text-primary" />
              Actions Configuration
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Define key mappings and their corresponding actions
            </p>
          </div>
          <Button onClick={addAction} data-testid="button-add-action">
            <Plus className="w-4 h-4 mr-2" />
            Add Action
          </Button>
        </div>
      </CardHeader>
      <CardContent>
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
              {actions.map((action) => (
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
              {actions.length === 0 && (
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
            <span data-testid="text-actions-count">{actions.length}</span> actions configured
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
      </CardContent>
    </Card>
  );
}
