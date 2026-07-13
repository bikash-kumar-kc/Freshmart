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
    
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        message: "Failed to register schedules.",
      },
      {
        status: 500,
      },
    );
  }
}
