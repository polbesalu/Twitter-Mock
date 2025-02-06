import { NextResponse } from "next/server"
import prisma from "../../../lib/prisma"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const name = searchParams.get("name")

  if (!name) {
    return NextResponse.json({ error: "Hashtag name is required" }, { status: 400 })
  }

  const hashtag = await prisma.hashtag.findUnique({
    where: { name },
    include: {
      tweets: {
        include: {
          tweet: {
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
          },
        },
      },
    },
  })

  if (!hashtag) {
    return NextResponse.json({ error: "Hashtag not found" }, { status: 404 })
  }

  const tweets = hashtag.tweets.map((ht) => ht.tweet)

  return NextResponse.json({ hashtag, tweets })
}

