"use client";

import { useState } from "react";

interface Message {
  from: "user" | "bot";
  text: string;
}

export default function Home() {
  const [input, setInput] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    // Add user message
    setMessages((prev) => [...prev, { from: "user", text: input }]);

    try {
      //https://ai-bot-1-wa91.onrender.com
      const res = await fetch("https://ai-bot-1-wa91.onrender.com/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();
      const reply = data.reply || "No response";

      // Add bot reply
      setMessages((prev) => [...prev, { from: "bot", text: reply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "⚠️ Error: Unable to reach server." },
      ]);
    }

    setInput("");
  };

  return (
    <div
      style={{
        maxWidth: 600,
        margin: "40px auto",
        fontFamily: "sans-serif",
      }}
    >
      <h2>GROQ AI Chatbot ⚡</h2>

      <div
        style={{
          background: "#f8f8f8",
          padding: 20,
          height: 400,
          overflowY: "auto",
          borderRadius: 10,
        }}
      >
        {messages.map((msg, i) => (
          <p
            key={i}
            style={{
              textAlign: msg.from === "user" ? "right" : "left",
              color: msg.from === "user" ? "blue" : "green",
              marginBottom: 10,
              whiteSpace: "pre-wrap",
            }}
          >
            <strong>{msg.from}:</strong> {msg.text}
          </p>
        ))}
      </div>

      <div style={{ marginTop: 20 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{
            width: "75%",
            padding: 10,
            borderRadius: 6,
          }}
          placeholder="Ask me anything..."
        />

        <button
          onClick={sendMessage}
          style={{
            padding: 10,
            marginLeft: 10,
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}
