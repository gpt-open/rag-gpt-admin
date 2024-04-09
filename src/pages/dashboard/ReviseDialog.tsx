import { addInterveneRecord } from "@/api";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import MarkdownPreview from "@uiw/react-markdown-preview";
import { useState } from "react";
import { toast } from "sonner";

interface IReviseDialogProps {
  open: boolean;
  selectedMessage?: API.ChatLog;
  onOpenChange: (open: boolean) => void;
}

export function ReviseDialog({
  open,
  selectedMessage,
  onOpenChange,
}: IReviseDialogProps) {
  const [expectedResponse, setExpectedResponse] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const internalOpenChange = (visible: boolean) => {
    if (!visible) {
      setExpectedResponse("");
    }
    onOpenChange(visible);
  };

  const submitUpdate = async () => {
    setLoading(true);
    try {
      await addInterveneRecord({
        query: selectedMessage!.query,
        intervene_answer: expectedResponse,
      });
      toast.success("Answer updated successfully.");
      internalOpenChange(false);
    } catch (error) {
      toast.error("Failed to update answer.");
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={internalOpenChange}>
      <DialogContent
        className="sm:max-w-[520px]"
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Revise answer</DialogTitle>
        </DialogHeader>

        <div className="my-2 mb-4">
          <div className="text-sm text-zinc-700">User message</div>
          <p className="max-h-[15rem] w-full min-w-0 appearance-none overflow-auto rounded-md border border-zinc-900/10 bg-white p-3 text-zinc-900  shadow-md shadow-zinc-800/5 placeholder:text-zinc-400 focus:border-violet-500 focus:outline-none focus:ring-4 focus:ring-violet-500/10 sm:text-sm">
            {selectedMessage?.query}
          </p>
        </div>

        <div className="mb-4 overflow-hidden">
          <div className="text-sm text-zinc-700">Bot response</div>
          <div className="max-h-[15rem] w-full min-w-0 appearance-none overflow-auto rounded-md border border-zinc-900/10 bg-white p-3 text-zinc-900  shadow-md shadow-zinc-800/5 placeholder:text-zinc-400 focus:border-violet-500 focus:outline-none focus:ring-4 focus:ring-violet-500/10 sm:text-sm">
            <MarkdownPreview
              wrapperElement={{
                "data-color-mode": "light",
              }}
              components={{
                a: ({ children, ...props }) => (
                  <a {...props} target="_blank">
                    {children}
                  </a>
                ),
              }}
              source={selectedMessage?.answer}
            />
          </div>
        </div>

        <div className="mb-4">
          <div className="text-sm text-zinc-700">Expected response</div>
          <Textarea
            placeholder="Type expected response here."
            value={expectedResponse}
            onChange={(e) => setExpectedResponse(e.target.value)}
          />
        </div>

        <DialogFooter>
          <Button type="submit" loading={loading} onClick={submitUpdate}>
            Update Answer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
