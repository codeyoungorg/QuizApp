import { CoreMessage } from "ai";
import {
  createAI,
  createStreamableUI,
  createStreamableValue,
  getAIState,
  getMutableAIState,
  StreamableValue,
} from "ai/rsc";
import { StreamResponse } from "@/utils/stream-response";
import { UserMessage } from "@/app/(dashboard)/(routes)/chat-bot/_components/user-message";
import { BotMessage } from "@/app/(dashboard)/(routes)/chat-bot/_components/bot-message";
import { storeChat } from "@/utils/store-chat";
import { revalidatePath } from "next/cache";
import { nanoid } from "@/lib/utils";

async function submit(content: string, id: string) {
  "use server";

  const aiState = getMutableAIState<typeof AI>();
  const uiStream = createStreamableUI();

  const messages: CoreMessage[] = [...aiState.get()?.messages] as any[];

  if (content) {
    aiState.update({
      chatId: id ?? aiState.get().chatId,
      messages: [
        ...aiState.get().messages,
        {
          id: nanoid(),
          role: "user",
          content,
        },
      ],
    });
    messages.push({
      role: "user",
      content,
    });
  }

  const processEvents = async () => {
    const answerId = nanoid();
    const answer = await StreamResponse({ uiStream, messages, answerId });

    aiState.done({
      ...aiState.get(),
      messages: [
        ...aiState.get().messages,
        {
          id: answerId,
          role: "assistant",
          content: JSON.stringify(answer),
        },
      ],
    });
    uiStream.done();
  };

  processEvents();
  return {
    id: nanoid(),
    display: uiStream.value,
  };
}

export type AIMessage = {
  role: "function" | "user" | "assistant" | "system" | "tool" | "data";
  content: string;
  id: string;
};

export type AIState = {
  messages: AIMessage[];
  chatId: string;
};

export type UIState = {
  id: string;
  display: React.ReactNode;
}[];

export interface Chat extends Record<string, any> {
  id: string;
  title: string;
  createdAt: Date;
  userId: string;
  messages: AIMessage[];
}

export const AI = createAI<AIState, UIState>({
  actions: {
    submit,
  },
  initialUIState: [],
  initialAIState: {
    chatId: nanoid(),
    messages: [],
  } as AIState,
  onGetUIState: async () => {
    "use server";

    const aiState = getAIState();
    if (aiState) {
      const uiState = getUIStateFromAIState(aiState);
      return uiState;
    } else {
      return;
    }
  },
  onSetAIState: async ({ state, done }: { state: AIState; done: boolean }) => {
    "use server";
    if (done) {
      revalidatePath(`/chat-bot`);
    }
    await storeChat({ messages: state.messages, chat_id: state.chatId });
  },
});

export const getUIStateFromAIState = (aiState: Readonly<Chat>) => {
  return aiState.messages?.map((message) => {
    const { id, role, content } = message;
    switch (role) {
      case "user":
        return {
          id,
          display: <UserMessage message={content} />,
        };
      case "assistant":
        const answer = createStreamableValue();
        answer.done(JSON.parse(content));
        return {
          id,
          display: <BotMessage message={answer.value} messageId={id} />,
        };
      default:
        return {
          id,
          display: <div />,
        };
    }
  });
};
