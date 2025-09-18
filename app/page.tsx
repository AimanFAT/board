'use client';

import { useState } from "react";

export default function Page() {
  const [topic, setTopic] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  async function generateNotes() {
    if (!topic) return;
    setLoading(true);
    setNotes("");

    try {
      // OpenAI API کال
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`, // اپنی key ڈالیں
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: `Generate short, clear study notes on: ${topic}` }],
        }),
      });

      const data = await res.json();
      setNotes(data.choices?.[0]?.message?.content || "No response.");
    } catch (err) {
      setNotes("⚠️ Error generating notes.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">📚 AI Study Notes Generator</h1>

      <input
        type="text"
        placeholder="Enter topic (e.g. Photosynthesis)"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        className="w-full max-w-md p-3 rounded-lg border border-gray-300 mb-4"
      />

      <button
        onClick={generateNotes}
        disabled={loading}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg disabled:opacity-50"
      >
        {loading ? "Generating..." : "Generate Notes"}
      </button>

      {notes && (
        <div className="mt-6 w-full max-w-2xl p-4 bg-white rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-2">Your Notes:</h2>
          <p className="whitespace-pre-wrap">{notes}</p>
        </div>
      )}
    </div>
  );
}
