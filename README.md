#  JustAddMovies

An e-commerce movie shop where users can browse, search, and purchase movies. Built as a group project using a modern full-stack TypeScript setup.


---

## Features

- 🛒 Browse and purchase movies
- 🔍 Search and filter the movie catalogue
- 🧾 Shopping cart and checkout flow
- 🔐 User authentication

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | [Next.js](https://nextjs.org/) (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Database ORM | Prisma |
| Package Manager | pnpm |

---

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (`npm install -g pnpm`)
- A PostgreSQL database

### Installation

```bash
# Clone the repo
git clone https://github.com/gr-26-18/JustAddMovies-group-c.git
cd JustAddMovies-group-c

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
# Add your DATABASE_URL and AUTH_SECRET to .env

# Run database migrations
pnpm dlx prisma migrate dev
pnpm dlx prisma generate

# Start the dev server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## My Contribution

I was responsible for the **frontend and UI** of the project, including:

- Building and styling the core page layouts and components
- Implementing the movie catalogue browse and search UI
- Ensuring a responsive, accessible design across screen sizes
- Integrating frontend components with backend data and API routes

---

## Team

Built by Group C as part of a collaborative course project.

---

## License

This project is for educational purposes.
