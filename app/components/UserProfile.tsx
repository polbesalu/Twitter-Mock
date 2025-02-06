"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import type { User, Tweet } from "../../types"
import TweetList from "./TweetList"
import FollowButton from "./FollowButton"
import Pusher from "pusher-js"

interface UserProfileProps {
  userId: string
}

export default function UserProfile({ userId }: UserProfileProps) {
  const [user, setUser] = useState<User | null>(null)
  const [tweets, setTweets] = useState<Tweet[]>([])
  const [bio, setBio] = useState("")
  const { data: session } = useSession()
  const [isFollowing, setIsFollowing] = useState(false)

  useEffect(() => {
    const fetchUser = async () => {
      const response = await fetch(`/api/users/${userId}`)
      const data = await response.json()
      setUser(data)
      setTweets(data.tweets)
      setBio(data.bio || "")
      setIsFollowing(data.isFollowing)
    }

    fetchUser()

    // Set up Pusher for real-time updates
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    })

    const channel = pusher.subscribe(`user-${userId}`)
    channel.bind("new-follower", (data: { followerId: string; followerName: string }) => {
      setUser((prevUser) => {
        if (prevUser) {
          return {
            ...prevUser,
            followerCount: prevUser.followerCount + 1,
          }
        }
        return prevUser
      })
    })

    return () => {
      pusher.unsubscribe(`user-${userId}`)
    }
  }, [userId])

  const handleUpdateBio = async () => {
    if (!session || session.user.id !== userId) return

    const response = await fetch(`/api/users/${userId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ bio }),
    })

    if (response.ok) {
      const updatedUser = await response.json()
      setUser(updatedUser)
    }
  }

  if (!user) return <div>Loading...</div>

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">{user.name}</h1>
      <img src={user.image || "/placeholder.svg"} alt={user.name} className="w-20 h-20 rounded-full mb-4" />
      {session && session.user.id === userId ? (
        <div className="mb-4">
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Write your bio..."
          />
          <button onClick={handleUpdateBio} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Update Bio
          </button>
        </div>
      ) : (
        <p className="mb-4">{user.bio}</p>
      )}
      <div className="flex items-center space-x-4 mb-4">
        <span>{user.followerCount} Followers</span>
        <span>{user.followingCount} Following</span>
        <FollowButton userId={userId} initialIsFollowing={isFollowing} />
      </div>
      <h2 className="text-xl font-bold mb-2">Tweets</h2>
      <TweetList initialTweets={tweets} nextCursor={null} />
    </div>
  )
}

