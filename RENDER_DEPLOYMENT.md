# Deploying Donald Toad Bot on Render

This guide walks you through deploying the Donald Toad Telegram Bot on [Render](https://render.com).

## Prerequisites

- A [Render](https://render.com) account (free tier is sufficient)
- Your Telegram Bot Token from [BotFather](https://t.me/BotFather)
- Your GitHub repository with the Donald Toad Bot code

## Deployment Steps

### Option 1: One-Click Deploy with render.yaml

1. Fork or clone this repository to your GitHub account
2. Connect your GitHub account to Render
3. Click the "Deploy to Render" button (if available in your repository)
4. Follow the prompts, including entering your Telegram Bot Token when asked
5. Wait for the deployment to complete

### Option 2: Manual Deployment

1. Log in to your Render account
2. Click "New" and select "Web Service"
3. Connect your GitHub repository
4. Configure the web service:
   - **Name**: `donald-toad-telegram-bot` (or your preferred name)
   - **Environment**: `Node`
   - **Region**: Choose the closest to your users
   - **Branch**: `main` (or your preferred branch)
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free (or your preferred plan)

5. Add Environment Variable:
   - Click "Advanced" to expand settings
   - Add the following environment variable:
     - **Key**: `TELEGRAM_BOT_TOKEN`
     - **Value**: Your Telegram Bot Token

6. Click "Create Web Service"

## Verifying the Deployment

1. Once deployed, Render will provide a URL for your service
2. Visit `YOUR_RENDER_URL/health` in your browser
   - You should see: `{"status":"ok","message":"Donald Toad Bot is running!"}`

3. Open Telegram and message your bot
   - It should respond with Donald Toad's characteristic style

## Keeping the Bot Running

Render's free tier has some limitations:
- Free services spin down after 15 minutes of inactivity
- They have a monthly limit on running time

For production use, consider:
- Upgrading to a paid plan on Render
- Setting up a free service to ping your bot periodically (e.g., UptimeRobot)

## Troubleshooting

If your bot isn't responding:

1. Check Render logs for errors
2. Verify your TELEGRAM_BOT_TOKEN is correct
3. Make sure your bot isn't running elsewhere (which could cause conflicts)
4. Check if your Render service is actually running (not spun down)

## Further Help

If you encounter issues, check the [Render documentation](https://docs.render.com/) or the [Telegram Bot API documentation](https://core.telegram.org/bots/api).