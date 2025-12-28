/**
 * Skill Schema 解析工具
 * 從 Zod Schema 提取表單元資料
 */

import { z } from 'zod';

export interface FieldMeta {
    name: string;
    type: 'number' | 'boolean' | 'string' | 'select';
    label: string;
    required: boolean;
    default?: unknown;
    min?: number;
    max?: number;
    step?: number;
    unit?: string;
    options?: { value: unknown; label: string }[];
}

export interface SkillFormMeta {
    id: string;
    name: string;
    description: string;
    fields: FieldMeta[];
}

/**
 * 從 Zod Schema 提取欄位元資料
 * 使用簡化的實作避免 Zod 內部類型問題
 */
export function extractSchemaFields(
    schema: z.ZodTypeAny,
    paramDescriptions: Record<string, string> = {}
): FieldMeta[] {
    const fields: FieldMeta[] = [];

    // Helper to safely unwrap schema layers (ZodEffects, ZodOptional, ZodDefault, etc.)
    let target: any = schema;
    let depth = 0;
    while (depth < 10) { // prevent infinite loops
        if (target._def?.typeName === 'ZodOptional' && typeof target.unwrap === 'function') {
            target = target.unwrap();
        } else if (target._def?.typeName === 'ZodDefault' && typeof target.removeDefault === 'function') {
            target = target.removeDefault();
        } else if (target._def?.typeName === 'ZodEffects' && typeof target.innerType === 'function') {
            target = target.innerType();
        } else if (target._def?.typeName === 'ZodEffects' && target._def.schema) {
            target = target._def.schema;
        } else if (target._def?.typeName === 'ZodPipeline' && target._def.in) {
            target = target._def.in;
        } else {
            break;
        }
        depth++;
    }

    // Try to get shape from standard ZodObject
    let shape: any = null;

    // 1. Try public .shape property (Zod v3+)
    if (target && typeof target === 'object' && 'shape' in target) {
        shape = target.shape;
    }
    // 2. Try _def.shape() function (older Zod or internal)
    else if (target?._def && typeof target._def.shape === 'function') {
        shape = target._def.shape();
    }
    // 3. Try _def.shape property
    else if (target?._def && target._def.shape) {
        shape = target._def.shape;
    }

    if (!shape) {
        // console.warn('Could not extract shape from schema', target?._def?.typeName);
        return fields;
    }

    for (const [key, fieldSchema] of Object.entries(shape)) {
        const field = extractFieldMeta(key, fieldSchema, paramDescriptions[key]);
        if (field) {
            fields.push(field);
        }
    }





    return fields;
}

function extractFieldMeta(
    name: string,
    schema: unknown,
    description?: string
): FieldMeta | null {
    // Remove global try/catch to identify errors
    // try {
    let innerSchema: any = schema;
    let required = true;
    let defaultValue: unknown = undefined;

    // Recursive unwrapping loop
    let depth = 0;
    while (depth < 10) {
        const def = innerSchema?._def;
        if (!def) break;

        if (def.typeName === 'ZodDefault') {
            defaultValue = typeof def.defaultValue === 'function'
                ? def.defaultValue()
                : def.defaultValue;
            innerSchema = def.innerType;
        } else if (def.typeName === 'ZodOptional') {
            required = false;
            innerSchema = def.innerType;
        } else if (def.typeName === 'ZodEffects') {
            innerSchema = def.schema; // or innerType
        } else if (def.typeName === 'ZodPipeline') {
            innerSchema = def.in;
        } else if (def.typeName === 'ZodNullable') {
            required = false;
            innerSchema = def.innerType;
        } else {
            break;
        }
        depth++;
    }


    const typeName = innerSchema?._def?.typeName || innerSchema?.constructor?.name;

    // Use description from schema if not provided via paramDescriptions
    const schemaDesc = innerSchema?._def?.description || innerSchema?.description;
    const label = description || schemaDesc || name;

    // 數字類型
    if (typeName === 'ZodNumber') {
        const checks = innerSchema._def.checks || [];
        let min: number | undefined;
        let max: number | undefined;

        for (const check of checks) {
            if (check?.kind === 'min') min = check.value;
            if (check?.kind === 'max') max = check.value;
        }

        // 自動判斷單位
        let unit = '';
        const nameLower = name.toLowerCase();
        if (nameLower.includes('salary') || nameLower.includes('amount') || nameLower.includes('income') || nameLower.includes('payment')) {
            unit = '元';
        } else if (nameLower.includes('rate')) {
            unit = '%';
        } else if (nameLower.includes('year')) {
            unit = '年';
        }

        return {
            name,
            type: 'number',
            label,
            required,
            default: defaultValue,
            min,
            max,
            step: nameLower.includes('rate') ? 0.1 : 1000,
            unit,
        };
    }

    // 布林類型
    if (typeName === 'ZodBoolean') {
        return {
            name,
            type: 'boolean',
            label,
            required,
            default: defaultValue ?? false,
        };
    }

    // 字串類型
    if (typeName === 'ZodString') {
        return {
            name,
            type: 'string',
            label,
            required,
            default: defaultValue,
        };
    }



    return null;
}

/**
 * 生成預設表單值
 */
export function generateDefaultValues(fields: FieldMeta[]): Record<string, unknown> {
    const values: Record<string, unknown> = {};

    for (const field of fields) {
        if (field.default !== undefined) {
            values[field.name] = field.default;
        } else if (field.type === 'number') {
            values[field.name] = field.min ?? 0;
        } else if (field.type === 'boolean') {
            values[field.name] = false;
        } else {
            values[field.name] = '';
        }
    }

    return values;
}
