import { io } from "socket.io-client";

// Shared singleton — prevents AlumniNavbar and ChatWidget from
// creating duplicate connections that disconnect each other's rooms.
const socket = io("http://localhost:5001", {
    withCredentials: true,
    autoConnect: false
});

export default socket;
