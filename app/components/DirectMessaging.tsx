"use client"

import { useState, useEffect, type React } from "react" // Added React import
import { useSession } from "next-auth/react"
import type { Message, User } from "../../types"
import Pusher from "pusher-js"

interface DirectMessagingProps {
  otherUserId: string
}

export default function DirectMessaging({ otherUserId }: DirectMessagingProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const { data: session } = useSession()
  const [otherUser, setOtherUser] = useState<User | null>(null)

  useEffect(() => {
    if (!session) return

    const fetchMessages = async () => {
      const response = await fetch(`/api/messages?otherUserId=${otherUserId}`)
      const data = await response.json()
      setMessages(data)
    }

    const fetchOtherUser = async () => {
      const response = await fetch(`/api/users/${otherUserId}`)
      const data = await response.json()
      setOtherUser(data)
    }

    fetchMessages()
    fetchOtherUser()

    // Set up Pusher for real-time updates
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
      authEndpoint: "/api/pusher/auth",
    })

    const channel = pusher.subscribe(`private-user-${session.user.id}`)
    channel.bind("new-message", (message: Message) => {
      setMessages((prevMessages) => [...prevMessages, message])
    })

    return () => {
      pusher.unsubscribe(`private-user-${session.user.id}`)
    }
  }, [session, otherUserId])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session || !newMessage.trim()) return

    const response = await fetch("/api/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: newMessage,
        receiverId: otherUserId,
      }),
    })

    if (response.ok) {
      setNewMessage("")
    }
  }

  if (!session || !otherUser) return <div>Loading...</div>

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">Chat with {otherUser.name}</h1>
      <div className="border rounded p-4 h-96 overflow-y-auto mb-4">
        {messages.map((message) => (
          <div key={message.id} className={`mb-2 ${message.senderId === session.user.id ? "text-right" : "text-left"}`}>
            <span
              className={`inline-block p-2 rounded ${
                message.senderId === session.user.id ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
            >
              {message.content}
            </span>
          </div>
        ))}
      </div>
      <form onSubmit={handleSendMessage} className="flex">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-grow p-2 border rounded-l"
          placeholder="Type a message..."
        />
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-r hover:bg-blue-600">
          Send
        </button>
      </form>
    </div>
  )
}

