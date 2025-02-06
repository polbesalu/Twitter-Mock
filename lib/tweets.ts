import fs from "fs"
import path from "path"
import type { Tweet } from "../types"

const tweetsFile = path.join(process.cwd(), "tweets.json")

export function getTweets(): Tweet[] {
  if (!fs.existsSync(tweetsFile)) {
    return []
  }
  const fileContents = fs.readFileSync(tweetsFile, "utf8")
  return JSON.parse(fileContents)
}

export function saveTweet(tweet: Omit<Tweet, "id" | "createdAt">): Tweet {
  const tweets = getTweets()
  const newTweet: Tweet = {
    ...tweet,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  }
  tweets.unshift(newTweet)
  fs.writeFileSync(tweetsFile, JSON.stringify(tweets, null, 2))
  return newTweet
}

