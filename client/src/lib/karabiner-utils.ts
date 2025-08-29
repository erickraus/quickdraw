import type { Configuration, KarabinerConfiguration, Action } from "@shared/schema";

export function generateKarabinerJSON(config: Configuration): KarabinerConfiguration {
  const { sublayerChar, description, actions } = config;
  
  const manipulators = [
    // Toggle sublayer manipulator
    {
      conditions: [
        {
          name: "hyper_sublayer_x",
          type: "variable_if",
          value: 0
        },
        {
          name: "hyper",
          type: "variable_if",
          value: 1
        }
      ],
      description: `Toggle Hyper sublayer ${sublayerChar}`,
      from: {
        key_code: sublayerChar,
        modifiers: { optional: ["any"] }
      },
      to: [
        {
          set_variable: {
            name: `hyper_sublayer_${sublayerChar}`,
            value: 1
          }
        }
      ],
      to_after_key_up: [
        {
          set_variable: {
            name: `hyper_sublayer_${sublayerChar}`,
            value: 0
          }
        }
      ],
      type: "basic"
    },
    // Action manipulators
    ...actions.map(action => ({
      conditions: [
        {
          name: `hyper_sublayer_${sublayerChar}`,
          type: "variable_if",
          value: 1
        }
      ],
      description: action.description,
      from: {
        key_code: action.keyCode,
        modifiers: { optional: ["any"] }
      },
      to: [{ shell_command: action.command }],
      type: "basic"
    }))
  ];

  return {
    description,
    manipulators
  };
}

export function parseKarabinerJSON(jsonString: string): Configuration | null {
  try {
    const parsed = JSON.parse(jsonString) as KarabinerConfiguration;
    
    if (!parsed.manipulators || parsed.manipulators.length === 0) {
      return null;
    }

    // Find the toggle manipulator (first one)
    const toggleManipulator = parsed.manipulators[0];
    const sublayerChar = toggleManipulator.from.key_code;
    
    // Extract actions from remaining manipulators
    const actionManipulators = parsed.manipulators.slice(1);
    const actions: Action[] = actionManipulators.map((manipulator, index) => ({
      id: `action-${index}`,
      keyCode: manipulator.from.key_code,
      description: manipulator.description,
      commandType: "shell_command" as const,
      command: manipulator.to?.[0]?.shell_command || ""
    }));

    return {
      sublayerChar,
      description: parsed.description,
      actions
    };
  } catch (error) {
    console.error("Failed to parse Karabiner JSON:", error);
    return null;
  }
}
