# Chatty AR - Location-Based Messaging Web App with Augmented Reality

## 📌 Overview

Chatty AR is a location-based instant messaging web application with augmented reality features. It was designed to explore how contextual messaging, location selection, and AR-based reminders can improve communication experiences for university users.

The project combines real-time text messaging, contact discovery, profile management, map-based location sharing, and an AR component into a full-stack research prototype built with React, Express, Socket.IO, and MongoDB.

This project was built as part of my **M.E Research in Software Engineering** under the supervision of **Dr. Rabeea Jaffari** ([@rubeea](https://github.com/rubeea)).

## 📦 npm Framework

This project is also available as a starter framework on npm by the name **LocARmessaging**.

Developers can use it as a template to build their own instant messaging applications with augmented reality and location-based messaging features.

[View LocARmessaging on npm](https://www.npmjs.com/package/locarmessaging)

## 🚀 Features

- **User Authentication**: Login and signup system for secure access.
- **Real-Time Messaging**: Instant one-to-one chat powered by Socket.IO.
- **Contact Search**: Search users and start direct conversations.
- **Location-Based Messages**: Attach selected map locations to messages.
- **Augmented Reality Component**: AR-based location visualization for contextual interaction.
- **Profile Management**: Update profile details and profile images.
- **Message History**: Retrieve previous conversations between users.
- **Map-Based Location Selection**: Select coordinates through an interactive Mapbox interface.
- **Research Prototype**: Developed to support usability study work around location-based messaging with AR.

## 🛠 Tech Stack

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-000000.svg?style=for-the-badge&logo=shadcnui&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io&badgeColor=010101)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![Mapbox](https://img.shields.io/badge/Mapbox-000000.svg?style=for-the-badge&logo=mapbox&logoColor=white)
![NPM](https://img.shields.io/badge/NPM-%23CB3837.svg?style=for-the-badge&logo=npm&logoColor=white)

- **Frontend**: Vite + React
- **UI Library**: ShadCN UI + Tailwind CSS
- **Backend**: Node.js + Express.js
- **Database**: MongoDB Atlas via Mongoose
- **Authentication**: JWT stored in cookies
- **Real-Time Communication**: Socket.IO
- **Location Services**: Mapbox
- **Architecture**: MVC-style backend with React client views

## 📸 Screenshots

### Authentication

![Login Screen](docs/screenshots/login.png)

<p align="center">
  <img src="docs/screenshots/login2.png" alt="Responsive Login Screen" width="360" />
</p>

### Messaging

<p align="center">
  <img src="docs/screenshots/Text-Message-Screen.png" alt="Text Message Screen" width="320" />
</p>

### Location Selection

<p align="center">
  <img src="docs/screenshots/Location-Selection-Screen.png" alt="Location Selection Screen" width="320" />
</p>

### Augmented Reality Component

<p align="center">
  <img src="docs/screenshots/AR-Component-Screen.png" alt="AR Component Screen" width="320" />
</p>

## 🔧 Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/umardar8/chatty
   cd chatty
   ```

2. Install client dependencies:

   ```bash
   cd client
   npm install
   ```

3. Install server dependencies:

   ```bash
   cd ../server
   npm install
   ```

4. Create a `.env` file inside the `server` directory.

5. Run the backend server:

   ```bash
   npm run dev
   ```

6. Run the frontend client:

   ```bash
   cd ../client
   npm run dev
   ```

The client runs at `http://localhost:5173` and the server runs at `http://localhost:8747`.

## Environment Variables

Create a `.env` file in the `server` directory and add:

```env
DATABASE_URL=mongodb+srv://your_username:your_password@your_cluster.mongodb.net/database_name
PORT=8747
```

## 🔑 User Authentication

- **Sign Up** to create a new account.
- **Login** to access the messaging interface.
- **JWT Cookie Authentication** is used to keep users authenticated.
- **Profile Setup** allows users to add name, color, and profile image details.

## 🧪 Research Context

Chatty AR was developed to support research into the usability of location-based messaging enhanced with augmented reality. The system explores how users can send messages tied to a physical or geographic context and how AR visualization can support reminder-like messaging experiences.

## 🏆 Achievements

- Winner of the Research Poster Competition organized by **Rachna College of Engineering & Technology (UET RCET Gujranwala)** in affiliation with **Lahore UET**.
- Recognized for research work on location-based messaging and augmented reality interaction.
- Developed as a research-backed software engineering project for M.E Software Engineering.

![Research Poster Competition Win](docs/screenshots/Research-Poster-Competition-Win.png)

## 📚 Published Research

**Usability Study and Development of Location-Based Messaging with Augmented Reality**  
[Read the paper on IEEE Xplore](https://ieeexplore.ieee.org/document/11498935)

## 🤝 Acknowledgments

Specially thanking [@rubeea](https://github.com/rubeea) for their guidance, project design, supervision, and continuous mentorship during this release.

Co-authored-by: Dr. Rabeea Jaffari <rubeeajaff@gmail.com>

## 🎯 Support

If this project helps your research or development work, consider supporting it by sharing feedback, opening issues, or contributing improvements.
