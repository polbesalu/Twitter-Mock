"use client"

import { useState, useEffect } from "react"
import type { Tweet as TweetType } from "../../types"
import Tweet from "./Tweet"
import Pusher from "pusher-js"

interface TweetListProps {
  initialTweets: TweetType[]
  nextCursor: string | null
}

export default function TweetList({ initialTweets, nextCursor: initialNextCursor }: TweetListProps) {
  const [tweets, setTweets] = useState(initialTweets)
  const [nextCursor, setNextCursor] = useState(initialNextCursor)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    })

    const channel = pusher.subscribe("tweets")
    channel.bind("new-tweet", (newTweet: TweetType) => {
      setTweets((prevTweets) => [newTweet, ...prevTweets])
    })

    return () => {
      pusher.unsubscribe("tweets")
    }
  }, [])

  const loadMore = async () => {
    if (loading || !nextCursor) return

    setLoading(true)
    const response = await fetch(`/api/tweets?cursor=${nextCursor}`)
    const data = await response.json()

    setTweets((prevTweets) => [...prevTweets, ...data.tweets])
    setNextCursor(data.nextCursor)
    setLoading(false)
  }

  return (
    <div>
      {tweets.map((tweet) => (
        <Tweet key={tweet.id} tweet={tweet} />
      ))}
      {nextCursor && (
        <button
          onClick={loadMore}
          disabled={loading}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {loading ? "Loading..." : "Load More"}
        </button>
      )}
    </div>
  )
}

