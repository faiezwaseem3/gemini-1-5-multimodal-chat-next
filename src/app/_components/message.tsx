/* eslint-disable @next/next/no-img-element */
import { cn } from "@/lib/utils";
import { Message } from "ai/react";
import { Bot, Code, User } from 'lucide-react';
import { MarkdownViewer } from "./markdown-viewer/MarkdownViewer";
import { MessageData } from "@/types";
import { TypingBubble } from "./TypingBubble";
import React from "react";

interface ChatListProps {
  messages: Message[];
  typing: boolean;
}

export function ChatList({ messages, typing }: ChatListProps) {
  if (!messages.length) {
    return null;
  }

  return (
    <div className="relative mx-auto sm:max-w-2xl lg:max-w-4xl px-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className="py-6 border-b border-zinc-700/80 whitespace-pre-line"
        >
          <MessageBubble
            icon={getMessageIcon(message.role)}
            iconClassName={getMessageIconClassName(message.role)}
          >
            <MessageContent message={message} />
          </MessageBubble>
        </div>
      ))}
      {typing && <TypingBubble />}
    </div>
  );
}

interface MessageContentProps {
  message: Message;
}

const MessageContent: React.FC<MessageContentProps> = React.memo(
  function MessageContent({ message }) {
    const { content, data } = message;
    const { image, audio } = (data as MessageData) || {};

    return (
      <div className="space-y-2">
        <MarkdownViewer text={content} />
        {image && (
          <img
            src={`data:image/jpeg;base64,${image}`}
            alt="User upload"
            className="max-w-full h-auto rounded-lg"
          />
        )}
        {audio && (
          <audio controls className="w-full">
            <source src={`data:audio/mp3;base64,${audio}`} type="audio/mp3" />
            Your browser does not support the audio element.
          </audio>
        )}
      </div>
    );
  }
);

interface MessageBubbleProps {
  icon: React.ReactNode;
  iconClassName?: string;
  children: React.ReactNode;
}

const MessageBubble: React.FC<MessageBubbleProps> = React.memo(
  function MessageBubble({ icon, iconClassName, children }) {
    return (
      <div className="group relative flex items-start md:-ml-12">
        <div
          className={cn(
            "flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border shadow-sm bg-zinc-800 border-zinc-700",
            iconClassName
          )}
        >
          {icon}
        </div>
        <div className="ml-4 flex-1 space-y-2 overflow-hidden px-1">
          {children}
        </div>
      </div>
    );
  }
);

function getMessageIcon(role: string) {
  switch (role) {
    case "user":
      return <User className="text-zinc-300" />;
    case "assistant":
      return <Bot className="text-zinc-300" />;
    case "system":
      return <Code className="text-zinc-300" />;
    default:
      return null;
  }
}

function getMessageIconClassName(role: string) {
  return role === "assistant" || role === "system"
    ? "bg-zinc-700 text-zinc-300 border-zinc-600"
    : "bg-zinc-800 text-zinc-300 border-zinc-700";
}

