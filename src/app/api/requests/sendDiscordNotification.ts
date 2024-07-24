import ky from 'ky';

export async function sendDiscordNotification(content: string) {
  await ky.post(
    'https://discord.com/api/webhooks/1265379162596708475/QNnQsqlD8_IgkA4-ATNxG6RAKK6WVpFoqUINENTzD8VJTUI2q-3-a5gbbdWlmP9CwAd6',
    {
      json: { content },
    },
  );
}
