import { revalidatePath } from 'next/cache';

export async function GET() {
  revalidatePath('/');
  revalidatePath('/weeks');

  return Response.json({ success: true });
}
