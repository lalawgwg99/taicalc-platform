import { Metadata } from 'next';
import CapitalClient from './CapitalClient';

export const metadata: Metadata = {
    title: '資本決策模擬 (Capital Future) | TaiCalc 數策',
    description: '不僅看見複利的力量，更看清通膨的代價。TaiCalc 獨家「雙軌資產模擬」技術，助您精算財務自由的真實距離。',
    openGraph: {
        title: '資本決策模擬 | 您的財富時光機',
        description: '經過 3% 通膨，您的 1000 萬還剩多少購買力？立即試算您的 FIRE 進度。',
    }
};

export default function Page() {
    return <CapitalClient />;
}
