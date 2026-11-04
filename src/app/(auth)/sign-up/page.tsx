'use client'

import * as z from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useState, useEffect } from 'react'
import Link from "next/link"
import { useDebounceCallback } from 'usehooks-ts'
import { toast } from "@/components/ui/toast"
import { useRouter } from 'next/navigation'
import { signUpSchema } from '@/schema/signUpSchema'
import axios, { AxiosError } from "axios"
import { ApiResponse } from '@/types/ApiResponse'

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

import { HugeiconsIcon } from "@hugeicons/react"
import { Loading03Icon } from "@hugeicons/core-free-icons"


const page = () => {

    const [username, setUsername] = useState('')
    const [usernameMessage, setUsernameMessage] = useState('')
    const [isCheckingUsername, setIsCheckingUsername] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const debounced = useDebounceCallback(setUsername, 300)

    const router = useRouter()

    // Zod implementation

    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            username: '',
            email: '',
            password: ''
        }
    })

    useEffect(() => {
        const checkUsernameUnique = async () => {

            if (username) {
                setIsCheckingUsername(true)
                setUsernameMessage('')

                try {
                    const response = await axios.get(
                        `/api/check-username-unique?username=${username}`
                    )

                    let message = response.data.message
                    setUsernameMessage(message)

                } catch (error) {
                    const axiosError = error as AxiosError<ApiResponse>

                    setUsernameMessage(
                        axiosError.response?.data.message ?? "Error1 checking username1"
                    )

                } finally {
                    setIsCheckingUsername(false)
                }
            }
        }

        checkUsernameUnique()

    }, [username])

    const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
        setIsSubmitting(true)

        try {
            const response = await axios.post<ApiResponse>(
                '/api/sign-up',
                data
            )

            toast.add({
                title: 'Success',
                description: response.data.message
            })

            router.replace(`/verify/${data.username}`)
            setIsSubmitting(false)

        } catch (error) {
            console.error("Error in signup of user", error)

            const axiosError = error as AxiosError<ApiResponse>
            let errorMessage = axiosError.response?.data.message

            toast.add({
                title: "Signup failed",
                description: errorMessage,
                type: "error"
            })

            setIsSubmitting(false)
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-10">

            <div className="w-full max-w-md">

                {/* Signup Card */}

                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">

                    {/* Heading */}

                    <div className="mb-8 text-center">

                        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                            Create an Account
                        </h1>

                        <p className="mt-3 text-sm leading-6 text-gray-500">
                            Join HiddenBox and start receiving anonymous messages.
                        </p>

                    </div>


                    {/* Signup Form */}

                    <Form {...form}>

                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-5"
                        >

                            {/* Username */}

                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>

                                        <FormLabel className="text-sm font-medium text-gray-700">
                                            Username
                                        </FormLabel>

                                        <FormControl>
                                            <Input
                                                placeholder="Choose a username"
                                                className="h-11 border-gray-300 focus-visible:ring-violet-500"
                                                {...field}
                                                onChange={(e) => {
                                                    field.onChange(e)
                                                    debounced(e.target.value)
                                                }}
                                            />
                                        </FormControl>

                                        <div className="flex min-h-5 items-center gap-2">

                                            {isCheckingUsername && (
                                                <HugeiconsIcon
                                                    icon={Loading03Icon}
                                                    className="h-4 w-4 animate-spin text-gray-500"
                                                />
                                            )}

                                            <p
                                                className={`text-xs ${
                                                    usernameMessage === "Username is unique"
                                                        ? 'text-green-600'
                                                        : 'text-red-500'
                                                }`}
                                            >
                                                {usernameMessage}
                                            </p>

                                        </div>

                                        
                                     

                                    </FormItem>
                                )}
                            />


                            {/* Email */}

                            <FormField
                              control={form.control}
                                  name="email"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className="text-sm font-medium text-gray-700">
                                        Email Address
                                      </FormLabel>

                                      <FormControl>
                                        <Input
                                          type="email"
                                          placeholder="Enter your email"
                                          className="h-11 border border-gray-300 bg-white text-gray-900 shadow-none outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-0"
                                          {...field}
                                        />
                                      </FormControl>

                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />


                            {/* Password */}

                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>

                                        <FormLabel className="text-sm font-medium text-gray-700">
                                            Password
                                        </FormLabel>

                                        <FormControl>
                                            <Input
                                                type="password"
                                                placeholder="Create a password"
                                                className="h-11 border-gray-300 focus-visible:ring-violet-500"
                                                {...field}
                                            />
                                        </FormControl>

                                        <FormMessage />

                                    </FormItem>
                                )}
                            />


                            {/* Submit Button */}

                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="h-11 w-full bg-violet-600 text-sm font-semibold text-white hover:bg-violet-700"
                            >

                                {isSubmitting ? (
                                    <>
                                        <HugeiconsIcon
                                            icon={Loading03Icon}
                                            className="mr-2 h-4 w-4 animate-spin"
                                        />
                                        Please wait...
                                    </>
                                ) : (
                                    'Create Account'
                                )}

                            </Button>

                        </form>

                    </Form>


                    {/* Sign In Link */}

                    <div className="mt-7 border-t border-gray-100 pt-6 text-center">

                        <p className="text-sm text-gray-500">
                            Already have an account?{' '}

                            <Link
                                href="/sign-in"
                                className="font-semibold text-violet-600 transition hover:text-violet-700"
                            >
                                Sign in
                            </Link>

                        </p>

                    </div>

                </div>


                {/* Footer */}

                <p className="mt-6 text-center text-xs text-gray-400">
                    Your conversations, your privacy.
                </p>

            </div>

        </div>
    )
}

export default page