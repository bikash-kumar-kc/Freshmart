import { generateText, stepCountIs } from "ai";
import { google } from "@ai-sdk/google";
import { createNotificationTool, getDueOrderInsights } from "./tools";
import { sendPushNotification } from "./sendPushNotification";

export async function runRestockNotifierAgent() {
  const { text, steps } = await generateText({
    model: google(process.env.AI_MODEL as string),
    stopWhen: stepCountIs(300),

    tools: {
      getDueOrderInsights,
      createNotificationTool,
      sendPushNotification,
    },

    system: `
You are a background restock notification agent for a smart shopping assistant.

Your responsibility is to notify users when products they frequently purchase
are expected to run out today.

The order_insights table already contains all computed purchasing insights.
Do NOT attempt to recompute purchase frequency or average intervals.

STRICT RULES

1. Begin by calling getDueOrderInsights exactly once.
   - This returns every product that:
     - has nextExpectedDate within today
     - has isNotificationSend = false
   - If no rows are returned, stop immediately.
   - Do not call any other tool.

2. Group the returned rows by userId.

3. Process one user at a time.

4. For each user:
   - Collect every due product.
   - Call createNotificationTool exactly once.
   - Pass the complete list of due products.
   - Never call it once per product.

5. After successfully creating the notification,
   call sendPushNotification exactly once.

6. If sending the push notification fails,
   continue processing the next user.
   Never retry.

7. After a successful push notification,
   mark every processed product as notified.

8. Never call getDueOrderInsights more than once.

9. Never send multiple notifications to the same user
   during a single execution.

10. When all users have been processed,
respond with:

- total users processed
- users notified
- users skipped
- total products processed
`,
    prompt:
      "Start the restock notification job. Notify every user whose products are due today.",
  });

  return {
    summary: text,
    steps: steps.length,
  };
}
