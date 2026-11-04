"use client"

import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { messageSchema } from '@/schema/messageSchema';
import { ApiResponse } from "@/types/ApiResponse"
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from "@/components/ui/toast"
import { z } from 'zod';
import { useCompletion } from '@ai-sdk/react';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { getErrorMessage } from '@/helpers/error';
import { Skeleton } from "@/components/ui/skeleton"
import Navbar from "@/components/Navbar"
const parseJsonErrorMessage = (error: Error | any): string => {
  return getErrorMessage(JSON.parse(error.message));
}

const specialChar = "||"; // character used as as dividor between messages in AI's reponse

const initialSuggestions: string = "What's your favorite movie?||Do you have any pets?||What's your dream job?";

function Page() {
  const { username } = useParams<{ username: string }>();
  const router = useRouter();
  const [isSending, setIsSending] = useState<boolean>(false);

  const [isTokenLimitError, setIsTokenLimitError] = useState<boolean>(false);
  const { complete, completion, isLoading: isSuggestionsLoading, stop, error } = useCompletion({
    api: '/api/suggest-messages/',
    streamProtocol: "text",
    onFinish: (prompt, completion) => {
      if (!completion.trim()) {
            toast.add({
              title: "An Error Occurred",
              description: "Suggestion failed due to token limit. Please try again.",
            });

            setIsTokenLimitError(true);
          }
    },
    onError: (error) => {
      
      toast.add({
        title: "An Error Occurred",
        description: parseJsonErrorMessage(error),
   
      });
    },
    initialCompletion: initialSuggestions
  });
  const [wasStopped, setWasStopped] = useState<boolean>(false); // Only by User

  const { watch, setValue, handleSubmit, control, reset } = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: { content: "" }
  });

  const msgContent = watch("content");

  const sendMessage = async (data: z.infer<typeof messageSchema>) => {
    setIsSending(true);

    try {
      await axios.post<ApiResponse>("/api/send-message/", { username, content: data.content });
      toast.add({
         title: "Message Sent!",
         description: "Your anonymous message has been sent successfully.",
      })
      reset({ content: '' });
    }
    catch (err) {
      console.error("Error in Sending Message: ", err);
      const axiosError = err as AxiosError<ApiResponse>;
      toast.add({
            title: "Error",
            description:axiosError.response?.data.message || "Failed to send message. Please try again later!",
      });

      if (axiosError.response?.data.message.includes("Not Authenticated")) router.replace("/sign-in");0
    }
    finally {
      setIsSending(false);
    }
  }

  const fetchMsgSuggestions = async () => {
    setWasStopped(false);

    try {
      await complete('');
    }
    catch (error) {
      console.error('Error fetching messages:', error);
      toast.add({
        title: "Error",
        description:"Message Suggestions Failed due to technical issues. Please try again later!",

      });
    }
  }

  const handleStopSuggestions = () => {
    setWasStopped(true);
    stop();
  };

  const renderSuggestions = () => {
    const suggestions = isTokenLimitError ? initialSuggestions.split(specialChar) : completion.split(specialChar);

    // If Error while Streaming Tokens
    if (error && !isSuggestionsLoading) {
      return <p className="text-red-500"> {parseJsonErrorMessage(error)} </p>
    }

    // If User has Requested to Give Message Suggestions, but Streaming Token (Msgs) hasn't Started
    if (isSuggestionsLoading && !completion ) {
      return (
        <>
          <Skeleton className="h-11 w-full rounded-md" />
          <Skeleton className="h-11 w-full rounded-md" />
          <Skeleton className="h-11 w-full rounded-md" />
        </>
      );
    }

    // If User has Stopped the Suggestion Process by itself. 
    if (wasStopped) {
      return <>
        <p> Message Suggestions Stopped </p>

        {initialSuggestions.split(specialChar).map((msg, idx) => (
          <Button key={idx} variant="outline" className="!text-wrap py-3 h-auto min-h-9" onClick={() => setValue("content", msg)} >
            {msg}
          </Button>
        ))}
      </>
    }

    // If Streaming of Message Suggestions has started
    return (<>
      {suggestions.map((msg, idx) => (
        <Button key={idx} variant="outline" className="text-wrap! py-3 h-auto min-h-9" onClick={() => setValue("content", msg)} >
          {msg}
        </Button>
      ))}
    </>);
};

  useEffect(() => {
    if (!error) {
      return;
    }

    const errMsg = parseJsonErrorMessage(error);
    if (errMsg === "Not Authenticated. Please Login!") {
      router.replace("/sign-in");
    }
  }, [error, router]);



return (
  <>
    <Navbar />

    <div className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6">
      <div className="mx-auto w-full max-w-3xl">

        {/* Page Heading */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-blue-600 sm:text-4xl">
            Send an Anonymous Message
          </h1>

          <p className="mt-3 text-sm leading-6 text-gray-500">
            Share your thoughts, ask a question, or leave a message.
            Your identity will remain anonymous.
          </p>
        </div>

        {/* Message Form */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
          <form onSubmit={handleSubmit(sendMessage)} className="space-y-6">

            <Controller
              name="content"
              control={control}
              render={({ field, fieldState }) => (
                <Field
                  data-invalid={fieldState.invalid}
                  orientation="responsive"
                  className="space-y-3"
                >
                  <FieldLabel
                    htmlFor={field.name}
                    className="text-base font-semibold text-gray-800"
                  >
                    Send an anonymous message to{" "}
                    <span className="rounded-md bg-blue-50 px-2 py-1 text-blue-600">
                      @{username}
                    </span>
                  </FieldLabel>

                  <Textarea
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="Write your anonymous message here..."
                    className="min-h-36 resize-none border-gray-300 bg-white p-4 text-sm leading-6 focus-visible:ring-blue-500"
                  />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Button
              type="submit"
              disabled={isSending || !msgContent}
              aria-disabled={isSending || !msgContent}
              className="h-11 w-full bg-blue-600 font-semibold text-white hover:bg-blue-700"
            >
              {isSending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending Message...
                </>
              ) : (
                "Send Anonymous Message"
              )}
            </Button>

          </form>
        </div>

        {/* AI Suggestions Section */}
        <div className="mt-8">
          <div className="mb-5 text-center">
            <h2 className="text-xl font-bold text-gray-900">
              Need Some Inspiration?
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Get AI-generated suggestions to start a conversation.
            </p>
          </div>

          {/* Suggestion Actions */}
          <div className="mb-5 flex flex-wrap items-center justify-center gap-3">
            <Button
              type="button"
              onClick={fetchMsgSuggestions}
              className="bg-blue-600 text-white hover:bg-blue-700"
              disabled={isSuggestionsLoading}
              aria-disabled={isSuggestionsLoading}
            >
              {isSuggestionsLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Get AI Suggestions
                </>
              )}
            </Button>

            <Button
              type="button"
              variant="outline"
              disabled={!isSuggestionsLoading}
              aria-disabled={!isSuggestionsLoading}
              onClick={handleStopSuggestions}
              className="border-gray-300"
            >
              Stop
            </Button>
          </div>

          {/* Suggestions Card */}
          <Card className="border border-gray-200 bg-white shadow-sm">
            <CardHeader className="border-b border-gray-100 pb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Suggested Messages
              </h3>

              <p className="text-sm text-gray-500">
                Select any suggestion to use it as your message.
              </p>
            </CardHeader>

            <CardContent className="flex flex-col gap-3 pt-5">
              {renderSuggestions()}
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-xs text-gray-400">
          HiddenBox · Your conversations, your privacy.
        </p>

      </div>
    </div>
  </>
)

}

export default Page
