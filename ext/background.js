importScripts("config.js");

const SYSTEM =
  "You answer questions. For multiple choice, reply ONLY with the correct option letter and its text (e.g. \"B. Canberra\"), " +
  "no explanation. For other questions, give the answer first, then at most 2 short sentences of reasoning. " +
  "Answer in the same language as the question. Plain text only, no markdown.";

async function ask(text) {
  const res = await fetch("https://ollama.com/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${CONFIG.OLLAMA_API_KEY}`
    },
    body: JSON.stringify({
      model: CONFIG.MODEL,
      stream: false,
      think: "low",
      options: { temperature: 0.2, num_predict: 400 },
      messages: [
        { role: "system", content: SYSTEM },
        { role: "user", content: text }
      ]
    })
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${(await res.text()).slice(0, 200)}`);
  const data = await res.json();
  return (data.message?.content || "").trim() || "(empty response)";
}

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg?.type !== "ask") return;
  ask(msg.text)
    .then((answer) => sendResponse({ answer }))
    .catch((e) => sendResponse({ error: e.message }));
  return true;
});
