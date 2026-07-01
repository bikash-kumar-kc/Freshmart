

export async function GET() {
  return Response.json(
    {
      success: true,
      data: {
        message: "Welcome to FRESH MART",
      },
    },
    {
      status: 200,
    },
  );
}
