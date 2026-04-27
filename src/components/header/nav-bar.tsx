'use client'
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";
import { SearchIcon } from "lucide-react";
import React from "react";
//  
export const NavBar = () => {


const [isOpen, setIsOpen] = React.useState(false)

return(
  <nav className="bg-linear-to-b from-chart-3/40 h-25 flex items-center sticky top-0">
    <Link href="/" className=" md:flex ">
      <Image
        src="/JAM.png"
        width={80}
        height={80}
        alt="logo"
        className="ml-5"
      />
    </Link>

    <ul className="hidden xl:flex gap-2 w-full px-8 ">
      <li>
        <Button
          asChild
          variant="ghost"
          className="text-white text-lg"
          size="lg"
        >
          <Link href="/">Home</Link>
        </Button>
      </li>

            <li>
                <Button asChild variant="ghost" className="text-white" size="lg">
                    <Link href="/admin-dashboard">Admin Dashboard</Link>
                </Button>
            </li>

            <li className="ml-auto flex items-center mr-2">
                <InputGroup className="bg-secondary text-black rounded-2xl">
                    <InputGroupInput placeholder="Search..."/>


      <li>
        <Button
          asChild
          variant="ghost"
          className="text-white text-lg"
          size="lg"
        >
          <Link href="/">Store</Link>
          {/* Add store link */}
        </Button>
      </li>

      <li className="ml-auto flex items-center mr-2">
        <InputGroup className="bg-secondary text-black rounded-2xl">
          <InputGroupInput placeholder="Search..." />

          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
        </InputGroup>
      </li>

      <li>
        <Button
          asChild
          variant="ghost"
          className="text-white text-lg"
          size="lg"
        >
          <Link href="/">Sign In</Link>
        </Button>
      </li>

      <li>
        <Button
          asChild
          variant="ghost"
          className="text-white text-lg"
          size="lg"
        >
          <Link href="/">Register</Link>
        </Button>
      </li>

      <li>
        <Button
          asChild
          variant="outline"
          className="text-white text-lg"
          size="icon-lg"
        >
          <Link href="/" className="px-0 items-center">
         
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={16}
              height={16}
              fill={"currentColor"}
              viewBox={"2 2 20 20"}
            >
              {/* Boxicons v3.0.8 https://boxicons.com | License  https://docs.boxicons.com/free */}
              <path d="M21 6H7.05L5.94 2.68A1 1 0 0 0 4.99 2h-3v2h2.28l3.54 10.63A2 2 0 0 0 9.71 16h7.59a2 2 0 0 0 1.87-1.3l2.76-7.35c.11-.31.07-.65-.11-.92A1 1 0 0 0 21 6m-3.69 8H9.72l-2-6h11.84zM10 18a2 2 0 1 0 0 4 2 2 0 1 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 1 0 0-4"></path>
            </svg>
            {/* Add shopping cart component */}
          </Link>
        </Button>
      </li>
    </ul>

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
    <div className={`absolute xl:hidden top-25 min-h-full right-0  w-5xl bg-linear-to-l from-background flex flex-col text-right item-center gap-6 font-semibold text-lg transform transition-transform ${isOpen? 'opacity-100':'opacity-0'}`}
    style = {{transition : 'transform 0.3s ease, opacity 0.3s ease'}}>
      <ul>
        <li>
        <Button
          asChild
          variant="ghost"
          className="text-sidebar-accent-foreground text-2xl"
          size="lg"
        >
          <Link href="/"> Home<svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} fill={"currentColor"} viewBox={"2 2 20 20"}>{/* Boxicons v3.0.8 https://boxicons.com | License  https://docs.boxicons.com/free */}<path d="M3 13h1v7c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-7h1c.4 0 .77-.24.92-.62.15-.37.07-.8-.22-1.09l-8.99-9a.996.996 0 0 0-1.41 0l-9.01 9c-.29.29-.37.72-.22 1.09s.52.62.92.62Zm9-8.59 6 6V20H6v-9.59z"></path></svg></Link>
        </Button>
     </li>

      </ul>

    </div>
  </nav>
  )
};
