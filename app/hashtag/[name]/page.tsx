import HashtagFeed from "../../components/HashtagFeed"

export default function HashtagPage({ params }: { params: { name: string } }) {
  return (
    <div className="max-w-2xl mx-auto mt-8">
      <HashtagFeed hashtag={params.name} />
    </div>
  )
}

