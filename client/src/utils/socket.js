import { io } from "socket.io-client";
import { getSocketUrl } from "./baseUrl";

// Shared singleton — prevents AlumniNavbar and ChatWidget from
// creating duplicate connections that disconnect each other's rooms.
const socket = io(getSocketUrl(), {
	transports: ["websocket"],
});

export default socket;
