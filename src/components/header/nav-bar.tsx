import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import { ShoppingCart } from "lucide-react";
import React from "react";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { HamburgerButton } from "./hamburger-button";
import { SignOutButton } from "../auth/sign-out-button";
import { ModeToggle } from "./mode-togggle";
import { getCart } from "@/lib/cart";
import { getCartProducts } from "@/lib/cart-types";
import { SearchBar } from "./search-bar";

//
export async function NavBar() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const cart = await getCart();
  const products = await getCartProducts(cart);
  const cartNumber = products.reduce((total, product) => {
    return total + product.quantity;
  }, 0);
  return (
    <nav className="navbar py-2 flex items-center md-20 bg-linear-to-t from-background to-[#7e672151]">
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
            <Link href="/movies">Store</Link>
          </Button>
        </li>

        <li className="ml-auto flex items-center mr-2">
          <SearchBar />
        </li>

        {session ? (
          <>
            <li>
              <Button asChild variant="ghost" className="text-lg" size="lg">
                <Link href="/admin-dashboard">Dashboard</Link>
              </Button>
            </li>
            <li>
              <SignOutButton
                variant="ghost"
                className="text-lg cursor-pointer"
                size="lg"
              >
                Logout
              </SignOutButton>
            </li>
          </>
        ) : (
          <>
            <li>
              <Button asChild variant="ghost" className="text-lg" size="lg">
                <Link href="/sign-in">Login</Link>
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
          <Button asChild variant="outline" className=" text-lg" size="icon-lg">
            <Link href="/cart" className="px-0 items-center relative">
              <ShoppingCart strokeWidth={2.25} />
              {cartNumber !== 0 ? (
                <span className="text-sm text-chart-1 dark:text-yellow-400 mt-5 ml-5 absolute">
                  {cartNumber}
                </span>
              ) : (
                <span></span>
              )}
            </Link>
          </Button>
        </li>
        <li>
          <ModeToggle />
        </li>
      </ul>

      <div className="flex min-[1250px]:hidden! items-center mx-5 w-full justify-between">
        <div>
          <ul className="flex">
            <li className="max-[425px]:hidden">
              <Button asChild variant="ghost" className=" text-lg" size="lg">
                <Link href="/">Home</Link>
              </Button>
            </li>
            <li>
              <Button asChild variant="ghost" className="text-lg" size="lg">
                <Link href="/movies">Store</Link>
              </Button>
            </li>
          </ul>
        </div>
        <div className="flex">
          <div className="ml-auto pr-10 items-center mr-2 max-[768px]:hidden">
              <SearchBar />
            </div>
          <Button
            asChild
            variant="outline"
            className=" dark:text-foreground  text-chart-5"
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
              {cartNumber !== 0 ? (
                <span className="text-md text-chart-1 dark:text-yellow-400 mt-5 ml-5 absolute">
                  {cartNumber}
                </span>
              ) : (
                <span></span>
              )}
            </Link>
          </Button>
        </div>
      </div>
      <div className="flex items-center">
        <HamburgerButton>
          <ul className="flex flex-col gap-4">
            <li className="ml-auto flex items-center mr-2 min-[768px]:hidden">
              <SearchBar />
            </li>
            <li className="min-[425px]:hidden">
              <Button
                asChild
                variant="ghost"
                className="text-chart-5 dark:text-foreground text-[clamp(1.2rem,3vw,1.5rem)]"
                size="lg"
              >
                <Link href="/">
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

            

            {session ? (
              <>
                <li>
                  <Button
                    asChild
                    variant="ghost"
                    className="text-chart-5 dark:text-foreground text-[clamp(1.2rem,3vw,1.5rem)]"
                    size="lg"
                  >
                    <Link href="/admin-dashboard">
                      Dashboard
                      {/* License: Apache. Made by Remix Design: https://github.com/Remix-Design/remixicon */}
                      <svg
                        width={16}
                        height={16}
                        viewBox="2 2 20 20"
                        fill={"currentColor"}
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g>
                          <path fill="none" d="M0 0h24v24H0z" />
                          <path d="M12 14v2a6 6 0 0 0-6 6H4a8 8 0 0 1 8-8zm0-1c-3.315 0-6-2.685-6-6s2.685-6 6-6 6 2.685 6 6-2.685 6-6 6zm0-2c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm9 6h1v5h-8v-5h1v-1a3 3 0 0 1 6 0v1zm-2 0v-1a1 1 0 0 0-2 0v1h2z" />
                        </g>
                      </svg>
                    </Link>
                  </Button>
                </li>
                <li>
                  <SignOutButton
                    variant="ghost"
                    className=" text-chart-5 dark:text-foreground text-[clamp(1.2rem,3vw,1.5rem)]"
                    size="lg"
                  >
                    Logout
                    {/* License: Apache. Made by UXAspects: https://github.com/UXAspects/UXAspects */}
                    <svg
                      fill={"currentColor"}
                      height={16}
                      width={16}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="2 2 20 20"
                    >
                      <g>
                        <path d="M15,24H0V2h15v8h-2V4H2v18h11v-6h2V24z M18.4,18.7L17,17.3l3.3-3.3H5v-2h15.3L17,8.7l1.4-1.4L24,13L18.4,18.7z" />
                      </g>
                    </svg>
                  </SignOutButton>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Button
                    asChild
                    variant="ghost"
                    className="text-chart-5 dark:text-foreground text-[clamp(1.2rem,3vw,1.5rem)]"
                    size="lg"
                  >
                    <Link href="/sign-in">
                      Login
                      {/*  License: Apache. Made by UXAspects: https://github.com/UXAspects/UXAspects */}
                      <svg
                        fill={"currentColor"}
                        height={16}
                        width={16}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="2 2 20 20"
                      >
                        <g>
                          <path d="M24,23H9v-8h2v6h11V3H11v6H9V1h15V23z M14.7,17.7l-1.4-1.4l3.3-3.3H1v-2h15.6l-3.3-3.3l1.4-1.4l5.8,5.7L14.7,17.7z" />
                        </g>
                      </svg>
                    </Link>
                  </Button>
                </li>

                <li>
                  <Button
                    asChild
                    variant="ghost"
                    className="text-chart-5 dark:text-foreground text-[clamp(1.2rem,3vw,1.5rem)]"
                    size="lg"
                  >
                    <Link href="/register">
                      Register
                      {/* License: MIT. Made by Esri: https://github.com/Esri/calcite-ui-icons */}
                      <svg
                        fill={"currentColor"}
                        width={16}
                        height={16}
                        viewBox="2 2 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M18 9H4V8h14zm-5 3H4v1h9zm8-8v9h-1V5H2v13h9v1H1V4zm2.07 11.637l-.707-.707-5.863 5.863-2.863-2.863-.707.707 3.57 3.57z" />
                      </svg>
                    </Link>
                  </Button>
                </li>
              </>
            )}
          </ul>

          <ul className="ml-auto mr-2 flex gap-5">
            <li>
              <ModeToggle />
            </li>
          </ul>
        </HamburgerButton>
      </div>
    </nav>
  );
}
