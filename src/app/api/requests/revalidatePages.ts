import { revalidatePath } from 'next/cache';
import { sendDiscordNotification } from '.';

export async function revalidatePages(origin: string) {
  revalidatePath('/');
  revalidatePath('/weeks');
  revalidatePath('/testing');

  await Promise.all([fetch(origin), fetch(`${origin}/weeks`), fetch(`${origin}/testing`)]);

  void sendDiscordNotification('Revalidated routes');
}
