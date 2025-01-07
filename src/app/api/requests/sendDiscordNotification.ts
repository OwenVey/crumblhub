import ky from 'ky';

export async function sendDiscordNotification(content: string) {
  await ky.post(
    'https://discord.com/api/webhooks/1326012057979453610/rxKPdGqE2xA2WiFzt5I3wJL63kArII3OKEqRFczQ7t42S5qP3aUOePwMyexWcFi1m9YH',
    {
      json: { content },
    },
  );
}
