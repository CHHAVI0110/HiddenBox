'use client'

import {Message} from "@/model/User"
import { AcceptMessageSchema } from "@/schema/acceptMessageSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useSession } from "next-auth/react"
import { useCallback, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import axios, { AxiosError } from "axios"
import { ApiResponse } from "@/types/ApiResponse"
import { toast } from "@/components/ui/toast"

import {Button}  from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import {Loader2 , RefreshCcw} from "lucide-react"
import {User} from "next-auth"

import Navbar from "@/components/Navbar"


import MessageCard from "@/components/MessageCard"





const page=()=>{
    const [messages, setMessages] = useState<Message[]>([])
    const [isLoading, setIsLoading] =useState(false)
    const [isSwitchLoading, setIsSwitchLoading]= useState(false)

    const handleDeleteMessage = (messageId:string)=>{
        setMessages(messages.filter((message)=> message._id.toString() !== messageId))
    }

    const {data:session}=useSession()
    const form= useForm({
        resolver :zodResolver(AcceptMessageSchema)
    })

    const {watch, setValue, register} = form;
    const acceptMessages = watch('acceptMessages')

    const fetchAcceptMessage = useCallback(async()=>{
        setIsSwitchLoading(true)
        try{
            const response = await axios.get<ApiResponse>('/api/accept-messages')
            setValue('acceptMessages', response.data.isAcceptMessage ?? false)
           


        }catch(error){
        const axiosError = error as AxiosError<ApiResponse>
         toast.add({
                title:"Error",
                description: axiosError.response?.data.message || "Fialed to fetch message settings",
            })


        }finally{
            setIsSwitchLoading(false)

        }

    },[setValue])

    const fetchMessages = useCallback(async(refresh: boolean = false)=>{
        setIsLoading(true)
        
        try{
            const response = await axios.get<ApiResponse>('/api/get-messages')
            setMessages(response.data.messages || [])
            if(refresh){
                toast.add({
                    title:"Refreshed Messages",
                    description: "Showing latest messages",
                })
            }

        }catch(error){
            const axiosError = error as AxiosError<ApiResponse>
         toast.add({
                title:"Error",
                description: axiosError.response?.data.message || "Fialed to fetch message settings",
            })
        }finally{
            setIsLoading(false)
            setIsSwitchLoading(false)
        }
    },[setIsLoading,setMessages])

    useEffect(()=>{
        if(!session || !session.user) return
        fetchMessages()
        fetchAcceptMessage()
           
    },[session,setValue,fetchAcceptMessage,fetchMessages])

    //handle switch change

    const handleSwitchChange = async()=>{
        try{
            const response = await axios.post<ApiResponse>('/api/accept-messages',{
                acceptMessages: !acceptMessages
            })
            setValue('acceptMessages' , !acceptMessages)
            toast.add({
                title : response.data.message,
                
            })
        }catch(error){
            const axiosError = error as AxiosError<ApiResponse>
         toast.add({
                title:"Error",
                description: axiosError.response?.data.message || "Fialed to fetch message settings",
            })

        }
    }

    //const {username}= session?.user as User
    const username = session?.user?.username
    const [baseUrl, setBaseUrl] = useState("")

    useEffect(() => {
        setBaseUrl(window.location.origin)
    }, [])

    const profileUrl = username ? `${baseUrl}/u/${username}` : ""
    //const baseUrl= `${window.location.protocol}//${window.location.host}`
    //const profileUrl = `${baseUrl}/u/${username}`

    const copyToClipboard = ()=>{
        navigator.clipboard.writeText(profileUrl)
        toast.add({
            title:"URL copied",
            description:"Profile URL has been copied to clipboard"

        })
    }


    if(!session || !session.user){
        return <div>Please Login</div>
    }




return (
    <>
        <Navbar />

        <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6">
            {/* Rest of your dashboard code */}
        

    <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6">

        <div className="mx-auto w-full max-w-6xl">

            {/* Dashboard Header */}

            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-blue-600 sm:text-4xl">
                    Your Message Center
                </h1>

                <p className="mt-2 text-sm text-gray-500">
                    Manage your profile, control message settings, and view anonymous messages.
                </p>
            </div>


            {/* Profile Link Section */}

            <section className="mb-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">

                <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                        Your Anonymous Message Link
                    </h2>

                    <p className="mt-1 text-sm leading-6 text-gray-500">
                        Share your personal link with friends, family, or your social network.
                        Anyone with this link can send you an anonymous message.
                    </p>
                </div>

                <div className="mt-5 flex flex-col gap-3 sm:flex-row">

                    <input
                        type="text"
                        value={profileUrl}
                        disabled
                        className="h-11 w-full rounded-lg border border-gray-300 bg-gray-50 px-3 text-sm text-gray-600 outline-none disabled:cursor-not-allowed"
                    />

                    <Button
                        onClick={copyToClipboard}
                        className="h-11 shrink-0 bg-violet-600 px-6 text-white hover:bg-violet-700"
                    >
                        Copy Link
                    </Button>

                </div>

                <p className="mt-3 text-xs text-gray-400">
                    Your identity remains private when someone sends you a message.
                </p>

            </section>


            {/* Message Settings */}

            <section className="mb-8 rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">

                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">
                            Message Settings
                        </h2>

                        <p className="mt-1 text-sm leading-6 text-gray-500">
                            Decide whether you want to receive anonymous messages.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">

                        <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                acceptMessages
                                    ? "bg-green-50 text-green-700"
                                    : "bg-gray-100 text-gray-600"
                            }`}
                        >
                            {acceptMessages ? "Enabled" : "Disabled"}
                        </span>

                        <Switch
                            checked={acceptMessages ?? false}
                            onCheckedChange={handleSwitchChange}
                            disabled={isSwitchLoading}
                        />

                    </div>

                </div>

                <div className="mt-4 border-t border-gray-100 pt-4">
                    <p className="text-sm text-gray-500">
                        {acceptMessages
                            ? "Your profile is currently open to anonymous messages."
                            : "Your profile is currently not accepting new messages. Turn on the setting to receive messages."
                        }
                    </p>
                </div>

            </section>


            {/* Inbox Header */}

            <section>

                <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">

                    <div>
                        <h2 className="text-xl font-bold text-gray-900">
                            Your Inbox
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            All the anonymous messages you've received.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">

                        <span className="rounded-full bg-violet-50 px-3 py-1 text-sm font-medium text-violet-700">
                            {messages.length} {messages.length === 1 ? "Message" : "Messages"}
                        </span>

                        <Button
                            variant="outline"
                            className="border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
                            onClick={(e) => {
                                e.preventDefault()
                                fetchMessages(true)
                            }}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <RefreshCcw className="mr-2 h-4 w-4" />
                            )}

                            Refresh
                        </Button>

                    </div>

                </div>


                {/* Message Cards */}

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                    {messages.length > 0 ? (

                        messages.map((message) => (
                            <MessageCard
                                key={message._id.toString()}
                                message={message}
                                onMessageDelete={handleDeleteMessage}
                            />
                        ))

                    ) : (

                        <div className="col-span-full rounded-xl border border-dashed border-gray-300 bg-white px-6 py-14 text-center">

                            <h3 className="text-lg font-semibold text-gray-900">
                                Your Inbox is Empty
                            </h3>

                            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
                                You haven't received any anonymous messages yet.
                                Share your personal link with others to start a conversation.
                            </p>

                            <Button
                                onClick={copyToClipboard}
                                className="mt-5 bg-violet-600 text-white hover:bg-violet-700"
                            >
                                Copy Your Profile Link
                            </Button>

                        </div>

                    )}

                </div>

            </section>

        </div>

    </div>
</div>
</>
)

}
export default page
