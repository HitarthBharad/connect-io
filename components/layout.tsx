"use client";

import Link from "next/link";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useClerk } from "@clerk/nextjs";

export default function Layout({ children, user }: { children: React.ReactNode, user: any }) {

    const { signOut } = useClerk();
    return (
        <div className="flex flex-col h-screen">
            <header className="flex items-center justify-between px-6 py-3 bg-background border-b shadow-sm">

                <div className="text-xl font-bold">
                    <Link href="/">Connect IO</Link>
                </div>

                {/* Navigation Links */}
                <nav className="hidden md:flex space-x-6">
                    <Link href="/" className="text-foreground hover:text-primary transition">Home</Link>
                    {/* <Link href="/topics" className="text-foreground hover:text-primary transition">Topics</Link> */}
                    <Link href="/thoughts" className="text-foreground hover:text-primary transition">Thoughts</Link>
                    <Link href="/chains" className="text-foreground hover:text-primary transition">Chain</Link>
                    <Link href="/" className="text-foreground hover:text-primary transition">Chat</Link>
                </nav>

                <div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Avatar>
                                <AvatarImage src={user?.imageUrl} />
                                <AvatarFallback>U</AvatarFallback>
                            </Avatar>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-60 p-4 bg-white shadow-lg rounded-lg">
                            {/* User Info Section */}
                            <div className="flex items-center space-x-3 mb-4">
                                <div>
                                    <p className="font-semibold text-lg text-gray-900">👋 Hello, {user?.firstName}</p>
                                    <p className="text-sm text-gray-500">{user?.primaryEmailAddress?.emailAddress}</p>
                                </div>
                            </div>

                            {/* Menu Items */}
                            <DropdownMenuItem>
                                <Link href="/profile" className="text-gray-900 hover:text-blue-600">My Profile</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Link href="/settings" className="text-gray-900 hover:text-blue-600">Settings</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => signOut()} className="text-red-600 hover:text-red-800">
                                Logout
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </header>

            {/* Page Content */}
            <main className="flex-1 p-6">{children}</main>
        </div>
    );
}