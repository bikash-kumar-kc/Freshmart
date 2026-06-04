import {generateText, stepCountIs} from "ai";
import { google } from "@ai-sdk/google";
import z from "zod";


export async function runInsightSyncAgent(){

    const {text,steps}  = await generateText({
        model:google("gemini-2.5-flash"),
        stopWhen:stepCountIs(500),
        tools:{
            schema:{

            }
        },
        system:`
      You are a background data-sync agent for a smart shopping assistant.
      Your job is to process order history for all users and keep the
      order_insights and freq_products tables up to date.
 
      STRICT RULES:
      1. Always start by calling getUserList once.
      2. For each user, call getOrderHistory then getLastComputedAt.
      3. If getLastComputedAt returns a timestamp and NO order in the
         history has a placedAt newer than that timestamp — skip this
         user entirely. Move to the next one.
      4. If there IS new order data (or lastComputedAt is null):
         - Compute avgIntervalDays, buyCount, avgQuantity per product yourself.
         - Only process products with buyCount >= 2.
         - Call writeOrderInsight once per qualifying product.
         - Call upsertFreqProduct once per qualifying product immediately after.
      5. Never call writeOrderInsight or upsertFreqProduct for a product
         with buyCount < 2.
      6. Never call getUserList more than once.
      7. Process users one at a time — do not skip ahead.
      8. When all users are processed, respond with a summary of what was done.
    `,
    prompt:"Start the insight sync job.Process all users now."
    })

    return { summary: text, steps: steps.length };
}