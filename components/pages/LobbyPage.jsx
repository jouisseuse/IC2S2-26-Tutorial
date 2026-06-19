import React from "react";

export function LobbyPage({ connected = 0, required = 0, message = "Waiting for other participants." }) {
  return (
    <main className="experiment-page lobby-page">
      <h1>Lobby</h1>
      <p>{message}</p>
      <p>
        Connected: {connected} / {required}
      </p>
    </main>
  );
}

export default LobbyPage;
