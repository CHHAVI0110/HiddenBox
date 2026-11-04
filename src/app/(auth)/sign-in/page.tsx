'use client'
import * as z from 'zod'
import {zodResolver} from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useState, useEffect } from 'react'
import Link from "next/link"
import {useDebounceCallback} from 'usehooks-ts'
import {toast} from "@/components/ui/toast"
import { useRouter } from 'next/navigation'
import { signUpSchema } from '@/schema/signUpSchema'
import axios, {AxiosError} from "axios"
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
import { signInSchema } from '@/schema/signInSchema'
import { signIn } from 'next-auth/react'

const page =() =>{
    const router = useRouter();
    //zod implemenatation

    const form = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema),
        defaultValues:{
            identifier:'', 
            password:''
        }
    })
   

    const onSubmit = async (data: z.infer<typeof signInSchema>)=>{

        const result=await signIn('credentials',{
          redirect:false,
          identifier: data.identifier,
          password : data.password,
        })
        if(result?.error){
          toast.add({
            title:"Login Failed",
            description:"Incorrect username or password",
            type:"error"
          })
        }

        if(result?.url){
          router.replace('/dashboard')
        }

    }


return (
  <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-10">

    <div className="w-full max-w-md">

      {/* Sign-in Card */}

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">

        {/* Heading */}

        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Welcome Back
          </h1>

          <p className="mt-3 text-sm leading-6 text-gray-500">
            Sign in to continue your anonymous messaging experience.
          </p>
        </div>

        {/* Sign-in Form */}

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-5"
          >

            {/* Email / Username */}

            <FormField
              control={form.control}
              name="identifier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Username
                  </FormLabel>

                  <FormControl>
                    <Input
                      placeholder="Enter your email or username"
                      className="h-11 border border-gray-300 bg-white text-gray-900 shadow-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-0"
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
                      placeholder="Enter your password"
                      className="h-11 border border-gray-300 bg-white text-gray-900 shadow-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-0"
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
              className="h-11 w-full bg-violet-600 text-sm font-semibold text-white hover:bg-violet-700"
            >
              Sign In
            </Button>

          </form>
        </Form>

        {/* Sign-up Link */}

        <div className="mt-7 border-t border-gray-100 pt-6 text-center">
          <p className="text-sm text-gray-500">
            Don't have an account?{' '}

            <Link
              href="/sign-up"
              className="font-semibold text-violet-600 transition hover:text-violet-700"
            >
              Create an account
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
)}
export default page 