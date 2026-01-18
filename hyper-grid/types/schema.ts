/**
 * HyperGrid 核心型別定義
 * 定義 AI 可生成的所有組件類型與介面合約
 */

// 支援的所有原子組件類型
export type ComponentType =
    | 'container'
    | 'text'
    | 'image'
    | 'button'
    | 'grid'
    | 'badge'
    | 'card'
    | 'timer'
    | 'chart';

// 單一 UI 組件的完整定義
export interface UIComponent {
    /** 唯一識別碼，用於 React key 與追蹤 */
    id: string;

    /** 組件類型 */
    type: ComponentType;

    /** 組件屬性（依類型而異） */
    props: Record<string, any>;

    /** 子組件陣列（支援巢狀結構） */
    children?: UIComponent[];
}

// AI 必須回傳的標準格式
export interface AIResponse {
    /** 完整的 UI 結構樹 */
    layout: UIComponent;

    /** AI 對此設計的簡短說明（給使用者看） */
    summary: string;

    /** 可選：建議的配色主題 */
    theme?: 'light' | 'dark' | 'brand';
}

// 組件屬性的型別定義（用於文件與驗證）
export interface ContainerProps {
    className?: string;
    bg?: string;
    padding?: 'sm' | 'md' | 'lg';
}

export interface TextProps {
    content: string;
    size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl';
    weight?: 'normal' | 'medium' | 'semibold' | 'bold';
    color?: string;
    align?: 'left' | 'center' | 'right';
}

export interface ImageProps {
    src: string;
    alt: string;
    aspect?: 'square' | 'video' | 'portrait' | 'auto';
    fit?: 'cover' | 'contain';
}

export interface ButtonProps {
    label: string;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    icon?: string;
}

export interface GridProps {
    cols?: 1 | 2 | 3 | 4;
    gap?: 'sm' | 'md' | 'lg';
}

export interface BadgeProps {
    text: string;
    color?: string;
    variant?: 'solid' | 'outline';
}

export interface CardProps {
    title?: string;
    description?: string;
    imageUrl?: string;
    price?: string;
    discount?: string;
}

export interface TimerProps {
    endTime: string; // ISO 格式時間
    label?: string;
}

export interface ChartProps {
    type: 'line' | 'bar';
    data: Array<{ label: string; value: number }>;
    color?: string;
}
