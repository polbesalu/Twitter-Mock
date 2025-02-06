import { getServerSession } from "next-auth/next"
import { authOptions } from "../../../pages/api/auth/[...nextauth]"
import UserProfile from "../../components/UserProfile"
import Link from "next/link" // Import Link component

export default async function ProfilePage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <UserProfile userId={params.id} />
      {session && session.user.id !== params.id && (
        <Link href={`/messages/${params.id}`} className="text-blue-500 hover:underline">
          Send Message
        </Link>
      )}
    </div>
  )
}

