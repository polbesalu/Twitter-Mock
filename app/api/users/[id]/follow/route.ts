import { NextResponse } from "next/server"
import prisma from "../../../../../lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../../../pages/api/auth/[...nextauth]"
import pusher from "../../../../../lib/pusher"

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const followerId = session.user.id
  const followingId = params.id

  if (followerId === followingId) {
    return NextResponse.json({ error: "Cannot follow yourself" }, { status: 400 })
  }

  const [follower, following] = await prisma.$transaction([
    prisma.user.update({
      where: { id: followerId },
      data: {
        following: {
          connect: { id: followingId },
        },
        followingCount: {
          increment: 1,
        },
      },
    }),
    prisma.user.update({
      where: { id: followingId },
      data: {
        followers: {
          connect: { id: followerId },
        },
        followerCount: {
          increment: 1,
        },
      },
    }),
  ])

  // Trigger Pusher event for real-time updates
  await pusher.trigger(`user-${followingId}`, "new-follower", {
    followerId: follower.id,
    followerName: follower.name,
  })

  return NextResponse.json({ follower, following })
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const followerId = session.user.id
  const followingId = params.id

  const [follower, following] = await prisma.$transaction([
    prisma.user.update({
      where: { id: followerId },
      data: {
        following: {
          disconnect: { id: followingId },
        },
        followingCount: {
          decrement: 1,
        },
      },
    }),
    prisma.user.update({
      where: { id: followingId },
      data: {
        followers: {
          disconnect: { id: followerId },
        },
        followerCount: {
          decrement: 1,
        },
      },
    }),
  ])

  return NextResponse.json({ follower, following })
}

