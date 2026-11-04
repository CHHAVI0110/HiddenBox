'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import { Button } from "@/components/ui/button"
import { Message } from "@/model/User"
import axios from "axios"
import { ApiResponse } from "@/types/ApiResponse"
import { toast } from "./ui/toast"

type MessageCardProps = {
  message: Message
  onMessageDelete: (messageId: string) => void
}

const MessageCard = ({ message, onMessageDelete }: MessageCardProps) => {

  const handleDeleteConfirm = async () => {
    try {
      const response = await axios.delete<ApiResponse>(
        `/api/delete-messages/${message._id}`
      )

      toast.add({
        title: response.data.message,
      })

      onMessageDelete(message._id.toString())
    } catch (error) {
      console.error("Failed to delete message:", error)

      toast.add({
        title: "Error",
        description: "Failed to delete the message. Please try again.",
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Anonymous Message</CardTitle>

        <CardDescription>
          Received on{" "}
          {new Date(message.createdAt).toLocaleString()}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <p className="break-words whitespace-pre-wrap">
          {message.content}
        </p>

        <AlertDialog>
          <AlertDialogTrigger
            render={<Button variant="destructive" className="mt-4" />}
          >
            Delete Message
          </AlertDialogTrigger>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Are you absolutely sure?
              </AlertDialogTitle>

              <AlertDialogDescription>
                This will permanently delete this message. This action cannot
                be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel>
                Cancel
              </AlertDialogCancel>

              <AlertDialogAction onClick={handleDeleteConfirm}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  )
}

export default MessageCard