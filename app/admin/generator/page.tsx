import ArticleGenerator from '@/components/admin/ArticleGenerator';

export default function GeneratorPage() {
    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4">
            <div className="max-w-7xl mx-auto">
                <ArticleGenerator />
            </div>
        </div>
    );
}
