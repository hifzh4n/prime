
import { Check, X, Zap, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { cn } from "@/lib/utils";

// Define the shape of our props
interface PricingFeature {
    name: string;
    included: boolean;
}

interface PricingCardProps {
    title: string;
    price: number;
    description?: string; // Optional description like "Upgrade from Standard..."
    features: PricingFeature[];
    isRecommended?: boolean;
    isExclusive?: boolean;
    onPurchase: () => void;
    onRedeem: () => void;
    discordLink?: string; // If we want to support the old "Join Discord" style or just for info
}

export function PricingCard({
    title,
    price,
    description,
    features,
    isRecommended,
    isExclusive,
    onPurchase,
    onRedeem,
}: PricingCardProps) {

    // Dynamic styles based on card type
    const cardStyles = isExclusive
        ? "bg-black/40 border-amber-500/30 backdrop-blur-xl relative"
        : isRecommended
            ? "bg-black/60 border-purple-500/50 backdrop-blur-xl relative transform md:-translate-y-4 shadow-[0_0_40px_rgba(168,85,247,0.1)]"
            : "bg-black/40 border-white/5 backdrop-blur-xl hover:border-white/10 transition-colors relative";

    const buttonStyles = isExclusive
        ? "bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white shadow-[0_0_20px_rgba(245,158,11,0.3)]"
        : isRecommended
            ? "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]"
            : "bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white shadow-[0_0_20px_rgba(168,85,247,0.3)]";

    const priceColor = isExclusive ? "text-amber-500" : "text-purple-400";
    const badgeColor = isExclusive ? "bg-amber-500 text-black" : "bg-gradient-to-r from-purple-600 to-indigo-600 text-white";

    return (
        <Card className={cn("flex flex-col", cardStyles)}>
            {(isRecommended || isExclusive) && (
                <div className={cn("absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-lg", badgeColor)}>
                    {isExclusive ? "Exclusive" : "Recommended"}
                </div>
            )}

            <CardHeader className={cn("text-center pb-2", (isRecommended || isExclusive) ? "pt-8" : "")}>
                <CardTitle className="text-2xl text-white font-bold">{title}</CardTitle>
            </CardHeader>

            <CardContent className="flex-1">
                <div className={cn("text-center mb-2", isExclusive ? "min-h-[88px] flex flex-col items-center justify-center" : "")}>
                    <div className="text-5xl font-bold text-white mb-1">
                        <span className={cn("text-3xl align-top", priceColor)}>$</span>
                        {price}
                    </div>
                    <div className="text-sm text-zinc-500 uppercase tracking-widest font-medium">Lifetime</div>
                </div>

                {description && (
                    <div className="text-center text-xs text-zinc-500 mb-8">{description}</div>
                )}
                {!description && <div className="mb-8"></div>}

                <div className="space-y-4 px-4">
                    {features.map((feat, i) => (
                        <div key={i} className="flex items-center text-sm">
                            {feat.included ? (
                                <Check className="w-4 h-4 mr-3 text-green-500 shrink-0" />
                            ) : (
                                <X className="w-4 h-4 mr-3 text-red-500/70 shrink-0" />
                            )}
                            <span className={feat.included ? "text-zinc-200" : "text-zinc-600"}>{feat.name}</span>
                        </div>
                    ))}
                </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-3 pt-6">
                <Button
                    className={cn("w-full border-0 py-6 text-lg font-medium", buttonStyles)}
                    onClick={onPurchase}
                >
                    Purchase
                </Button>
                <button
                    className="text-sm text-zinc-500 hover:text-white transition-colors"
                    onClick={onRedeem}
                >
                    Redeem Key
                </button>
            </CardFooter>
        </Card>
    );
}
