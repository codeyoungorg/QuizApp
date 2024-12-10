"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

const messages = [
  "Welcome to Noah! We’re setting up your personalized learning adventure - just a moment!",
  "Almost there! Noah is crafting a unique learning path just for you.",
  "Hang tight! Noah is getting ready to guide you on your learning journey.",
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
