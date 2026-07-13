import client from "./client";

const APP_URL = process.env.NEXT_PUBLIC_API_URL!;

async function registerSchedules() {
  // fetching all existing schedules from QStash
  const existingSchedules = await client.schedules.list();
  const existingDestinations = existingSchedules.map(
    (schedule: any) => schedule.destination,
  );

  // defining all scheduled job endpoints
  const jobs = [
    {
      name: "freqProdSync",
      destination: `${APP_URL}api/informUser`,
      cron: "0 3 * * *",
      retries: 5,
    },
    {
      name: "insightSync",
      destination: `${APP_URL}api/insightSync`,
      cron: "0 3 * * *",
      retries: 5,
    },
    {
      name: "popularityCheck",
      destination: `${APP_URL}api/popularityCheck`,
      cron: "0 4 * * *",
      retries: 5,
    },
  ];

  // registering schedules that do not already exist
  for (const job of jobs) {
    if (existingDestinations.includes(job.destination)) {
      console.log(`[setup] ${job.name} schedule already exists — skipping`);
      continue;
    }

    const schedule = await client.schedules.create({
      destination: job.destination,
      cron: job.cron,
    });

    console.log(`[setup] ${job.name} schedule created: ${schedule.scheduleId}`);
  }

  console.log("[setup] all scheduled jobs are registered.");
}

export default registerSchedules;

// // registering schedules during application startup
// registerSchedules().catch((error) => {
//   console.error("[setup] failed to register schedules:", error);
//   process.exit(1);
// });
