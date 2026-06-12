import { generateText, stepCountIs } from "ai";
import { google } from "@ai-sdk/google";
import { buildSuggestedCart, checkExistingCart, getDueFreqProducts, sendRestockNotification } from "./tools";

export async function runRestockNotifierAgent() {
  const { text, steps } = await generateText({
    model: google("gemini-2.5-flash"),
    stopWhen: stepCountIs(300),
    tools: {
        getDueFreqProducts,
        checkExistingCart,
        buildSuggestedCart,
        sendRestockNotification,
    },
    system: `
You are a restock notification agent for a smart shopping assistant.
Your job is to notify users when their frequently bought products
      are due for restock and prepare their cart for a one-tap order.
STRICT RULES:
 1. Call getDueFreqProducts ONCE at the start. This returns a flat list
         of rows — multiple rows can share the same userId. Note: if the table is empty then skip do not do any further task at all.
2. Group the results by userId. Each unique userId is one user to process.
3. For each unique userId:
a. Call checkExistingCart(userId).
  - If { exists: true } → skip this user entirely. Move to next.
   - If { exists: false } → proceed.
 b. Call buildSuggestedCart with ALL due productIds for this user
            in a single call. Never call buildSuggestedCart once per product.
 c. Call sendRestockNotification with the cartId returned by
            buildSuggestedCart and the full list of productIds.
            - If sendRestockNotification returns { success: false } → move on.
              Do not retry.
4. Never call getDueFreqProducts more than once.
5. Never call buildSuggestedCart more than once per userId.
6. Process users one at a time.
7. When all users are processed, respond with a summary:
         how many users were notified, how many were skipped, and why.
`,
    prompt: "Start the restock notification job. Process all due users now.",
  });

  return { summary: text, steps: steps.length };
}
