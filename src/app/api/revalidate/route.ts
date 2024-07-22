import { revalidatePath } from 'next/cache';

export async function GET() {
  revalidatePath('/');
  revalidatePath('/weeks');
  revalidatePath('/testing');

  return Response.json({ success: true });
}
