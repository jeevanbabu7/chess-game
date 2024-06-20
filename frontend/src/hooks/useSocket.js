import { useEffect, useState } from "react";

const WS_URL = "ws://localhost:8000";

const useSocket = () => {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const ws = new WebSocket(WS_URL);
        ws.onopen = () => {
            setSocket(ws);
        };

        ws.onclose = () => {
            setSocket(null);
        };

        // Clean up the WebSocket connection
        return () => {
            ws.close();
        };
    }, []); // Empty dependency array ensures this effect runs only once

    return socket;
};

export default useSocket;
