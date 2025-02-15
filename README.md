# SwiftCode

SwiftCode is an innovative, real-time chat and workspace app designed to help you build, collaborate, and code—all while enjoying stunning, extreme animations and a smooth user experience. With integrated Google authentication, dynamic workspaces, and real-time updates powered by Convex, SwiftCode makes coding and collaboration fun, engaging, and visually captivating.

## Table of Contents

- [SwiftCode](#swiftcode)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Demo](#demo)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Technologies Used](#technologies-used)
  - [Contributing](#contributing)
  - [License](#license)

## Features

- **Real-Time Collaboration:**  
  Build and update workspaces instantly with real-time data subscriptions.
- **Dynamic Chat Interface:**  
  Enjoy an interactive chat experience with extreme animations, powered by Framer Motion.
- **Stunning UI/UX:**  
  Experience dramatic entry and exit animations, subtle hover effects, and an overall cinematic interface.
- **Google Authentication:**  
  Securely sign in using Google OAuth, integrated with Convex backend for seamless user management.
- **Modular Components:**  
  Clean, reusable React components for Chat, Code view, Workspace history, and Sign-In Dialog.
- **Responsive Design:**  
  Fully responsive UI with Tailwind CSS ensuring optimal experience on any device.

## Demo

![SwiftCode Demo](./demo/screenshot.png)

*Check out the live demo [here](https://swiftcode.vercel.app) (if available).*

## Getting Started

To get started with SwiftCode, clone the repository and install the dependencies. Ensure you have Node.js and npm installed on your machine.

### Prerequisites

- Node.js (v14 or above)
- npm or yarn
- Convex account & configuration (see [Convex docs](https://docs.convex.dev/))
- Google OAuth credentials for authentication

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/two/swiftcode.git
   cd swiftcode
   ```

2. **Install dependencies:**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables:**

   Create a `.env.local` file in the root directory and add the required environment variables. For example:

   ```env
   NEXT_PUBLIC_CONVEX_URL=your_convex_url
   GOOGLE_CLIENT_ID=your_google_client_id
   ```

4. **Run the development server:**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Access the app:**

   Open [http://localhost:3000](http://localhost:3000) in your browser to see SwiftCode in action.

## Usage

- **Sign In:**  
  Click on the "Sign In with Google" button in the sign-in dialog to authenticate. The sign-in dialog features extreme entry/exit animations and a dynamic main heading ("SwiftCode") in a striking green hue.

- **Chat & Code Workspace:**  
  After signing in, you'll be directed to your workspace. Use the chat interface to interact with the AI or collaborators, and view your code updates in real-time.

- **Workspace History:**  
  Quickly navigate through your recent workspaces using the Workspace History component, which lists previous sessions with dramatic, staggered animations.

## Technologies Used

- **Next.js:**  
  A powerful React framework for server-side rendering and static site generation.
- **React:**  
  A JavaScript library for building user interfaces.
- **Tailwind CSS:**  
  A utility-first CSS framework for rapid UI development.
- **Framer Motion:**  
  An animation library that brings life to UI elements with stunning, extreme animations.
- **Convex:**  
  Real-time backend as a service for managing live data and state.
- **Google OAuth:**  
  Secure user authentication via Google.
- **Lucide React:**  
  Beautiful, customizable icons for your app.
- **Axios:**  
  Promise-based HTTP client for interacting with external APIs.

## Contributing

Contributions are welcome! If you have suggestions or find issues, please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -am 'Add new feature'`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a pull request.

Please ensure your code adheres to the existing style and write tests for new features if possible.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

Enjoy building with SwiftCode and feel free to reach out if you have any questions or feedback!

---
