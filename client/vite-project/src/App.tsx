import { useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";

const socket: Socket = io("http://localhost:3001");

function App() {
  const [room, setRoom] = useState("");
  const [isInRoom, setIsInRoom] = useState(false);
  const [message, setMessage] = useState("");
  const [messageReceived, setMessageReceived] = useState("");

  const leaveRoom = () => {
    if (room !== "" && isInRoom) {
      socket.emit("leave_room", room);
      setIsInRoom(false);
    }
  };

  const joinRoom = () => {
    if (room !== "") {
      socket.emit("join_room", room);
      setIsInRoom(true);
    }
  };

  const sendMessage = () => {
    socket.emit("send_message", {
      message,
      room,
    });
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageReceived(data.message);
    });
  }, [socket]);

  return (
    <div className="App">
      <div>
        <input
          placeholder="room..."
          onChange={(e) => setRoom(e.target.value)}
        />
        <button onClick={joinRoom}>Join Room</button>
      </div>

      <div>
        <button disabled={room === "" || !isInRoom} onClick={leaveRoom}>
          Leave Room
        </button>
      </div>

      <div>
        <input
          placeholder="message..."
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={sendMessage}>Send Message</button>
      </div>

      <div>
        <h3>Room: </h3>
        {isInRoom && <>{room}</>}
        <h3>Message: </h3>
        {messageReceived}
      </div>
    </div>
  );
}

export default App;
