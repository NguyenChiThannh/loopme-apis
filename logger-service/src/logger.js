import winston from 'winston'
import axios from 'axios'
import 'dotenv/config'
import { formatDate } from './utils.js';

// Set up Winston logger
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message, status }) => {
            return JSON.stringify({
                timestamp,    // Ensure timestamp is first
                level,
                status,
                message,
            });
        })
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({
            filename: 'info.log',
            level: 'info',
        }),
    ],
});


// Function to send error logs to Discord
async function sendLogToDiscord(logData) {
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
    const formattedDate = formatDate(new Date(logData.timestamp));
    const discordMessage = `🐞 **Server Error**\n**Time:** ${formattedDate}\n**Level:** ${logData.level}\n**Message:** ${logData.message}\n**Stack Trace:**\n\`\`\`${logData.stack}\`\`\``;

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

export const logInfo = ({ message, status }) => {
    logger.info({
        timestamp: new Date().toISOString(),
        status,
        message
    });
};
