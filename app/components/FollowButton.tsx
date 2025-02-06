"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"

interface FollowButtonProps {
  userId: string
  initialIsFollowing: boolean
  onFollowChange?: (isFollowing: boolean) => void
}

export default function FollowButton({ userId, initialIsFollowing, onFollowChange }: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing)
  const { data: session } = useSession()

  const handleFollow = async () => {
    if (!session) return

    const method = isFollowing ? "DELETE" : "POST"
    const response = await fetch(`/api/users/${userId}/follow`, { method })

    if (response.ok) {
      setIsFollowing(!isFollowing)
      if (onFollowChange) {
        onFollowChange(!isFollowing)
      }
    }
  }

  if (!session || session.user.id === userId) return null

  return (
    <button
      onClick={handleFollow}
      className={`px-4 py-2 rounded ${isFollowing ? "bg-gray-200 text-gray-800" : "bg-blue-500 text-white"}`}
    >
      {isFollowing ? "Unfollow" : "Follow"}
    </button>
  )
}

