"use client";

import { 
    Collapsible, 
    CollapsibleContent 
} from "@/components/ui/collapsible";
import { 
    TableBody, 
    TableCell, 
    TableRow 
} from "@/components/ui/table";
import React, { useState, useTransition } from "react";
import { MessageProp } from "../_types/message-prop";
import { MessageReadStatus } from "../_actions/message-read-status";
import { Button } from "@/components/ui/button";

export function CollapsibleMessage({ msg }: { msg: MessageProp }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isPending, startTransition] = useTransition();

    const HandleClick = () => {
        const nextOpenState = !isOpen;
        setIsOpen(nextOpenState);

        if(nextOpenState && !msg.read) {
            startTransition(async () => {
                await MessageReadStatus(msg.id, true);
            });
        }
    }

    const HandleClickUnread = (e: React.MouseEvent) => {
        e.stopPropagation();

        startTransition(async () => {
            await MessageReadStatus(msg.id, !msg.read);
        });
    }

    return (
        <Collapsible open={isOpen} onOpenChange={setIsOpen} asChild>
            <TableBody>

                {/* The dynamic table rows */}
                <TableRow
                    className={`cursor-pointer hover:bg-muted ${isPending ? 'opacity-60' : ''}`} 
                    onClick={HandleClick}
                >
                    <TableCell>{msg.dateString}</TableCell>
                    <TableCell>{msg.name}</TableCell>
                    <TableCell>{msg.email}</TableCell>
                    <TableCell>{msg.subject}</TableCell>
                    <TableCell>
                        <div className="xl:w-2/3 truncate">
                            {msg.message}
                        </div>
                    </TableCell>
                    <TableCell>{msg.read ? "Read" : "Unread"}</TableCell>
                </TableRow>

                {/* The collapsible panel */}
                <CollapsibleContent asChild>
                    <TableRow className="bg-muted/10 border-t border-border/50 data-[state=closed]:hidden data-[state=open]:animate-in data-[state=open]:fade-in data-[state=open]:duration-200">
                        <TableCell colSpan={6} className="p-6 whitespace-normal! overflow-visible! text-clip!">
                            <div className="max-w-3xl space-y-4 rounded-lg border border-border/50 bg-background p-6 shadow-sm">

                                {/* Email Header Info */}
                                <div className="flex flex-col gap-7 border-b border-border/40 pb-3 text-xs text-muted-foreground">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                        <div>
                                            <span className="font-semibold text-foreground">From:</span> {msg.name} ({msg.email})
                                        </div>
                                        <div>
                                            <span className="font-semibold text-foreground">Received:</span> {msg.dateString}
                                        </div>
                                    </div>
                                    
                                    <Button
                                        disabled={isPending}
                                        onClick={HandleClickUnread}
                                        className="w-[clamp(3rem,17vw,7rem)] text-[clamp(0.6rem,2vw,0.8rem)]"
                                    >
                                        Toggle Read
                                    </Button>
                                </div>

                                {/* Email Subject */}
                                <div>
                                    <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Subject</h4>
                                    <p className="text-base font-medium text-foreground mt-0.5">{msg.subject}</p>
                                </div>

                                {/* Email Message Body */}
                                <div className="pt-2">
                                    <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Message</h4>
                                    <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap bg-muted/30 rounded-md p-4 border border-border/20">
                                        {msg.message}
                                    </p>
                                </div>
                            </div>
                        </TableCell>
                    </TableRow>
                </CollapsibleContent>
            </TableBody>
        </Collapsible>
    );
}