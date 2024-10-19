"use client";
import { Card, CardContent } from "@/components/ui/card";

export default function UpcomingTopics() {
  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h2 className="text-xl font-semibold mb-4 text-[#517B7B]">
        Upcoming topics curated for you
      </h2>
      <div className="grid md:grid-cols-2 gap-6">
        {[
          { emoji: "👋", title: "Greetings", count: 140 },
          { emoji: "🔢", title: "Numbers", count: 140 },
          { emoji: "🔢", title: "Numbers", count: 140 },
          { emoji: "🔢", title: "Numbers", count: 140 },
        ].map((topic, index) => (
          <Card
            key={index}
            className="bg-[#F5F9FF] rounded-2xl p-0"
            style={{
              boxShadow: "0px 0px 8px 0px #0053F429",
            }}
          >
            <CardContent className="p-6 space-y-4">
              <h3 className="text-xl font-semibold mb-2 text-[#517B7B]">
                <span className="mr-2">{topic.emoji}</span>
                {topic.title}
              </h3>
              <p className="font-medium text-[#A3A3A3]">
                {topic.count} flash cards available
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
