/**
 * Donald Toad Telegram Bot - Render Deployment Version
 * 
 * This is a clean version of the Donald Toad Telegram bot
 * optimized for deployment on Render.com
 */

// Load environment variables
require('dotenv').config();

const https = require('https');

// Bot configuration from environment variables
const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const API_BASE = `https://api.telegram.org/bot${TOKEN}`;
const PORT = process.env.PORT || 3000;

// Check if token is available
if (!TOKEN) {
  console.error('ERROR: Telegram Bot Token is not set! Please set the TELEGRAM_BOT_TOKEN environment variable.');
  process.exit(1);
}

// Log messages with timestamp
function log(message, isError = false) {
  const timestamp = new Date().toISOString();
  const formattedMessage = `[${timestamp}] ${message}`;
  
  console[isError ? 'error' : 'log'](formattedMessage);
}

// Make HTTPS requests to the Telegram API
function makeRequest(method, params = {}) {
  return new Promise((resolve, reject) => {
    const url = `${API_BASE}/${method}`;
    
    // Convert params to query string for GET requests
    const queryString = Object.keys(params).length > 0 
      ? '?' + Object.entries(params)
          .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
          .join('&')
      : '';
    
    const fullUrl = url + queryString;
    
    https.get(fullUrl, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsedData = JSON.parse(data);
          if (parsedData.ok) {
            resolve(parsedData.result);
          } else {
            reject(new Error(`API error: ${parsedData.description}`));
          }
        } catch (error) {
          reject(new Error(`Failed to parse response: ${error.message}`));
        }
      });
    }).on('error', (error) => {
      reject(new Error(`Request failed: ${error.message}`));
    });
  });
}

// Send a message to a chat
async function sendMessage(chatId, text, parseMode = 'HTML') {
  try {
    const response = await makeRequest('sendMessage', {
      chat_id: chatId,
      text: text,
      parse_mode: parseMode
    });
    
    log(`[${chatId}] Sent message: ${text.substring(0, 30)}...`);
    return response;
  } catch (error) {
    log(`Failed to send message to ${chatId}: ${error.message}`, true);
    throw error;
  }
}

// Send typing action to show the bot is processing the message
async function sendChatAction(chatId, action = 'typing') {
  try {
    await makeRequest('sendChatAction', {
      chat_id: chatId,
      action: action
    });
  } catch (error) {
    log(`Failed to send chat action to ${chatId}: ${error.message}`, true);
  }
}

// Delete any existing webhook
async function deleteWebhook() {
  try {
    const result = await makeRequest('deleteWebhook');
    log('Webhook deleted successfully');
    return result;
  } catch (error) {
    log(`Failed to delete webhook: ${error.message}`, true);
    throw error;
  }
}

// Get updates from Telegram
async function getUpdates(offset = 0) {
  try {
    return await makeRequest('getUpdates', {
      offset: offset,
      timeout: 30,
      allowed_updates: JSON.stringify(['message'])
    });
  } catch (error) {
    log(`Failed to get updates: ${error.message}`, true);
    
    // Short delay before retrying
    await new Promise(resolve => setTimeout(resolve, 5000));
    return [];
  }
}

// Process an update from Telegram
async function processUpdate(update) {
  if (!update.message || !update.message.text) {
    return;
  }

  const text = update.message.text;
  const chatId = update.message.chat.id;
  const userId = update.message.from.id;
  const firstName = update.message.from.first_name || 'friend';
  const username = update.message.from.username || '';
  
  log(`[${chatId}] Received message from ${firstName} (${username}): ${text}`);
  
  await sendChatAction(chatId, 'typing');

  // Command handling
  if (text.startsWith('/start')) {
    await sendMessage(chatId, getDefaultResponse(firstName));
    return;
  }

  if (text.startsWith('/help')) {
    await sendMessage(chatId, getHelpMessage());
    return;
  }

  if (text.startsWith('/features')) {
    await sendMessage(chatId, getFeaturesMessage());
    return;
  }
  
  if (text.startsWith('/stats') || text.toLowerCase() === 'stats') {
    await sendMessage(chatId, formatDTCPrice());
    return;
  }
  
  // Price requests
  if (isDTCPriceRequest(text)) {
    await sendMessage(chatId, formatDTCPrice());
    return;
  }
  
  if (isBitcoinPriceRequest(text)) {
    await sendMessage(chatId, formatBitcoinPrice());
    return;
  }
  
  if (isEthereumPriceRequest(text)) {
    await sendMessage(chatId, formatEthereumPrice());
    return;
  }

  // Default response for everything else
  const defaultReplies = [
    `Listen, ${firstName}, that's a great question, fantastic question. I'd say I know more about that than anybody. Many people are saying that. Believe me! 👌`,
    
    `Look, ${firstName}, I'm going to be honest with you - and I'm always honest, the most honest person you'll ever meet. That's a complicated issue, very complex. But I have a tremendous understanding of it, the best understanding.`,
    
    `${firstName}, let me tell you, I've been very successful dealing with that. So successful. You wouldn't believe how successful. It's going to be great, really great.`,
    
    `Many people, smart people, are talking about this. And they're saying, they're saying "${firstName}, Donald Toad knows more about this than anyone." That's what they're saying.`,
    
    `You know what, ${firstName}? We're going to make crypto great again! Believe me. It's going to be huge.`
  ];
  
  const randomIndex = Math.floor(Math.random() * defaultReplies.length);
  await sendMessage(chatId, defaultReplies[randomIndex]);
}

function getDefaultResponse(firstName) {
  return `Hello, ${firstName}! 👋 I'm <b>Donald Toad</b>, the BEST, most AMAZING Telegram bot you've ever seen!

I'm here to make your crypto experience great again! 🐸🚀

Type /help to see what I can do for you.`;
}

function getHelpMessage() {
  return `
<b>Donald Toad Bot Help</b>

You can control me by sending these commands:

/start - Start a conversation with me
/help - Get this help message
/features - See all my fantastic features
/stats - View current Donald Toad Coin stats

You can also ask me about:
- Bitcoin and crypto prices
- Donald Toad Coin (DTC) 
- Play games like "guess number" and "crypto trivia"

I always respond in my TREMENDOUS and VERY STABLE style! 🐸
`;
}

function getFeaturesMessage() {
  return `
<b>Donald Toad Bot Features</b>

🔸 <b>DTC Stats</b> - Type "stats" or "/stats" to see Donald Toad Coin stats
🔸 <b>Cryptocurrency prices</b> - Ask about Bitcoin, Ethereum, or DTC price
🔸 <b>Guess the number game</b> - Type "guess number game" to play
🔸 <b>Crypto trivia</b> - Type "crypto trivia" to test your knowledge
🔸 <b>General chat</b> - Chat with me about anything!
🔸 <b>And more...</b> - I'm constantly getting better, believe me!
`;
}

function formatBitcoinPrice() {
  return `
<b>Bitcoin (BTC) Price 📈</b>

Current price: $57,234.21

24h change: +2.3%
7d change: +5.7%

Many people are saying Bitcoin will reach $100,000 soon. I've been saying this for a long time, folks! Some even say it could go higher, maybe $200,000 or even $300,000. Tremendous potential!
`;
}

function isDTCPriceRequest(text) {
  const lowerText = text.toLowerCase();
  return (
    lowerText.includes('dtc') || 
    lowerText.includes('donald toad coin') || 
    lowerText.includes('toad coin') ||
    (lowerText.includes('price') && lowerText.includes('donald'))
  );
}

function isBitcoinPriceRequest(text) {
  const lowerText = text.toLowerCase();
  return (
    lowerText.includes('bitcoin') || 
    lowerText.includes('btc') || 
    (lowerText.includes('price') && 
      (lowerText.includes('btc') || lowerText.includes('bitcoin'))) ||
    lowerText.includes('how much')
  );
}

function isEthereumPriceRequest(text) {
  const lowerText = text.toLowerCase();
  return (
    lowerText.includes('ethereum') || 
    lowerText.includes('eth') || 
    (lowerText.includes('price') && 
      (lowerText.includes('eth') || lowerText.includes('ethereum')))
  );
}

function formatEthereumPrice() {
  return `
<b>Ethereum (ETH) Price 📈</b>

Current price: $3,056.89

24h change: +1.8%
7d change: +4.2%

Ethereum is doing TREMENDOUS things with this merge, a lot of people are talking about it. Smart contracts will be YUUGE! I've always supported innovation - I'm a very stable genius, you know.
`;
}

function formatDTCPrice() {
  const now = new Date();
  const formattedDate = `${now.getMonth() + 1}/${now.getDate()}/${now.getFullYear()}, ${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')} ${now.getHours() >= 12 ? 'PM' : 'AM'}`;
  
  return `📊 DONALD TOAD COIN STATS 📊

💵 Price: $0.001281 (-2.70% 24h)
💲 Market Cap: $90,231.00
👥 Holders: 5,999
🔥 Burned Tokens: 31,000,000
💰 Circulating Supply: 69,000,000
📈 Total Supply: 69,000,000

Last updated: ${formattedDate}

I personally keep track of these numbers - I have the BEST memory for numbers, everybody says so! My uncle was a professor at MIT, very good genes! I know more about this than anyone - generals call me for advice! 🐸`;
}

// Main bot loop
async function startBot() {
  try {
    log('Starting Donald Toad Bot...');
    
    // Delete any existing webhook
    await deleteWebhook();
    
    log('Bot initialized successfully! Now listening for messages...');
    
    let offset = 0;
    let consecutiveErrors = 0;
    
    // Main polling loop
    while (true) {
      try {
        const updates = await getUpdates(offset);
        
        // Reset error counter when successful
        if (updates) {
          consecutiveErrors = 0;
        }
        
        if (updates && updates.length > 0) {
          for (const update of updates) {
            try {
              await processUpdate(update);
            } catch (error) {
              log(`Error processing update: ${error.message}`, true);
            }
            offset = update.update_id + 1;
          }
        }
        
        // Small delay to prevent CPU hammering
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        log(`Error in polling loop: ${error.message}`, true);
        
        // Increment error counter
        consecutiveErrors++;
        
        // If too many consecutive errors, reset connection
        if (consecutiveErrors > 5) {
          log('Too many consecutive errors. Resetting connection...', true);
          await deleteWebhook();
          consecutiveErrors = 0;
        }
        
        // Exponential backoff for retries (1s, 2s, 4s, 8s, max 30s)
        const delay = Math.min(Math.pow(2, consecutiveErrors) * 1000, 30000);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  } catch (error) {
    log(`Fatal error: ${error.message}`, true);
    process.exit(1);
  }
}

// Create a simple health check server for Render's health checks
const http = require('http');
const server = http.createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', message: 'Donald Toad Bot is running!' }));
  } else {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Donald Toad Bot</title>
          <style>
            body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
            h1 { color: #4CAF50; }
            .container { background-color: #f5f5f5; padding: 20px; border-radius: 5px; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>🐸 Donald Toad Bot</h1>
            <p>The Donald Toad Telegram Bot is running!</p>
            <p>Talk to the bot on Telegram: <a href="https://t.me/realDonaldToad_bot">@realDonaldToad_bot</a></p>
          </div>
        </body>
      </html>
    `);
  }
});

// Error handling
process.on('uncaughtException', (error) => {
  log(`Uncaught exception: ${error.stack || error.message}`, true);
  // Continue running despite errors
});

process.on('unhandledRejection', (reason) => {
  log(`Unhandled rejection: ${reason}`, true);
  // Continue running despite errors
});

// Start the HTTP server for health checks
server.listen(PORT, () => {
  log(`Health check server running on port ${PORT}`);
});

// Start the bot
startBot();