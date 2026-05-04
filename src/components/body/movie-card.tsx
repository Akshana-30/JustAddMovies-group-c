import { Button } from "react-day-picker";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Link } from "lucide-react";
import { Children } from "react";
import { cn } from "@/lib/utils";




type Props = React.ComponentProps<typeof Card> & {
  imageUrl: string;
  children: React.ReactNode;
  className?: string;
};
export default async function MovieCard({imageUrl,children,className,...props}:Props) {
    return(
        <Card className={cn(" border-amber-300 border-1 pt-10 relative overflow-hidden w-50 h-70 transition-transform duration-300 hover:scale-125",className)}>{children}</Card>
    )
}