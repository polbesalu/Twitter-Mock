import { NextResponse } from "next/server"
import prisma from "../../../lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../pages/api/auth/[...nextauth]"
import pusher from "../../../lib/pusher"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const cursor = searchParams.get("cursor")
  const limit = 10

  const tweets = await prisma.tweet.findMany({
    take: limit,
    skip: cursor ? 1 : 0,
    cursor: cursor ? { id: cursor } : undefined,
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
    },
  })

  const nextCursor = tweets.length === limit ? tweets[tweets.length - 1].id : null

  return NextResponse.json({ tweets, nextCursor })
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { content, replyToId } = await request.json()
  const tweet = await prisma.tweet.create({
    data: {
      content,
      authorId: session.user.id,
      replyToId,
    },
    include: {
      author: true,
    },
  })

  // Trigger Pusher event
  await pusher.trigger("tweets", "new-tweet", tweet)

  return NextResponse.json(tweet)
}

