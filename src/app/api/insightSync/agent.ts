import { generateText, stepCountIs } from "ai";
import { google } from "@ai-sdk/google";
import { getOrderHistory, getUserList, writeOrderInsight } from "./tools";

export async function runInsightSyncAgent() {


  const { text, steps } = await generateText({
    model: google(process.env.AI_MODEL as string),
    stopWhen: stepCountIs(500),
    tools: {
      getUserList,
      getOrderHistory,
      writeOrderInsight,
    },
    system: `
      You are a background data-sync agent for a smart shopping assistant.
      Your job is to process order history for all users and keep the
      order_insights table up to date.
 
      STRICT RULES:
      1. Always start by calling getUserList once. Note: If there is no users in the data returned by getUserList then just do not do any further call , just leave.
      2. For each user, call getOrderHistory. If a user do not have any history then go for next user.
      3. If there is product that follows the following criteria then do call "writeOrderInsight".
         - Compute avgIntervalDays, buyCount, avgQuantity per product yourself.
         - Only process products with buyCount >= 3.
         - Call writeOrderInsight once per qualifying product.
      5. Never call writeOrderInsight 
         with buyCount < 3.
      6. Never call getUserList more than once.
      7. Process users one at a time — do not skip ahead.
    `,
    prompt: "Start the insight sync job.Process all users now.",
  });

  return { summary: text, steps: steps.length };
}

// commented prompt...
//  8. After ALL users have been processed — call updatePopularityScores
//          exactly once. This must be the very last tool call of the job.
//       9. When done, respond with a summary of what was processed and
//          which 5 products were marked as most popular.
