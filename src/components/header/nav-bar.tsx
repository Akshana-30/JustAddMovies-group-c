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
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { HamburgerButton } from "./hamburger-button";
import { SignOutButton } from "../auth/sign-out-button";
import { ModeToggle } from "./mode-togggle";
import { getCart } from "@/lib/cart";
import { getCartProducts } from "@/lib/cart-types";
//
export async function NavBar() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const cart = await getCart();
  const products = await getCartProducts(cart);
  const cartNumber = products.reduce((total, product) => {
  return total + (product.quantity);
}, 0);
  return (
    <nav className="navbar py-2 flex items-center md-20">
      <Link href="/" className="relative md:flex ml-5">
        <Image
          src="/JAM-li.png"
          width={80}
          height={80}
          alt="logo"
          className="transition-all duration-300 dark:opacity-0 dark:scale-0"
        />
        <Image
          src="/JAM.png"
          width={80}
          height={80}
          alt="logo"
          className="absolute top-0 left-0 transition-all duration-300 opacity-0 scale-0 dark:opacity-100 dark:scale-100"
        />
      </Link>

      <ul className="hidden xl:flex gap-2 w-full px-8 ">
        <li>
          <Button asChild variant="ghost" className=" text-lg" size="lg">
            <Link href="/">Home</Link>
          </Button>
        </li>

        <li>
          <Button asChild variant="ghost" className="text-lg" size="lg">
            <Link href="/admin-dashboard">Admin Dashboard</Link>
          </Button>
        </li>

        <li>
          <Button asChild variant="ghost" className="text-lg" size="lg">
            <Link href="/movies">Store</Link>
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

        {session ? (
          <>
            <li>
              <SignOutButton />
            </li>
          </>
        ) : (
          <>
            <li>
              <Button asChild variant="ghost" className="text-lg" size="lg">
                <Link href="/sign-in">Sign In</Link>
              </Button>
            </li>

            <li>
              <Button asChild variant="ghost" className=" text-lg" size="lg">
                <Link href="/register">Register</Link>
              </Button>
            </li>
          </>
        )}

        <li>
          <Button asChild variant="outline" className="text-lg" size="icon-lg">
            <Link href="/cart" className="px-0 items-center">
          <Button
            asChild
            variant="outline"
            className="text-white text-lg"
            size="icon-lg"
          >
            <Link href="/cart" className="px-0 items-center relative">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={16}
                height={16}
                fill={"currentColor"}
                viewBox={"2 2 20 20"}
              >
                <path d="M21 6H7.05L5.94 2.68A1 1 0 0 0 4.99 2h-3v2h2.28l3.54 10.63A2 2 0 0 0 9.71 16h7.59a2 2 0 0 0 1.87-1.3l2.76-7.35c.11-.31.07-.65-.11-.92A1 1 0 0 0 21 6m-3.69 8H9.72l-2-6h11.84zM10 18a2 2 0 1 0 0 4 2 2 0 1 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 1 0 0-4"></path>
              </svg>
              {cartNumber !== 0 ? <span className="text-sm text-yellow-400 mt-5 ml-5 absolute">{cartNumber}</span> : <span></span>}
              
              {/* Add shopping cart component */}
            </Link>
          </Button>
        </li>
        <li>
          <ModeToggle />
        </li>
      </ul>

      <HamburgerButton>
        <ul>
          <li>
            <Button
              asChild
              variant="ghost"
              className="text-sidebar-accent-foreground text-2xl"
              size="lg"
            >
              <Link href="/">
                {" "}
                Home
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={16}
                  height={16}
                  fill={"currentColor"}
                  viewBox={"2 2 20 20"}
                >
                  {/* Boxicons v3.0.8 https://boxicons.com | License  https://docs.boxicons.com/free */}
                  <path d="M3 13h1v7c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-7h1c.4 0 .77-.24.92-.62.15-.37.07-.8-.22-1.09l-8.99-9a.996.996 0 0 0-1.41 0l-9.01 9c-.29.29-.37.72-.22 1.09s.52.62.92.62Zm9-8.59 6 6V20H6v-9.59z"></path>
                </svg>
              </Link>
            </Button>
          </li>
        </ul>
      </HamburgerButton>
    </nav>
  );
}
