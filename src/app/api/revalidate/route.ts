import { type NextRequest } from 'next/server';
import { revalidatePages } from '../requests';

export async function GET(request: NextRequest) {
  void revalidatePages(request.nextUrl.origin);

  return Response.json({ success: true });
}
