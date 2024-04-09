import { Button } from "@/components/ui/button";
import clsx from "clsx";
import { LucideCheckCircle } from "lucide-react";
import MarkdownPreview from "@uiw/react-markdown-preview";

const ChatMessage = ({
  isBot,
  message,
  onOpenChange,
}: {
  isBot?: boolean;
  message: API.ChatLog;
  onOpenChange?: (open: boolean, message?: API.ChatLog) => void;
}) => {
  return (
    <div
      className={clsx(
        "mr-8 flex justify-start",
        !isBot && "!mr-0 ml-8 justify-end"
      )}
    >
      <div
        className={clsx(
          "mb-3 overflow-auto rounded-lg px-4 py-3 bg-[#f1f1f0]",
          !isBot && "!bg-[#3b81f6]"
        )}
      >
        <div className="flex flex-col items-start gap-4  break-words">
          <div className="prose w-full break-words text-left text-inherit dark:prose-invert ">
            <div className="prose text-left text-inherit dark:prose-invert">
              <MarkdownPreview
                wrapperElement={{
                  "data-color-mode": "light",
                }}
                className={clsx(
                  isBot ? "!bg-[#f1f1f0]" : "!bg-[#3b81f6] !text-white"
                )}
                components={{
                  a: ({ children, ...props }) => (
                    <a {...props} target="_blank">
                      {children}
                    </a>
                  ),
                }}
                source={isBot ? message.answer : message.query}
              />
            </div>
          </div>
        </div>
        {isBot && (
          <div className="flex justify-end">
            <Button
              variant="ghost"
              className="text-xs font-normal h-8"
              onClick={() => onOpenChange?.(true, message)}
            >
              <LucideCheckCircle className="text-violet-600 mr-0.5 h-4 w-4 " />
              Revised
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
