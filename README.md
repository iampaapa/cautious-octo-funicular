# Solara, the NSMQ Preparation Desktop Application

## Overview

This desktop application is designed to enhance the preparation process for the National Science and Maths Quiz (NSMQ). It provides structured practice sessions, adaptive quizzes, multiplayer modes, detailed performance tracking, and real-time feedback. The application runs locally on your laptop, ensuring full functionality without the need for an internet connection after the initial setup.

## Features

- **Simulate Numerous Riddles**: Practice with a wide variety of riddles similar to those used in NSMQ.
- **Simulate Competition Rounds**: Experience questions from different rounds of the competition.
- **Multiplayer Modes**: Compete with peers in real-time.
- **Detailed Explanations**: Get comprehensive explanations for each answer.
- **High-Quality Voices**: Select from different African accents for an engaging learning experience.
- **Offline Functionality**: The application runs without internet access after the initial setup.
- **Adaptive Difficulty**: Quizzes adapt to the user's difficulty level.
- **Progress Tracking**: Track progress and generate reports on performance.
- **Real-Time Feedback and Hints**: Receive feedback and hints during practice.
- **Gamification**: Earn badges and rewards, and appear on leaderboards.

## Prerequisites

- **Node.js**: Ensure you have Node.js installed on your system.
- **Git**: Ensure you have Git installed for cloning the repository.

## Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/username/repository.git
   cd repository
   ```

2. **Install Dependencies**

   Navigate to the `backend` directory and install the backend dependencies:

   ```bash
   cd backend
   npm install
   ```

   Navigate back to the root directory and install the Electron app dependencies:

   ```bash
   cd ..
   npm install
   ```

3. **Initial Setup**

   - **Download Dependencies**: The application will download the phi3 model and the encrypted SQLite file containing the questions during the first run. Ensure you have a stable internet connection for this step.

## Running the Application

1. **Start the Backend Server**

   Navigate to the `backend` directory and start the server:

   ```bash
   cd backend
   node server.js
   ```

2. **Start the Electron App**

   Navigate back to the root directory and start the Electron app:

   ```bash
   cd ..
   npm start
   ```

## Usage

Once the application is running, you can start using the various features:

- **Practice Quizzes**: Select practice sessions based on different rounds of the NSMQ.
- **Multiplayer Mode**: Challenge peers in real-time competitions.
- **Track Progress**: View detailed performance reports and analytics.
- **Customize Settings**: Choose voice preferences and adjust difficulty levels.

## Development

### Project Structure

- **`/backend`**: Contains the Node.js backend server and SQLite database.
- **`/src`**: Contains the React components and Electron configuration.

### Available Scripts

- **`npm start`**: Starts the Electron app.
- **`npm run build`**: Builds the Electron app for production.
- **`npm test`**: Runs the test suite.

### Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -m 'Add your feature'`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a Pull Request.

### License

This project is licensed under the Apache 2.0 License. See the [LICENSE.md](LICENSE) file for details.

## Contact

For any inquiries or support, please contact [officialpaapa@gmail.com](mailto:officialpaapa@gmail.com).

### Links

- **Demo Video**: [Demo Video](https://www.youtube.com/linktovideo)

---

Thank you for using Solara! We hope it significantly enhances your preparation experience and leads to great success in the competition.
