# Twitter Clone

A modern Twitter clone built with Next.js, featuring real-time updates, user authentication, and a PostgreSQL database. This project demonstrates the implementation of core Twitter features using current web development best practices.

## 🌟 Features

### Authentication
- User authentication with NextAuth.js
- GitHub OAuth integration
- Protected routes and API endpoints

### Core Functionality
- Create and interact with tweets
- Follow/unfollow system
- Real-time updates for new tweets and followers
- User profiles with bio and stats
- Direct messaging between users
- Search functionality for users and tweets
- Hashtag support

### Technical Stack
- **Framework:** Next.js 13 with App Router
- **Database:** PostgreSQL with Prisma ORM
- **Real-Time Features:** Pusher
- **Styling:** Tailwind CSS
- **Language:** TypeScript

---

## 🚀 Installation and Setup

### Prerequisites
To run this project, you will need:
- **Node.js** (version 14 or later)
- **PostgreSQL database**
- **GitHub account** (for OAuth)
- **Pusher account** (for real-time features)

---

### Step-by-Step Setup

#### Step 1: Clone the Repository
Clone the project repository to your local machine:
```bash
git clone https://github.com/polbesalu/Twitter-Mock.git
cd Twitter-Mock
```

#### Step 2: Install Dependencies
Install the project dependencies:
```bash
npm install
# or
yarn install
```

#### Step 3: Configure Environment Variables
1. Create a `.env` file in the root of your project directory.
2. Add the following environment variables to the `.env` file:
   ```plaintext
   DATABASE_URL="your_postgresql_database_url"
   NEXTAUTH_SECRET="your_nextauth_secret"
   GITHUB_ID="your_github_oauth_app_id"
   GITHUB_SECRET="your_github_oauth_app_secret"
   PUSHER_APP_ID="your_pusher_app_id"
   PUSHER_KEY="your_pusher_key"
   PUSHER_SECRET="your_pusher_secret"
   PUSHER_CLUSTER="your_pusher_cluster"
   NEXT_PUBLIC_PUSHER_KEY="your_pusher_key"
   NEXT_PUBLIC_PUSHER_CLUSTER="your_pusher_cluster"
   ```
Replace the placeholder values with your actual credentials.

#### Step 4: Set Up the Database
1. Ensure PostgreSQL is installed and running.
2. Create a new database for the project.
3. Update the `DATABASE_URL` in the `.env` file with the correct database connection string.
4. Push the Prisma schema to the database:
   ```bash
   npx prisma db push
   ```
5. (Optional) Seed the database if you have a seed script:
   ```bash
   npx prisma db seed
   ```

#### Step 5: Run the Project

1. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```
2. Open your browser and navigate to `http://localhost:3000` to access the app.

---

## 📜 License
This project is licensed under the MIT License. See the LICENSE file for more details.
