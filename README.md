# HiddenBox – Anonymous Messaging Platform

HiddenBox is a web-based anonymous messaging platform that allows users to receive messages from others without revealing their identities. Users can create an account, share their unique profile link, and receive anonymous messages in a simple and secure environment.

## 🚀 Features

- **User Authentication:** Sign up and sign in using email and password.
- **Email Verification:** Verify user accounts using email verification codes.
- **Anonymous Messaging:** Send messages to users without revealing your identity.
- **Personal Dashboard:** Manage your profile and view received messages.
- **Message Management:** Delete unwanted messages from your inbox.
- **Accept/Reject Messages:** Control whether you want to receive anonymous messages.
- **AI Message Suggestions:** Generate conversation starters using AI.
- **Unique Profile Links:** Share your personal profile link to receive anonymous messages.
- **Responsive UI:** Clean and user-friendly interface across different screen sizes.

## 🛠️ Tech Stack

**Frontend**
- Next.js
- React.js
- TypeScript
- Tailwind CSS
- shadcn/ui

**Backend**
- Next.js API Routes
- Node.js

**Database & Authentication**
- MongoDB
- Mongoose
- NextAuth.js

**Other Tools & Libraries**
- Zod – Schema validation
- React Hook Form – Form handling
- Axios – API requests
- Resend – Email delivery
- AI SDK / OpenAI – AI-generated message suggestions

## 📂 Project Structure

```text
HiddenBox/
│
├── src/
│   ├── app/
│   │   ├── (app)/
│   │   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── (auth)/
│   │   │   ├── sign-in/
│   │   │   ├── sign-up/
│   │   │   └── verify/
│   │   ├── api/
│   │   │   ├── accept-messages/
│   │   │   ├── auth/
│   │   │   ├── check-username-unique/
│   │   │   ├── delete-messages/
│   │   │   ├── get-messages/
│   │   │   ├── send-message/
│   │   │   ├── sign-up/
│   │   │   ├── suggest-messages/
│   │   │   └── verify-code/
│   │   ├── u/
│   │   ├── globals.css
│   │   └── layout.tsx
│   │
│   ├── components/
│   ├── context/
│   ├── helpers/
│   ├── lib/
│   ├── model/
│   ├── schema/
│   └── message.json
│
├── emails/
├── public/
├── .gitignore
├── package.json
└── README.md
```

## ⚙️ Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/CHHAVI0110/HiddenBox.git
```

### 2. Navigate to the project directory

```bash
cd HiddenBox
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Create a `.env.local` file in the root directory and add the following variables:

```env
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
RESEND_API_KEY=your_resend_api_key
OPENAI_API_KEY=your_openai_api_key
```

Replace the placeholder values with your actual credentials. Configure the variables according to the services and features enabled in your project.

### 5. Run the development server

```bash
npm run dev
```

---

⭐ If you find this project interesting, consider giving it a star!
