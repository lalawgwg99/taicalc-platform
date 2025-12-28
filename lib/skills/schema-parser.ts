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

    // 嘗試解析 ZodObject
    try {
        const def = (schema as any)._def;
        if (!def || def.typeName !== 'ZodObject') {
            return fields;
        }

        const shape = def.shape?.() || {};

        for (const [key, fieldSchema] of Object.entries(shape)) {
            const field = extractFieldMeta(key, fieldSchema, paramDescriptions[key]);
            if (field) {
                fields.push(field);
            }
        }
    } catch {
        // 無法解析時返回空陣列
    }

    return fields;
}

function extractFieldMeta(
    name: string,
    schema: unknown,
    description?: string
): FieldMeta | null {
    try {
        let innerSchema: any = schema;
        let required = true;
        let defaultValue: unknown = undefined;

        // 解包 ZodDefault
        if (innerSchema?._def?.typeName === 'ZodDefault') {
            defaultValue = typeof innerSchema._def.defaultValue === 'function'
                ? innerSchema._def.defaultValue()
                : innerSchema._def.defaultValue;
            innerSchema = innerSchema._def.innerType;
        }

        // 解包 ZodOptional
        if (innerSchema?._def?.typeName === 'ZodOptional') {
            required = false;
            innerSchema = innerSchema._def.innerType;
        }

        const typeName = innerSchema?._def?.typeName;
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
    } catch {
        return null;
    }
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
