import registerSchedules from "@/src/qstash/registereSchedules";

export async function POST(request: Request) {
  const secret = request.headers.get("x-setup-secret");

  if (secret !== process.env.SETUP_SECRET) {
    return Response.json(
      {
        success: false,
        message: "Unauthorized",
      },
      {
        status: 401,
      },
    );
  }

  try {
    await registerSchedules();

    return Response.json({
      success: true,
      message: "QStash schedules registered successfully.",
    });
  } catch (err) {
    console.error(err);

    const error = err as { message?: string };

    return Response.json(
      {
        success: false,
        message: "Failed to register schedules.",
        reason: error?.message,
      },
      {
        status: 500,
      },
    );
  }
}
