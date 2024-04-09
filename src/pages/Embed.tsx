import { Button } from "@/components/ui/button";
import { Check, Clipboard } from "lucide-react";
import { useState } from "react";

const hostname = window.location.hostname;

const iframe = `<iframe 
src="https://${hostname}/chatbot-iframe"
title="Chatbot"
style="min-width: 420px;min-height: 60vh"
frameborder="0"
></iframe>`;

const script = `<script src="https://${hostname}/embed.min.js" defer></script>`;

export const Embed = () => {
  const [copied, setCopied] = useState({
    script: false,
    iframe: false,
  });
  const copyText = (key: "script" | "iframe") => {
    navigator.clipboard.writeText(key === "script" ? script : iframe);
    setCopied((prev) => ({ ...prev, [key]: true }));
    setTimeout(() => {
      setCopied((prev) => ({ ...prev, [key]: false }));
    }, 1500);
  };
  return (
    <div className="flex flex-col items-center">
      <div className="mt-2">
        <p className="text-sm text-zinc-500">
          To add a chat bubble to the bottom right of your website add this
          script tag to your html
        </p>
      </div>
      <div className="mt-5">
        <pre className="w-fit overflow-auto rounded bg-zinc-100 p-2 text-xs">
          <code>{script}</code>
        </pre>
      </div>
      <Button
        className="mt-6"
        variant="outline"
        onClick={() => copyText("script")}
      >
        Copy Script
        {copied.script ? (
          <Check className="h-4 w-4 ml-2" />
        ) : (
          <Clipboard className="h-4 w-4 ml-2" />
        )}
      </Button>

      <div className="mt-2">
        <p className="text-sm text-zinc-500">
          To add the chatbot any where on your website, add this iframe to your
          html code
        </p>
      </div>
      <div className="mt-5">
        <pre className="w-fit overflow-auto rounded bg-zinc-100 p-2 text-xs">
          <code>{iframe}</code>
        </pre>
      </div>
      <Button
        className="mt-6"
        variant="outline"
        onClick={() => copyText("iframe")}
      >
        Copy Iframe
        {copied.iframe ? (
          <Check className="h-4 w-4 ml-2" />
        ) : (
          <Clipboard className="h-4 w-4 ml-2" />
        )}
      </Button>
    </div>
  );
};
