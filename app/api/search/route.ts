import { NextResponse } from "next/server"
import prisma from "../../../lib/prisma"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("q")

  if (!query) {
    return NextResponse.json({ error: "Search query is required" }, { status: 400 })
  }

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

  return NextResponse.json({ users, tweets })
}

