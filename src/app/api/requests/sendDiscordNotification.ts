import { env } from '@/env';
import ky from 'ky';

export async function sendDiscordNotification(content: string) {
  await ky.post(env.DISCORD_WEBHOOK_URL, {
    json: { content },
  });
}
