'use client'

import React from 'react'
import Link from 'next/link'

import Navbar from '@/components/Navbar'

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card"

import message from "@/message.json"
import Autoplay from "embla-carousel-autoplay"

import {
  MessageCircle,
  ShieldCheck,
  ArrowRight,
} from "lucide-react"


const Home = () => {
  return (
    <main className="min-h-screen flex flex-col bg-gray-50 text-gray-900">

      {/* NAVBAR */}
      <Navbar />


      {/* HERO SECTION */}
      <section className="flex flex-1 flex-col items-center justify-center px-5 py-20 text-center">

        <div className="mb-6 flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-4 py-2 text-sm font-medium text-violet-700">
          <ShieldCheck className="h-4 w-4" />
          Your identity stays anonymous
        </div>

        <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl">
          Share Your Thoughts.
          <span className="block text-violet-600">
            Stay Anonymous.
          </span>
        </h1>

        <p className="mt-6 max-w-2xl text-base leading-7 text-gray-500 sm:text-lg">
          Welcome to HiddenBox! A simple place to share your thoughts,
          ask questions, and receive anonymous messages from people.
          Create your personal link and start a conversation.
        </p>

        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row">

          <Link
            href="/sign-up"
            className="flex items-center gap-2 rounded-lg bg-violet-600 px-6 py-3 font-semibold text-white transition hover:bg-violet-700"
          >
            Get Started
            <ArrowRight className="h-4 w-4" />
          </Link>

          <Link
            href="/sign-in"
            className="rounded-lg border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-100"
          >
            Login to Your Account
          </Link>

        </div>

        <div className="mt-8 flex items-center gap-2 text-sm text-gray-500">
          <MessageCircle className="h-4 w-4 text-violet-600" />
          Simple. Private. Anonymous.
        </div>

      </section>


      {/* MESSAGE CAROUSEL SECTION */}
      <section className="border-t border-gray-200 bg-white px-5 py-16">

        <div className="mx-auto max-w-6xl">

          <div className="mb-10 text-center">

            <h2 className="text-2xl font-bold sm:text-3xl">
              Need Something to Ask?
            </h2>

            <p className="mt-3 text-gray-500">
              Here are some interesting questions to start a conversation.
            </p>

          </div>


          <Carousel
            plugins={[
              Autoplay({
                delay: 3000,
                stopOnInteraction: false,
              }),
            ]}
            opts={{
              align: "center",
              loop: true,
            }}
            className="mx-auto w-full max-w-4xl"
          >

            <CarouselContent>

              {message.map((item, index) => (

                <CarouselItem
                  key={index}
                  className="basis-full px-3 sm:basis-1/2"
                >

                  <Card className="h-full border border-gray-200 bg-gray-50 shadow-sm transition hover:shadow-md">

                    <CardHeader>

                      <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-100 text-violet-600">
                          <MessageCircle className="h-5 w-5" />
                        </div>

                        <div>
                          <p className="font-semibold text-gray-800">
                            {item.title}
                          </p>

                          <p className="text-xs text-gray-400">
                            Conversation Starter
                          </p>
                        </div>

                      </div>

                    </CardHeader>

                    <CardContent className="min-h-32">

                      <p className="text-lg leading-7 text-gray-600">
                        {item.content}
                      </p>

                    </CardContent>

                  </Card>

                </CarouselItem>

              ))}

            </CarouselContent>

            <div className="mt-8 flex items-center justify-center gap-5">

              <CarouselPrevious className="static translate-y-0" />

              <CarouselNext className="static translate-y-0" />

            </div>

          </Carousel>

        </div>

      </section>


      {/* SIMPLE FOOTER */}
      <footer className="border-t border-gray-200 bg-white px-5 py-6">

        <div className="container mx-auto flex flex-col items-center justify-between gap-3 sm:flex-row">

          <p className="text-lg font-bold text-gray-800">
            Hidden<span className="text-violet-600">Box</span>
          </p>

          <p className="text-center text-sm text-gray-500">
            © {new Date().getFullYear()} HiddenBox. All rights reserved.
          </p>

          <p className="text-sm text-gray-500">
            Your conversations, your privacy.
          </p>

        </div>

      </footer>

    </main>
  )
}

export default Home