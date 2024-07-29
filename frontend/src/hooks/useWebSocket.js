import { useState, useEffect, useRef } from 'react';

function useWebSocket(url, onMessage) {
  const [wsConnected, setWsConnected] = useState(false);
  const wsRef = useRef(null);

  useEffect(() => {
    wsRef.current = new WebSocket(url);

    wsRef.current.onopen = () => {
      console.log("WebSocket connection opened successfully");
      setWsConnected(true);
    };

    wsRef.current.onmessage = (event) => {
        console.log("Received WebSocket message:", event.data);
        let message = event.data;

       // Attempt to parse JSON; if parsing fails, treat message as plain text
       try {
        const parsedData = JSON.parse(event.data);
        message = JSON.stringify(parsedData); // Convert parsed data to string
      } catch (error) {
        // If JSON parsing fails, use the message as is
        message = String(event.data); // Ensure it's a string
      }

      onMessage(message); // Pass the message (string) to the onMessage callback
    };

    wsRef.current.onclose = (event) => {
      console.log("WebSocket connection closed", event);
      setWsConnected(false);
    };

    wsRef.current.onerror = (error) => {
      console.error("WebSocket error:", error);
      setWsConnected(false);
    };

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [url, onMessage]);

  return { wsConnected };
}

export default useWebSocket;