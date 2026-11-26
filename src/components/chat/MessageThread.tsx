import { MessageCircle } from "lucide-react";
import type { ReactNode } from "react";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia } from "@/components/ui/empty";
import { MessageGroup } from "@/components/ui/message";
import type { Message } from "@/data/types";
import { MessageBubble } from "./MessageBubble";

interface MessageThreadProps {
  messages: Message[];
  /** Whose messages are drawn on the right. */
  me: Message["from"];
  otherName: string;
  footer?: ReactNode;
}

export function MessageThread({ messages, me, otherName, footer }: MessageThreadProps) {
  if (!messages.length)
    return (
      <Empty className="p-5">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <MessageCircle />
          </EmptyMedia>
          <EmptyDescription>Inga meddelanden ännu.</EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  return (
    <MessageGroup className="gap-3">
      {messages.map((m, i) => (
        <MessageBubble key={i} message={m} senderName={otherName} mine={m.from === me} />
      ))}
      {footer}
    </MessageGroup>
  );
}
