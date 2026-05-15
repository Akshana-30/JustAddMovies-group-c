"use client";

import React, { useEffect, useRef } from "react";

export function HamburgerButton({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = React.useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;
            if (
                isOpen && 
                menuRef.current && !menuRef.current.contains(target) && 
                buttonRef.current && !buttonRef.current.contains(target)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);

    return (
        <>
            <svg
                ref={buttonRef}
                onClick={() => setIsOpen(!isOpen)}
                className="absolute right-3 xl:hidden block text-5xl cursor-pointer"
                xmlns="http://www.w3.org/2000/svg"
                width={100}
                height={25}
                fill={"currentColor"}
                viewBox={"0 0 24 24"}
            >
                {/* Boxicons v3.0.8 https://boxicons.com | License  https://docs.boxicons.com/free */}
                <path d="M3 5h18v2H3zm0 6h18v2H3zm0 6h18v2H3z"></path>
            </svg>

            <div
                ref={menuRef}
                className={` 
                    text-chart-5
                    dark:text-foreground
                    absolute 
                    xl:hidden 
                    top-23 
                    min-h-screen
                    right-0  
                    pt-5
                    pr-2
                    w-[clamp(280px,80%,380px)]
                    bg-linear-to-l
                    from-background/80
                    from-60%
                    to-99%
                    backdrop-invert-[.10] 
                    backdrop-blur-sm
                    rounded-l-xl 
                    flex 
                    flex-col 
                    text-right 
                    item-center 
                    gap-8
                    font-extrabold
                    text-lg 
                    transition
                    duration-200
                    ease-in
                    ${isOpen ?
                        'opacity-100 visible'
                        : 'opacity-0 invisible'
                    }
                    `
                }
            // style={{ transition: 'transform 0.3s ease, opacity 0.3s ease' }}
            >
                {children}
            </div>
        </>
    )
}