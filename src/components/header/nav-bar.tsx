import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";
import { SearchIcon, ShoppingCart } from "lucide-react";
import React from "react";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { HamburgerButton } from "./hamburger-button";
import { SignOutButton } from "../auth/sign-out-button";
import { ModeToggle } from "./mode-togggle";
import { getCart } from "@/lib/cart";
import { getCartProducts } from "@/lib/cart-types";
import { SearchBar } from "./search-bar";
import { Separator } from "../ui/separator";

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
            <SignOutButton variant="ghost" className="text-lg" size="lg">
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

      <HamburgerButton>
        <ul className="flex flex-col gap-4">
          <li className="ml-auto flex items-center mr-2">
            <SearchBar />
          </li>
          <li>
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



          <li>
            <Button
              asChild
              variant="ghost"
              className="text-chart-5 dark:text-foreground text-[clamp(1.2rem,3vw,1.5rem)]"
              size="lg"
            >
              <Link href="/movies">
                Store
                {/* License: CC Attribution. Made by zwicon: https://www.zwicon.com/ */}
                <svg
                  fill={"currentColor"}
                  width={16}
                  height={16}
                  viewBox="2 2 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M6,20 L6,14.5 C6,13.6715729 6.67157288,13 7.5,13 L10.5,13 C11.3284271,13 12,13.6715729 12,14.5 L12,20 L18.5,20 C19.3284271,20 20,19.3284271 20,18.5 L20,10.5 L21,10.5 L21,18.5 C21,19.8807119 19.8807119,21 18.5,21 L5.5,21 C4.11928813,21 3,19.8807119 3,18.5 L3,10.5 L4,10.5 L4,18.5 C4,19.3284271 4.67157288,20 5.5,20 L6,20 Z M7,20 L11,20 L11,14.5 C11,14.2238576 10.7761424,14 10.5,14 L7.5,14 C7.22385763,14 7,14.2238576 7,14.5 L7,20 Z M15,14.5 L15,16.5 C15,16.7761424 15.2238576,17 15.5,17 L16.5,17 C16.7761424,17 17,16.7761424 17,16.5 L17,14.5 C17,14.2238576 16.7761424,14 16.5,14 L15.5,14 C15.2238576,14 15,14.2238576 15,14.5 Z M14,14.5 C14,13.6715729 14.6715729,13 15.5,13 L16.5,13 C17.3284271,13 18,13.6715729 18,14.5 L18,16.5 C18,17.3284271 17.3284271,18 16.5,18 L15.5,18 C14.6715729,18 14,17.3284271 14,16.5 L14,14.5 Z M6,11 L3.5,11 C2.67157288,11 2,10.3284271 2,9.5 L2,8.6925824 C2,8.50175326 2.0364128,8.3126768 2.10728496,8.13549639 L4.03576165,3.31430466 C4.11169333,3.12447547 4.29554771,3 4.5,3 L19.5,3 C19.7044523,3 19.8883067,3.12447547 19.9642383,3.31430466 L21.892715,8.13549639 C21.9635872,8.3126768 22,8.50175326 22,8.6925824 L22,9.5 C22,10.3284271 21.3284271,11 20.5,11 L18,11 C17.6158228,11 17.2653782,10.8555732 17,10.6180533 C16.7346218,10.8555732 16.3841772,11 16,11 L13,11 C12.6158228,11 12.2653782,10.8555732 12,10.6180533 C11.7346218,10.8555732 11.3841772,11 11,11 L8,11 C7.61582278,11 7.26537825,10.8555732 7,10.6180533 C6.73462175,10.8555732 6.38417722,11 6,11 Z M4.83851648,4 L3.03576165,8.50688707 C3.0121376,8.5659472 3,8.62897269 3,8.6925824 L3,9.5 C3,9.77614237 3.22385763,10 3.5,10 L6,10 C6.27614237,10 6.5,9.77614237 6.5,9.5 L6.5,8.5 C6.5,8.22385763 6.72385763,8 7,8 C7.27614237,8 7.5,8.22385763 7.5,8.5 L7.5,9.5 C7.5,9.77614237 7.72385763,10 8,10 L11,10 C11.2761424,10 11.5,9.77614237 11.5,9.5 L11.5,8.5 C11.5,8.22385763 11.7238576,8 12,8 C12.2761424,8 12.5,8.22385763 12.5,8.5 L12.5,9.5 C12.5,9.77614237 12.7238576,10 13,10 L16,10 C16.2761424,10 16.5,9.77614237 16.5,9.5 L16.5,8.5 C16.5,8.22385763 16.7238576,8 17,8 C17.2761424,8 17.5,8.22385763 17.5,8.5 L17.5,9.5 C17.5,9.77614237 17.7238576,10 18,10 L20.5,10 C20.7761424,10 21,9.77614237 21,9.5 L21,8.6925824 C21,8.62897269 20.9878624,8.5659472 20.9642383,8.50688707 L19.1614835,4 L4.83851648,4 Z" />
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
            <Button
              asChild
              variant="outline"
              className=" h-[clamp(0.5rem,6vw,2.3rem)]! w-[clamp(0.5rem,6vw,2.3rem)]! text-chart-5"
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
          </li>
          <li>
            <ModeToggle />
          </li>
        </ul>
      </HamburgerButton>
    </nav>
  );
}
