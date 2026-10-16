import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth/auth";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();

    const isDefined = process.env.JWT_ACCESSTOKEN_SECRET;

    if (!isDefined) {
      return NextResponse.json(
        { message: "Failed to generate token" },
        { status: 400 },
      );
    }

    const token = jwt.sign(
      {
        sub: session.user.id,
        role: "user",
        vendorId: null,
        adminId: null,
      },
      process.env.JWT_ACCESSTOKEN_SECRET as string,
      { algorithm: "HS256", expiresIn: "15m" },
    );

    const endPoint =
      process.env.NEXT_ENV === "production"
        ? process.env.NEST_API_URL_PRODUCTION
        : process.env.NEST_API_URL_LOCAL;

    // console.log(token)

    const nestResponse = await fetch(`${endPoint}/display-order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const data = await nestResponse.json();
    return NextResponse.json(data, { status: nestResponse.status });
  } catch (error) {
    console.log(error);
    throw error;
  }
}
