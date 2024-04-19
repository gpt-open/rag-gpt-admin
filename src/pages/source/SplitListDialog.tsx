import { getCrawlSplitDetails } from "@/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { SplitDetailsDialog } from "./SplitDetailsDialog";
import { CenterLoading } from "@/components/loading";

interface ISplitListDialogProps {
  open: boolean;
  selectedUrl?: API.CrawlUrlData;
  onOpenChange: (open: boolean) => void;
}

export function SplitListDialog({
  open,
  selectedUrl,
  onOpenChange,
}: ISplitListDialogProps) {
  const [splits, setSplits] = useState<API.CrawlSplitDetail[]>([]);
  const [selectedSplit, setSelectedSplit] = useState<API.CrawlSplitDetail>();
  const [openSplitDetailsDialog, setOpenSplitDetailsDialog] =
    useState<boolean>(false);

  useEffect(() => {
    if (!open) return;

    if (selectedUrl) {
      getCrawlSplitDetails(selectedUrl.id).then(
        ({ data: { sub_content_list } }) => {
          setSplits(sub_content_list);
        }
      );
    }
  }, [open]);

  const internalOpenChange = (visible: boolean) => {
    if (!visible) {
      setSplits([]);
    }
    onOpenChange(visible);
  };

  const showDetails = (split: API.CrawlSplitDetail) => {
    setSelectedSplit(split);
    setOpenSplitDetailsDialog(true);
  };

  return (
    <Dialog open={open} onOpenChange={internalOpenChange}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>{selectedUrl?.url}</DialogTitle>
        </DialogHeader>

        <div className="my-2 mb-4 flex flex-wrap gap-3 max-h-[60vh] overflow-auto">
          {splits.length ? (
            splits.map((split) => (
              <div
                className="rounded-lg border bg-card text-card-foreground shadow-sm w-[240px] p-2 text-sm hover:bg-slate-100"
                onClick={() => showDetails(split)}
              >
                <div className="flex justify-between items-center">
                  <div>{`#${split.index}`}</div>
                  <div>{`${split.content_length} character`}</div>
                </div>
                <div className="line-clamp-3">{split.content}</div>
              </div>
            ))
          ) : (
            <CenterLoading />
          )}
        </div>
      </DialogContent>
      <SplitDetailsDialog
        url={selectedUrl?.url}
        selectedSplit={selectedSplit}
        open={openSplitDetailsDialog}
        onOpenChange={(vis) => setOpenSplitDetailsDialog(vis)}
      />
    </Dialog>
  );
}
