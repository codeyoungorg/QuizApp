"use client";

import { useState } from "react";
import NoahImage from "@/assets/Images/noah_doubt_solve_dp.svg";
import Image from "next/image";

type LanguageContent = {
  [key: string]: {
    title: string;
    subtitle: string;
    lang: string;
  };
};

export default function HeadingCard({ lang }: { lang: string }) {
  const [languageContent] = useState<LanguageContent>({
    french: {
      title: "Hello let's learn",
      subtitle: "Bonjour! Apprenons le français",
      lang: "French",
    },
    spanish: {
      title: "Hola let's learn",
      subtitle: "Vamos a aprender español",
      lang: "Spanish",
    },
    hindi: {
      title: "Hello let's learn",
      subtitle: "Namaste! Hindi seekhte hai!",
      lang: "Hindi",
    },
    germen: {
      title: "Hello let's learn",
      subtitle: "Hallo! Lass uns Deutsch lernen",
      lang: "Germen",
    },
    telugu: {
      title: "Hello let's learn",
      subtitle: "Halo! Telugu nerchukondi",
      lang: "Telugu",
    },
  });
  return (
    <div className="mx-auto flex items-center gap-4 text-lg md:text-2xl lg:text-3xl font-semibold text-center my-4">
      <Image src={NoahImage} alt="Noah Image" className="w-[100px] h-[100px]" />
      <div className="space-y-2">
        <h1 className="text-[#5B8989]">
          {languageContent[lang]?.title}{" "}
          <span className="bg-gradient-to-br from-pink-500 to-yellow-500 text-transparent bg-clip-text">
            {languageContent[lang]?.lang}
          </span>
        </h1>
        <h2 className="text-[#5B8989]">{languageContent[lang]?.subtitle}</h2>
      </div>
    </div>
  );
}
