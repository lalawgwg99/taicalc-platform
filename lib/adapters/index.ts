import { SkillId, UIResultHighlight, UIResultSection, ChartType } from '@/lib/skills/uiTypes';

export interface VisualizationData {
    // Standardized Result
    chartData?: any[];
    // Dynamic Highlights (if not defined in static Types, can be dynamic)
    highlights?: UIResultHighlight[];
    sections?: UIResultSection[];
    // Original Data
    [key: string]: any;
}

type AdapterFn = (input: any, output: any) => VisualizationData;

const adapters: Record<string, AdapterFn> = {};

export function registerAdapter(id: SkillId, fn: AdapterFn) {
    adapters[id] = fn;
}

export function adaptResult(skillId: SkillId, input: any, output: any): VisualizationData {
    const adapter = adapters[skillId];
    if (adapter) {
        return adapter(input, output);
    }
    // Default pass-through
    return output;
}
