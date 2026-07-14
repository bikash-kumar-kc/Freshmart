import { Client } from "@upstash/qstash";


// production...
const client = new Client({
  baseUrl: process.env.QSTASH_URL,
  token: process.env.QSTASH_TOKEN!,
});

// development...
// const client = new Client({
//   baseUrl:"http://127.0.0.1:8080",
//   token:"eyJVc2VySUQiOiJkZWZhdWx0VXNlciIsIlBhc3N3b3JkIjoiZGVmYXVsdFBhc3N3b3JkIn0="
// });

export default client;
