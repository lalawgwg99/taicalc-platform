import Link from "next/link";
import { Clock, ArrowRight, BarChart2, Calculator } from "lucide-react";
import { SkillUIConfig } from "@/lib/skills/uiTypes";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface SkillCardProps {
    skill: SkillUIConfig;
}

const CategoryColors: Record<string, string> = {
    salary: "bg-blue-100 text-blue-800",
    tax: "bg-green-100 text-green-800",
    capital: "bg-purple-100 text-purple-800",
    mortgage: "bg-orange-100 text-orange-800",
    fortune: "bg-yellow-100 text-yellow-800",
    articles: "bg-gray-100 text-gray-800",
};

const KindLabels: Record<string, string> = {
    financial: "理財",
    utility: "工具",
    entertainment: "趣味",
};

export function SkillCard({ skill }: SkillCardProps) {
    const isChart = skill.outputMode === 'kpi+chart';

    return (
        <Card className="flex flex-col h-full hover:shadow-md transition-shadow relative overflow-hidden group">
            {/* Featured Ribbon (Optional) */}
            {skill.isFeatured && (
                <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none overflow-hidden">
                    <div className="absolute top-[10px] right-[-20px] w-[80px] h-[20px] bg-yellow-400 text-yellow-900 text-[10px] font-bold text-center rotate-45 flex items-center justify-center shadow-sm">
                        熱門
                    </div>
                </div>
            )}

            <CardHeader className="pb-3">
                <div className="flex justify-between items-start mb-2">
                    <Badge variant="secondary" className={CategoryColors[skill.category] || "bg-gray-100"}>
                        {skill.category.toUpperCase()}
                    </Badge>
                    <span className="text-xs text-muted-foreground flex items-center">
                        <Clock className="w-3 h-3 mr-1" /> {skill.estMinutes} min
                    </span>
                </div>
                <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors">
                    {skill.title || skill.id.split('.')[1]}
                    {/* Fallback title logic if title not present, better to rely on catalog */}
                </CardTitle>
                <CardDescription className="line-clamp-2 mt-1">
                    {skill.oneLiner}
                </CardDescription>
            </CardHeader>

            <CardContent className="flex-1 pb-3">
                <div className="flex flex-wrap gap-1 mt-2">
                    {skill.tags?.slice(0, 2).map(tag => (
                        <span key={tag} className="text-[10px] px-1.5 py-0.5 bg-secondary rounded text-secondary-foreground">
                            {tag}
                        </span>
                    ))}
                    {(skill.tags?.length || 0) > 2 && (
                        <span className="text-[10px] px-1.5 py-0.5 bg-secondary rounded text-secondary-foreground">
                            +{(skill.tags?.length || 0) - 2}
                        </span>
                    )}
                </div>
            </CardContent>

            <CardFooter className="pt-0 flex gap-2">
                <Link href={`/calculators/${skill.id}`} className="w-full">
                    <Button className="w-full group/btn">
                        開始試算
                        <ArrowRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-0.5 transition-transform" />
                    </Button>
                </Link>
                {/* Future: Add Preview Button here */}
                {/* <Button variant="outline" size="icon">
                     <Eye className="w-4 h-4" />
                </Button> */}
            </CardFooter>
        </Card>
    );
}
