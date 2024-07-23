import { revalidatePath } from 'next/cache';
import { sendDiscordNotification } from '../requests';

export async function GET() {
  revalidatePath('/');
  revalidatePath('/weeks');
  revalidatePath('/testing');

  void sendDiscordNotification('Revalidated routes');

  return Response.json({ success: true });
}
