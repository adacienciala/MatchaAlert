import dotenv from 'dotenv';
import express from 'express';
import cron from 'node-cron';
import PushBullet from 'pushbullet';
import { formatMatchas } from './formatMatchas.js';
import { getAvailableMatchas } from './getAvailableMatchas.js';
import { groupMatchas } from './groupMatchas.js';

// Load environment variables from .env file
dotenv.config();

// Your Pushbullet Access Token
const PUSHBULLET_ACCESS_TOKEN = process.env.PUSHBULLET_ACCESS_TOKEN || '';

if (!PUSHBULLET_ACCESS_TOKEN) {
  throw new Error('Pushbullet Access Token is not defined in .env file');
}
const pusher = new PushBullet(PUSHBULLET_ACCESS_TOKEN);

// Create an instance of Express
const app = express();
const port = process.env.PORT || 3000;

// Schedule a task to run every 30 minutes
cron.schedule('*/30 * * * *', async () => {
  try {
    const url = process.env.MARUKYU_ALL_URL ?? '';
    const availableMatchas = (await getAvailableMatchas()) ?? [];
    const groupedMatchas = groupMatchas(availableMatchas);
    if (!groupedMatchas['Principal matcha']) {
      return;
    }
    const availableMatchasString = formatMatchas(groupedMatchas);
    const message = `Matchas available [${availableMatchas.length}] (${url}):\n\n${availableMatchasString}`;
    sendPushBulletNotification('Matcha Alert', message);
  } catch (error) {
    console.error('Error in cron job:', error);
  }
});
// Function to send a Pushbullet notification
function sendPushBulletNotification(title: string, body: string) {
  pusher.note({}, title, body, (error, response) => {
    if (error) {
      console.error('Error sending notification:', error);
    } else {
      console.log('Notification sent successfully:', response);
    }
  });
}

// Define a simple route
app.get('/', (req, res) => {
  res.send('Pushbullet Notifier is running');
});

app.get('/push', (req, res) => {
  const msg = req.query.msg as string;
  if (msg) {
    sendPushBulletNotification('Notification', msg);
  }
});

app.get('/check', async (req, res) => {
  try {
    const url = process.env.MARUKYU_ALL_URL ?? '';
    const availableMatchas = (await getAvailableMatchas()) ?? [];
    const groupedMatchas = groupMatchas(availableMatchas);
    const availableMatchasString = formatMatchas(groupedMatchas);
    const message = `(${url}):\n\n${availableMatchasString}`;
    res.setHeader('Content-Type', 'text/plain');
    res.send(message);
    // sendPushBulletNotification(
    //   `Matcha Alert [${availableMatchas.length}]`,
    //   message
    // );
  } catch (error) {
    console.error('Error in cron job:', error);
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
