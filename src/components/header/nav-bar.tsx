import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "../ui/input-group";
import { SearchIcon } from "lucide-react";

export const NavBar = () => (
    <nav className="bg-primary h-25 flex items-center">
        <Link href="/" className="md:flex">
            <Image 
                src="/JAM2-Photoroom.png"
                width={200}
                height={200}
                alt="logo"
                className="rounded-full"
            />
        </Link>

        <ul className="flex gap-2 w-full px-4">
            <li>
                <Button asChild variant="ghost" className="text-white" size="lg">
                    <Link href="/">Home</Link>
                </Button>
            </li>

            <li>
                <Button asChild variant="ghost" className="text-white" size="lg">
                    <Link href="/">Store</Link> 
                    {/* Add store link */}
                </Button>
            </li>

            <li className="ml-auto flex items-center mr-2">
                <InputGroup className="bg-secondary text-black rounded-2xl">
                    <InputGroupInput placeholder="Search..."/>

                    <InputGroupAddon>
                        <SearchIcon />
                    </InputGroupAddon>
                </InputGroup>
            </li>

            <li>
                <Button asChild variant="ghost" className="text-white" size="lg">
                    <Link href="/">Sign In</Link>
                </Button>
            </li>

            <li>
                <Button asChild variant="ghost" className="text-white" size="lg">
                    <Link href="/">Register</Link>
                </Button>
            </li>

            <li>
                <Button asChild variant="ghost" className="text-white" size="lg">
                    <Link href="/">
                        Cart
                        {/* Add shopping cart component */}
                    </Link>
                </Button>
            </li>
        </ul>
    </nav>
)