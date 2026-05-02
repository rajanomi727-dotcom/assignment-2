# NIXH — Premium Social Profile App

> A production-quality mobile profile application with React Native (Expo) frontend + Node.js/Express backend + MySQL database.

---

## 📁 Project Structure

```
nixh/
├── app/                          # React Native Frontend (Expo)
│   ├── assets/
│   │   └── logo.png
│   ├── src/
│   │   ├── screens/
│   │   │   └── ProfileScreen.tsx
│   │   ├── components/
│   │   │   ├── ProfileHeader.tsx
│   │   │   ├── EditableField.tsx
│   │   │   └── GlassButton.tsx
│   │   ├── constants/
│   │   │   └── colors.ts
│   │   ├── services/
│   │   │   └── api.ts
│   │   └── utils/
│   │       └── format.ts
│   ├── App.tsx
│   ├── app.json
│   ├── package.json
│   ├── tsconfig.json
│   └── babel.config.js
│
├── server/                       # Node.js + Express + MySQL Backend
│   ├── index.js
│   ├── db.js
│   ├── .env
│   └── package.json
│
├── README.md
└── .gitignore
```

---

## 🛠️ Tech Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Frontend  | React Native · Expo SDK 52 · TypeScript |
| Backend   | Node.js · Express.js                |
| Database  | MySQL (local instance)              |
| HTTP      | Axios                               |
| Animation | React Native Animated API           |
| Gradients | expo-linear-gradient                |
| Blur      | expo-blur                           |

---

## ⚙️ Prerequisites

- **Node.js** v18+ installed
- **MySQL** running locally (port 3306)
- **Expo Go** app on your phone (iOS / Android)
- **npm** or **yarn**

---

## 🗄️ Database Setup

Open your MySQL client and run:

```sql
-- 1. Create the database
CREATE DATABASE IF NOT EXISTS nixh_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE nixh_db;

-- 2. Create the users table
CREATE TABLE IF NOT EXISTS users (
  id    INT          NOT NULL AUTO_INCREMENT,
  name  VARCHAR(120) NOT NULL DEFAULT '',
  email VARCHAR(200) NOT NULL DEFAULT '',
  phone VARCHAR(30)  NOT NULL DEFAULT '',
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. (Optional) Seed a test user — the server auto-seeds on first run too
INSERT INTO users (name, email, phone)
VALUES ('Alex Rivera', 'alex.rivera@nixh.app', '+1 (555) 000-0001');
```

---

## 🚀 Running the Backend

```bash
# 1. Enter the server folder
cd nixh/server

# 2. Install dependencies
npm install

# 3. Configure environment variables
#    Edit server/.env with your MySQL credentials:
#
#    DB_HOST=localhost
#    DB_PORT=3306
#    DB_USER=root
#    DB_PASSWORD=your_mysql_password
#    DB_NAME=nixh_db
#    PORT=5000

# 4. Start the server
npm start
# → 🚀  NIXH server running on http://0.0.0.0:5000
# → ✅  MySQL connected successfully
```

### API Endpoints

| Method | Endpoint   | Description             |
|--------|------------|-------------------------|
| GET    | /profile   | Fetch the user profile  |
| PUT    | /profile   | Update the user profile |
| GET    | /health    | Server health check     |

#### Example responses

**GET /profile**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Alex Rivera",
    "email": "alex.rivera@nixh.app",
    "phone": "+1 (555) 000-0001"
  }
}
```

**PUT /profile** (body)
```json
{
  "name": "Jordan Lee",
  "email": "jordan@nixh.app",
  "phone": "+1 (555) 999-8888"
}
```

---

## 📱 Running the Frontend

### Step 1 — Find your machine's local IP

```bash
# macOS / Linux
ifconfig | grep "inet "

# Windows
ipconfig
# Look for "IPv4 Address" → e.g. 192.168.1.42
```

### Step 2 — Update the API base URL

Open `nixh/app/src/services/api.ts` and replace:

```ts
const BASE_URL = 'http://YOUR_LOCAL_IP:5000';
```

with your actual IP, for example:

```ts
const BASE_URL = 'http://192.168.1.42:5000';
```

> **Android Emulator?** Use `http://10.0.2.2:5000` instead.

### Step 3 — Install & start

```bash
cd nixh/app
npm install
npx expo start
```

Scan the QR code with **Expo Go** on your phone.  
Both the phone and your computer must be on the **same Wi-Fi network**.

---

## 🎨 Design System

| Token            | Value                          |
|------------------|--------------------------------|
| Background       | `#0A0A0A`                      |
| Card (glass)     | `rgba(255,255,255,0.04)`       |
| Accent (cyan)    | `#00F5FF`                      |
| Text Primary     | `#FFFFFF`                      |
| Text Secondary   | `#A1A1AA`                      |
| Border           | `rgba(255,255,255,0.08)`       |
| Gradient Start   | `#00F5FF`                      |
| Gradient Mid     | `#8B5CF6`                      |
| Gradient End     | `#EC4899`                      |

---

## ✅ Feature Checklist

- [x] Profile data loaded from MySQL on app start
- [x] Animated profile header with spinning gradient ring + glow halo
- [x] Stats row (Posts · Followers · Following)
- [x] Glassmorphic field cards with animated focus border
- [x] Edit Profile mode — fields become live inputs
- [x] Save Changes → PUT /profile → MySQL updated → UI refreshes
- [x] Cancel Edit — reverts to original values
- [x] Pull-to-refresh
- [x] Success toast animation after save
- [x] Error shake animation + retry screen
- [x] Loading spinner (animated gradient ring)
- [x] Account Details meta card (ID · Status · Joined)
- [x] Dark mode throughout
- [x] Keyboard-aware layout (iOS padding)

---

## 🔧 Troubleshooting

| Problem | Fix |
|---------|-----|
| "Network Error" on device | Confirm phone and PC are on the same Wi-Fi. Check your IP in `api.ts`. |
| MySQL connection refused | Verify `.env` credentials and that MySQL is running on port 3306. |
| Expo QR not scanning | Run `npx expo start --tunnel` to use Expo's tunnel mode. |
| Table not created | The server auto-creates the `users` table on first `/profile` call. |
| Blank profile image | The logo fetches from `postimg.cc` — confirm internet access on device. |

---

## 📄 License

MIT — built with ❤️ for the NIXH project.
