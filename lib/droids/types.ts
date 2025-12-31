
export interface DroidProfile {
    id: string;
    name: string;
    description: string;
    systemPrompt: string;
    allowedSkills: string[]; // Patterns like 'tax.*' or specific IDs
    icon: string; // Lucide icon name
}
