"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import type { Tweet as TweetType } from "../../types"
import TweetForm from "./TweetForm"

interface TweetProps {
  tweet: TweetType
}

export default function Tweet({ tweet }: TweetProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [isRetweeted, setIsRetweeted] = useState(false)
  const [showReplyForm, setShowReplyForm] = useState(false)
  const { data: session } = useSession()

  const handleLike = async () => {
    if (!session) return

    const method = isLiked ? "DELETE" : "POST"
    const response = await fetch(`/api/tweets/${tweet.id}/like`, { method })

    if (response.ok) {
      setIsLiked(!isLiked)
    }
  }

  const handleRetweet = async () => {
    if (!session) return

    const method = isRetweeted ? "DELETE" : "POST"
    const response = await fetch(`/api/tweets/${tweet.id}/retweet`, { method })

    if (response.ok) {
      setIsRetweeted(!isRetweeted)
    }
  }

  return (
    <div className="border-b p-4">
      <p className="font-bold">{tweet.author.name}</p>
      <p>{tweet.content}</p>
      <p className="text-sm text-gray-500">{new Date(tweet.createdAt).toLocaleString()}</p>
      <div className="flex mt-2 space-x-4">
        <button onClick={handleLike} className={isLiked ? "text-red-500" : ""}>
          Like ({tweet.likes.length})
        </button>
        <button onClick={handleRetweet} className={isRetweeted ? "text-green-500" : ""}>
          Retweet ({tweet.retweets.length})
        </button>
        <button onClick={() => setShowReplyForm(!showReplyForm)}>Reply ({tweet.replies.length})</button>
      </div>
      {showReplyForm && (
        <div className="mt-2">
          <TweetForm replyToId={tweet.id} />
        </div>
      )}
      {tweet.replies.length > 0 && (
        <div className="mt-2 ml-4">
          <h3 className="font-bold">Replies:</h3>
          {tweet.replies.map((reply) => (
            <Tweet key={reply.id} tweet={reply} />
          ))}
        </div>
      )}
    </div>
  )
}

