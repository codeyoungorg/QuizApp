"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

const messages = [
  "Hold on! We’re gathering your strengths and areas for improvement.",
  "Almost there! Noah is analyzing your progress to deliver personalized insights.",
  "Just a moment! Your detailed insights are being tailored to help you grow.",
];

export default function Loading() {
  const [currentMessage, setCurrentMessage] = useState(
    messages[Math.floor(Math.random() * messages.length)]
  );
  const [typedMessage, setTypedMessage] = useState("");
  const [messageIndex, setMessageIndex] = useState(
    Math.floor(Math.random() * messages.length)
  );

  useEffect(() => {
    const typeMessage = (message: string, idx: number = 0) => {
      if (idx <= message.length) {
        setTypedMessage(message.slice(0, idx));
        setTimeout(() => typeMessage(message, idx + 1), 100);
      } else {
        setTimeout(() => {
          const nextIndex = (messageIndex + 1) % messages.length;
          setMessageIndex(nextIndex);
          setTypedMessage("");
          setCurrentMessage(messages[nextIndex]);
        }, 2000);
      }
    };

    typeMessage(currentMessage);
  }, [currentMessage, messageIndex]);

  return (
    <main className="loading-container">
      <div>
        <Image
          src="/images/gifs/loading-screen-animation.gif"
          alt="loading-logo"
          height={64}
          width={64}
          className="loading-icon"
        />
      </div>
      <h2 className="loading-text">{typedMessage}</h2>
    </main>
  );
}
