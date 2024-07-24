import { revalidatePath } from 'next/cache';
import { sendDiscordNotification } from '.';

export async function revalidatePages(origin: string) {
  revalidatePath('/');
  revalidatePath('/weeks');
  revalidatePath('/testing');

  void fetch(origin);
  void fetch(`${origin}/weeks`);
  void fetch(`${origin}/testing`);

  void sendDiscordNotification('Revalidated routes');
}
