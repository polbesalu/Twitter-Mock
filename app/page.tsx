import { getServerSession } from "next-auth/next"
import { authOptions } from "./api/auth/[...nextauth]/route"
import prisma from "../lib/prisma"
import TweetForm from "./components/TweetForm"
import TweetList from "./components/TweetList"
import Link from "next/link"
import type { Tweet } from "../types"

export default async function Home() {
  const session = await getServerSession(authOptions)
  const limit = 10

  const tweets = await prisma.tweet.findMany({
    take: limit,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      author: true,
      likes: true,
      retweets: true,
      replies: {
        include: {
          author: true,
        },
      },
      hashtags: true,
    },
  })

  const nextCursor = tweets.length === limit ? tweets[tweets.length - 1].id : null

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <h1 className="text-3xl font-bold mb-4">Twitter Clone</h1>
      {session && (
        <>
          <TweetForm />
          <Link href={`/profile/${session.user.id}`} className="text-blue-500 hover:underline">
            View Your Profile
          </Link>
        </>
      )}
      <TweetList initialTweets={tweets as unknown as Tweet[]} nextCursor={nextCursor} />
    </div>
  )
}

