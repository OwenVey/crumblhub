export async function sendDiscordNotification(message: string) {
  await fetch(
    'https://discord.com/api/webhooks/1265379162596708475/QNnQsqlD8_IgkA4-ATNxG6RAKK6WVpFoqUINENTzD8VJTUI2q-3-a5gbbdWlmP9CwAd6',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content: message }),
    },
  );
}
