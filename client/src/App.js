import { useEffect, useMemo, useState } from "react";
import "./app.css";
import io from "socket.io-client";
import Chat from "./Chat";
import { useForm } from "react-hook-form";

const socket = io.connect("http://localhost:8000");
function App() {
  const [showChat, setShowChat] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    socket.emit("join_room", data);
    setShowChat(true);
  };

  return (
    <div className="App">
      {!showChat ? (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="joinChatContainer">
            <h3>Join Chat App</h3>
            <div
              style={{
                color: "#8B0000",
                backgroundColor: "rgba(255, 0, 0, 0.1)",
                textAlign: "left",
                padding: 0,
                paddingLeft: "10px",
              }}
            >
              {errors?.username?.type === "required" && (
                <p>Username is required</p>
              )}
              {errors?.username?.type === "minLength" && (
                <p>Username must be at least 4 characters</p>
              )}
              {errors?.username?.type === "maxLength" && (
                <p>Username cannot exceed 10 characters</p>
              )}
              {errors?.username?.type === "pattern" && (
                <p>Username must be alphabetical characters only</p>
              )}
              {errors?.roomId?.type === "required" && (
                <p>Room ID is required</p>
              )}
              {errors?.roomId?.type === "minLength" && (
                <p>Room ID must be at least 3 characters</p>
              )}
              {errors?.roomId?.type === "maxLength" && (
                <p>Room ID cannot exceed 6 characters</p>
              )}
            </div>

            <input
              placeholder="Username"
              {...register("username", {
                required: true,
                minLength: 4,
                maxLength: 20,
                pattern: /^[A-Za-z]+$/i,
              })}
            />
            <input
              placeholder="Room ID"
              {...register("roomId", {
                required: true,
                minLength: 3,
                maxLength: 6,
              })}
            />
            <button type="submit">Join A Room</button>
          </div>
        </form>
      ) : (
        <Chat
          socket={socket}
          room={watch("roomId")}
          username={watch("username")}
        />
      )}
    </div>
  );
}

export default App;
