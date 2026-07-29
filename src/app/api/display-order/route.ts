
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/src/lib/auth/auth';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();

  const token = jwt.sign(
    {
      sub: session.user.id,
      role: 'user',
      vendorId: null,
      adminId: null,
    },
    process.env.JWT_SECRET!,
    { algorithm: 'HS256', expiresIn: '1m' },
  );

  const nestResponse = await fetch(`${process.env.NEST_API_URL}/display-order`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  const data = await nestResponse.json();
  return NextResponse.json(data, { status: nestResponse.status });
}