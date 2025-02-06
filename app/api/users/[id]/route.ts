import { NextResponse } from "next/server"
import prisma from "../../../../lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../../pages/api/auth/[...nextauth]"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const userId = params.id

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      tweets: {
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
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  })

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  return NextResponse.json(user)
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.id !== params.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const userId = params.id
  const { bio } = await request.json()

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { bio },
  })

  return NextResponse.json(updatedUser)
}

