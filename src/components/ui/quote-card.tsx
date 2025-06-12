import { Card, CardContent } from "@/components/ui/card";
import { BookText } from "lucide-react";

interface QuoteCardProps {
  quote: string;
  citation: string;
}

export function QuoteCard({ quote, citation }: QuoteCardProps) {
  return (
    <Card className="flex flex-col justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-red-100 dark:from-amber-900/30 dark:via-orange-900/30 dark:to-red-900/30">
      <CardContent className="p-6 text-center">
        <BookText className="mx-auto h-8 w-8 text-amber-600 mb-4" />
        <blockquote className="text-lg font-semibold leading-snug text-amber-800 dark:text-amber-200">
          "{quote}"
        </blockquote>
        <p className="mt-4 text-sm text-muted-foreground dark:text-amber-400/80">- {citation}</p>
      </CardContent>
    </Card>
  );
}

export default QuoteCard;
