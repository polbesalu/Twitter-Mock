"use client"

import { useState, useEffect } from "react"
import type { Tweet } from "../../types"
import TweetList from "./TweetList"

interface HashtagFeedProps {
  hashtag: string
}

export default function HashtagFeed({ hashtag }: HashtagFeedProps) {
  const [tweets, setTweets] = useState<Tweet[]>([])

  useEffect(() => {
    const fetchTweets = async () => {
      const response = await fetch(`/api/hashtags?name=${encodeURIComponent(hashtag)}`)
      const data = await response.json()
      setTweets(data.tweets)
    }

    fetchTweets()
  }, [hashtag])

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">#{hashtag}</h1>
      <TweetList initialTweets={tweets} nextCursor={null} />
    </div>
  )
}

