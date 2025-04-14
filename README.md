# Donald Toad Telegram Bot

An advanced AI-powered Telegram bot that specializes in cryptocurrency interactions with a unique Donald Toad character personality.

## Features

- 🤖 Character-based AI interactions in Donald Toad's distinctive style
- 📈 Real-time cryptocurrency price information
- 📊 Donald Toad Coin (DTC) statistics
- 🎮 Interactive games (guess the number, crypto trivia)
- 🔄 Self-healing with exponential backoff and error recovery
- 🖥️ Clean web interface for status monitoring

## Setup

### Prerequisites

- Node.js 16.x or higher
- A Telegram Bot Token (get one from [@BotFather](https://t.me/BotFather))

### Installation

1. Clone this repository
   ```
   git clone https://github.com/yourusername/donald-toad-telegram-bot.git
   cd donald-toad-telegram-bot
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Create a `.env` file based on `.env.example`
   ```
   cp .env.example .env
   ```

4. Add your Telegram Bot Token to the `.env` file
   ```
   TELEGRAM_BOT_TOKEN=your_bot_token_here
   ```

### Running Locally

Start the bot with:
```
npm start
```

For development with auto-restart:
```
npm run dev
```

## Deployment to Render

This bot is optimized for deployment on [Render](https://render.com):

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set the following configuration:
   - Build Command: `npm install`
   - Start Command: `npm start`
4. Add the `TELEGRAM_BOT_TOKEN` environment variable in the Render dashboard
5. Deploy the service

The bot includes a health check endpoint at `/health` that will return a 200 OK status when the bot is running.

## Bot Commands

- `/start` - Begin interaction with Donald Toad
- `/help` - Display help information
- `/features` - Show all available features
- `/stats` - Get Donald Toad Coin statistics

You can also ask about cryptocurrency prices or chat casually with the bot.

## License

This project is licensed under the MIT License - see the LICENSE file for details.