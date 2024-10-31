import winston from 'winston'
import axios from 'axios'
import 'dotenv/config'

// Set up Winston logger
const logger = winston.createLogger({
    level: "info",
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.Console(),
    ],
});

// Function to send error logs to Discord
async function sendLogToDiscord(logData) {
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
    const discordMessage = `🐞 **Server Error**\n**Time:** ${logData.timestamp}\n**Level:** ${logData.level}\n**Message:** ${logData.message}\n**Stack Trace:**\n\`\`\`${logData.stack}\`\`\``;

    try {
        await axios.post(webhookUrl, {
            content: discordMessage,
        });
    } catch (err) {
        console.error("Failed to send log to Discord:", err);
    }
}

// Log error and send to Discord
export const logError = ({ message, stack }) => {
    // logger.log({
    //     level: 'error',
    //     message: message,
    //     stack: stack,
    //     timestamp: new Date().toISOString()
    // });

    sendLogToDiscord({
        message,
        stack,
        level: 'error',
        timestamp: new Date().toISOString()
    });
};
