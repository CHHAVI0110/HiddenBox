'use client'

import React from "react"
import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { MessageCircle } from "lucide-react"

const Navbar = () => {

    const { data: session, status } = useSession()

    const user = session?.user

    return (
        <nav className="w-full border-b bg-white shadow-sm">

            <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 py-4 sm:flex-row md:px-6">

                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <MessageCircle className="h-7 w-7 text-violet-600" />

                    <span className="text-2xl font-bold tracking-tight text-gray-900">
                        Hidden<span className="text-violet-600">Box</span>
                    </span>
                </Link>


                {/* Authentication Section */}
                <div className="flex items-center gap-3">

                    {status === "loading" ? null : session ? (

                        <>
                            <span className="text-sm text-gray-600">
                                Welcome,{" "}
                                <span className="font-semibold text-gray-900">
                                    {user?.username || user?.email}
                                </span>
                            </span>

                            <Button
                                variant="outline"
                                onClick={() => signOut({ callbackUrl: "/" })}
                            >
                                Logout
                            </Button>
                        </>

                    ) : (

                        <>
                            <Link href="/sign-in">
                                <Button variant="outline">
                                    Login
                                </Button>
                            </Link>

                            <Link href="/sign-up">
                                <Button className="bg-violet-600 hover:bg-violet-700">
                                    Sign Up
                                </Button>
                            </Link>
                        </>

                    )}

                </div>

            </div>

        </nav>
    )
}

export default Navbar