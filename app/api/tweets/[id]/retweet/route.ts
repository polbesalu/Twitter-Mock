import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../../auth/[...nextauth]/route"

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const tweetId = params.id

  const retweet = await prisma.retweet.create({
    data: {
      userId: session.user.id,
      tweetId,
    },
  })

  return NextResponse.json(retweet)
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const tweetId = params.id

  await prisma.retweet.delete({
    where: {
      userId_tweetId: {
        userId: session.user.id,
        tweetId,
      },
    },
  })

  return NextResponse.json({ success: true })
}

