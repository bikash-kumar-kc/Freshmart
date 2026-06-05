import { Client } from "@upstash/qstash";

export const client = new Client({ token: process.env.QSTASH_TOKEN! });

const APP_URL = process.env.NEXT_PUBLIC_APP_URL!;

async function setup() {
  const existing = await client.schedules.list();
  const existingUrls = existing.map((s: any) => s.destination);


  const job1Url = `${APP_URL}/api/freqProdSync`;
  const job2Url = `${APP_URL}/api/insightSync`;

  if(existingUrls.includes(job1Url)){
     console.log("[setup] insight-sync schedule already exists — skipping");
  }else{
    const job1 = await client.schedules.create({
      destination: job1Url,
      cron: "0 2 * * *",
    });
    console.log("[setup] insightSync schedule created:", job1.scheduleId);
  }


   if (existingUrls.includes(job2Url)) {
    console.log("[setup] restock-notifier schedule already exists — skipping");
  } else {
    const job2 = await client.schedules.create({
      destination: job2Url,
      cron: "0 3 * * *", // 3:00am UTC daily — always after Job 1
    });
    console.log("[setup] freqProdSync schedule created:", job2.scheduleId);
  }
 
  console.log("[setup] done. Both schedules are live on QStash.");
}


setup().catch((err) => {
  console.error("[setup] failed:", err);
  process.exit(1);
});
