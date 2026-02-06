# Pocketnote

A full-stack notes and bookmark manager built with Node.js, Express, MongoDB, and Next.js 14.

## 📁 Project Structure

```
pocketNOTE/
├── backend/              # Node.js + Express API
│   ├── config/          # Configuration files (database)
│   ├── server.js        # Main server file
│   ├── package.json
│   └── .env.example
└── frontend/            # Next.js 14 App Router
    ├── app/            # App Router pages and layouts
    ├── package.json
    └── .env.example
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Update the `.env` file with your MongoDB connection string:
   ```
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/pocketnote
   ```
   
   For MongoDB Atlas, use:
   ```
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/pocketnote?retryWrites=true&w=majority
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

   The backend API will be running at `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file based on `.env.example`:
   ```bash
   cp .env.example .env.local
   ```

4. Update the `.env.local` file:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:5000
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

   The frontend will be running at `http://localhost:3000`

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - MongoDB object modeling
- **dotenv** - Environment variable management
- **CORS** - Cross-origin resource sharing

### Frontend
- **Next.js 14+** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React** - UI library

## 📝 Available Scripts

### Backend
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## 🔮 Future Features

- [ ] User authentication
- [ ] Create/Read/Update/Delete notes
- [ ] Create/Read/Update/Delete bookmarks
- [ ] Categories and tags
- [ ] Search functionality
- [ ] Rich text editor for notes
- [ ] Bookmark preview and metadata fetching
- [ ] Export/Import functionality

## 📄 License

MIT
