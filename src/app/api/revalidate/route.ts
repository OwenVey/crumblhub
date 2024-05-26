import { revalidatePath } from 'next/cache';

export async function GET() {
  revalidatePath('/');

  return Response.json({ status: 'success' });
}
