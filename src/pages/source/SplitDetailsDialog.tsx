import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ISplitDetailsDialogProps {
  open: boolean;
  url?: string;
  selectedSplit?: API.CrawlSplitDetail;
  onOpenChange: (open: boolean) => void;
}

export function SplitDetailsDialog({
  open,
  url,
  selectedSplit,
  onOpenChange,
}: ISplitDetailsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-[800px]"
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>{`${url}---Page No.${selectedSplit?.index}`}</DialogTitle>
        </DialogHeader>

        <pre className="max-h-[60vh] overflow-auto text-sm">
          {selectedSplit?.content}
        </pre>
      </DialogContent>
    </Dialog>
  );
}
