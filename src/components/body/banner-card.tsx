import { cn } from "@/lib/utils";
import React from "react";
import { Card } from "../ui/card";

type Props = React.ComponentProps<typeof Card> & {
  imageUrl: string;
  children: React.ReactNode;
  className?: string;
};
export default function MovBanner({
  imageUrl,
  children,
  className,
  ...props
}: Props) {
  return (
    <Card
      className={cn("max-w-full max-h-150 bg-cover bg-position-[0%_20%] w-auto h-auto bg-secondary/80 bg-blend-multiply", className)}
      style={{ backgroundImage: `url('${imageUrl}')` }}
      {...props}
    >{children}</Card>
  );
}
