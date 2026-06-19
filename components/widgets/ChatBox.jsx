import React, { useState } from "react";

export function ChatBox({ messages = [], onSend, disabled = false }) {
  const [draft, setDraft] = useState("");

  function send() {
    const text = draft.trim();
    if (!text) return;
    onSend?.(text);
    setDraft("");
  }

  return (
    <section className="chat-box">
      <div className="chat-messages">
        {messages.map((message, index) => (
          <p key={message.id || index}>
            <strong>{message.sender || "Participant"}:</strong> {message.text}
          </p>
        ))}
      </div>
      <textarea
        disabled={disabled}
        onChange={(event) => setDraft(event.target.value)}
        value={draft}
      />
      <button disabled={disabled || !draft.trim()} onClick={send} type="button">
        Send
      </button>
    </section>
  );
}

export default ChatBox;
