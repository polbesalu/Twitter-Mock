import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route"
import pusher from "@/lib/pusher"

export async function GET(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const otherUserId = searchParams.get("otherUserId")

  if (!otherUserId) {
    return NextResponse.json({ error: "Other user ID is required" }, { status: 400 })
  }

  const messages = await prisma.message.findMany({
    where: {
      OR: [
        { senderId: session.user.id, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: session.user.id },
      ],
    },
    orderBy: {
      createdAt: "asc",
    },
    include: {
      sender: true,
      receiver: true,
    },
  })

  return NextResponse.json(messages)
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { content, receiverId } = await request.json()

  const message = await prisma.message.create({
    data: {
      content,
      senderId: session.user.id,
      receiverId,
    },
    include: {
      sender: true,
      receiver: true,
    },
  })

  // Trigger Pusher event for real-time updates
  await pusher.trigger(`private-user-${receiverId}`, "new-message", message)

  return NextResponse.json(message)
}

