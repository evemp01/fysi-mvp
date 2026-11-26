import { PainSummary } from "@/components/pain/PainSummary";
import { Bubble, BubbleContent } from "@/components/ui/bubble";
import { Message, MessageContent, MessageFooter, MessageHeader } from "@/components/ui/message";
import type { Message as ChatMessage } from "@/data/types";
import { formatTime } from "@/lib/dates";

export function MessageBubble({ message, senderName, mine }: { message: ChatMessage; senderName: string; mine: boolean }) {
  const align = mine ? "end" : "start";
  return (
    <Message align={align}>
      <MessageContent className="gap-1">
        {!mine && <MessageHeader>{senderName}</MessageHeader>}
        <Bubble variant={mine ? "hero" : "card"} align={align}>
          <BubbleContent>
            {message.text}
            {message.media && message.media.length > 0 && (
              <div className="mt-1.5 grid gap-1.5">
                {message.media.map((m, i) =>
                  m.kind === "image" ? (
                    <img key={i} src={m.url} alt="Bifogad bild" className="max-h-75 w-full rounded-xl object-contain" />
                  ) : m.kind === "video" ? (
                    <video key={i} src={m.url} controls playsInline className="max-h-75 w-full rounded-xl bg-black" />
                  ) : null,
                )}
              </div>
            )}
            {message.pain && <PainSummary report={message.pain} />}
          </BubbleContent>
        </Bubble>
        <MessageFooter>
          <time>{formatTime(message.time)}</time>
        </MessageFooter>
      </MessageContent>
    </Message>
  );
}
