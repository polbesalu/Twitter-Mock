import { getServerSession } from "next-auth/next"
import { authOptions } from "../../../pages/api/auth/[...nextauth]"
import DirectMessaging from "../../components/DirectMessaging"

export default async function MessagesPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return <div>Please sign in to view messages</div>
  }

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <DirectMessaging otherUserId={params.id} />
    </div>
  )
}

