export interface User {
  id: string
  name: string
  email: string
  image: string
  bio?: string
  followers: User[]
  following: User[]
  followerCount: number
  followingCount: number
}

export interface Tweet {
  id: string
  content: string
  createdAt: string
  author: User
  likes: Like[]
  retweets: Retweet[]
  replies: Tweet[]
  replyToId: string | null
  hashtags: Hashtag[]
}

export interface Like {
  id: string
  userId: string
  tweetId: string
}

export interface Retweet {
  id: string
  userId: string
  tweetId: string
}

export interface Hashtag {
  id: string
  name: string
}

export interface Message {
  id: string
  content: string
  createdAt: string
  senderId: string
  receiverId: string
}

