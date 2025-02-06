import { getServerSession } from "next-auth/next"
import { authOptions } from "../../pages/api/auth/[...nextauth]"
import prisma from "../../lib/prisma"
import TweetList from "../components/TweetList"
import Link from "next/link"
import type { Tweet, User } from "../../types"

export default async function SearchPage({ searchParams }: { searchParams: { q: string } }) {
  const session = await getServerSession(authOptions)
  const query = searchParams.q

  const users = await prisma.user.findMany({
    where: {
      OR: [{ name: { contains: query, mode: "insensitive" } }, { email: { contains: query, mode: "insensitive" } }],
    },
    take: 5,
  })

  const tweets = await prisma.tweet.findMany({
    where: {
      OR: [
        { content: { contains: query, mode: "insensitive" } },
        { hashtags: { some: { hashtag: { name: { contains: query, mode: "insensitive" } } } } },
      ],
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
    take: 10,
  })

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <h1 className="text-3xl font-bold mb-4">Search Results for "{query}"</h1>

      <h2 className="text-2xl font-bold mt-8 mb-4">Users</h2>
      {users.length > 0 ? (
        <ul>
          {users.map((user: User) => (
            <li key={user.id} className="mb-2">
              <Link href={`/profile/${user.id}`} className="text-blue-500 hover:underline">
                {user.name} (@{user.email})
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>No users found.</p>
      )}

      <h2 className="text-2xl font-bold mt-8 mb-4">Tweets</h2>
      {tweets.length > 0 ? <TweetList initialTweets={tweets as Tweet[]} nextCursor={null} /> : <p>No tweets found.</p>}
    </div>
  )
}

