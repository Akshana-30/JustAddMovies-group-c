"use client";

import React from "react";

export function HamburgerButton({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = React.useState(false);

    return (
        <>
            <svg
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
                className={`
                    absolute 
                    xl:hidden 
                    top-25 
                    min-h-full 
                    right-0  
                    w-5xl 
                    bg-linear-to-l 
                    from-background 
                    flex 
                    flex-col 
                    text-right 
                    item-center 
                    gap-6 
                    font-semibold 
                    text-lg 
                    transform 
                    transition-transform 
                    ${isOpen ? 
                        'opacity-100' 
                        : 'opacity-0'
                    }
                    `
                }
                style={{ transition: 'transform 0.3s ease, opacity 0.3s ease' }}
            >
                {children}
            </div>
        </>
    )
}