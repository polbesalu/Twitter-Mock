"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

interface TweetFormProps {
  replyToId?: string
}

export default function TweetForm({ replyToId }: TweetFormProps) {
  const [content, setContent] = useState("")
  const { data: session } = useSession()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session) return

    const response = await fetch("/api/tweets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content, replyToId }),
    })

    if (response.ok) {
      setContent("")
      router.refresh()
    }
  }

  if (!session) return null

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <textarea
        className="w-full p-2 border rounded"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={replyToId ? "Tweet your reply" : "What's happening?"}
        rows={3}
      />
      <button type="submit" className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        {replyToId ? "Reply" : "Tweet"}
      </button>
    </form>
  )
}

