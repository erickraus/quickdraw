import { z } from "zod";

// Karabiner Elements JSON schema types
export const actionSchema = z.object({
  id: z.string(),
  keyCode: z.string().min(1).max(1),
  description: z.string().min(1),
  commandType: z.enum(["shell_command"]),
  command: z.string().min(1),
});

export const configurationSchema = z.object({
  sublayerChar: z.string().min(1).max(1),
  description: z.string(),
  actions: z.array(actionSchema),
});

export type Action = z.infer<typeof actionSchema>;
export type Configuration = z.infer<typeof configurationSchema>;

// Karabiner Elements JSON structure
export interface KarabinerManipulator {
  conditions?: Array<{
    name: string;
    type: string;
    value: number;
  }>;
  description: string;
  from: {
    key_code: string;
    modifiers?: {
      optional: string[];
    };
  };
  to?: Array<{
    set_variable?: {
      name: string;
      value: number;
    };
    shell_command?: string;
  }>;
  to_after_key_up?: Array<{
    set_variable: {
      name: string;
      value: number;
    };
  }>;
  type: string;
}

export interface KarabinerConfiguration {
  description: string;
  manipulators: KarabinerManipulator[];
}
