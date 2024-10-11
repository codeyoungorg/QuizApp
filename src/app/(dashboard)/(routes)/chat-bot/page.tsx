import Home from "./_components/home";
import React from "react";
import { recentChat } from "@/app/supabase-server";
import { getCookie } from "cookies-next";
import { cookies } from "next/headers";

export default async function ChatHome() {
  const user_Id = getCookie("userId", { cookies });
  const recent_chats = await recentChat(user_Id!);
  return (
    <div className="p-5 md:px-12 w-full md:max-w-7xl mx-auto bg-[#FFF] !important">
      <Home user_Id={user_Id as string} recentChats={recent_chats} />
    </div>
  );
}
