import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LinkTable } from "./LinkTable";
import { Progress } from "@/components/ui/progress";
import { useRef, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import {
  getCrawlState,
  getCrawlStateWithList,
  importCrawlData,
  submitCrawlTask,
} from "@/api";

export function FilterLinksDialog({
  site,
  onConfirm,
  onDialogClose,
}: {
  site: string;
  onConfirm?: () => void;
  onDialogClose?: () => void;
}) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [links, setLinks] = useState<API.CrawlUrlData[]>([]);
  const [errMessage, setErrMessage] = useState<string>();
  const [loading, setLoading] = useState(false);
  let simulateTimer = useRef<NodeJS.Timeout | null>(null);
  let pollingTimer = useRef<NodeJS.Timeout | null>(null);

  const startFetch = () => {
    console.log("start fetch");
    submitCrawlTask(site)
      .then(pollingCheckCrawl)
      .catch(() =>
        setErrMessage("Failed to crawl this site, please try again later.")
      );
  };

  const simulateProgress = () => {
    setProgress(0);
    if (simulateTimer.current) clearInterval(simulateTimer.current);
    simulateTimer.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 88) {
          clearInterval(simulateTimer.current!);
          return 88;
        }
        return prev + 1;
      });
    }, 1000);
  };

  const pollingCheckCrawl = () => {
    if (pollingTimer.current) clearInterval(pollingTimer.current);
    pollingTimer.current = setInterval(() => {
      getCrawlState(site).then(({ data: { sites_info } }) => {
        if (sites_info[0].domain_status === 2) {
          clearInterval(pollingTimer.current!);
          clearInterval(simulateTimer.current!);
          getCrawlStateWithList(site).then(({ data }) => {
            setLinks(data.url_list);
            setProgress(100);
          });
        }
      });
    }, 5000);
    simulateProgress();
  };

  const onOpenChange = (open: boolean) => {
    if (!open) {
      onDialogClose?.();
      setProgress(0);
      setLinks([]);
      setErrMessage(undefined);
      if (simulateTimer.current) clearInterval(simulateTimer.current);
      if (pollingTimer.current) clearInterval(pollingTimer.current);
    }
    setDialogOpen(open);
  };

  const deleteLinks = async (ids: number[]) => {
    setLinks((prev) => prev.filter((link) => !ids.includes(link.id)));
  };

  const comfirmSubmit = async () => {
    setLoading(true);
    try {
      await importCrawlData(links.map((link) => link.id));
      onOpenChange(false);
      setTimeout(() => onConfirm?.(), 1000);
    } catch (error) {
      setErrMessage("Failed to import links, please try again later.");
    }
    setLoading(false);
  };

  const crawling = progress < 100;

  return (
    <Dialog open={dialogOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button
          className="text-xs font-normal h-8"
          onClick={startFetch}
          disabled={!site.trim()}
        >
          Fetch more links
        </Button>
      </DialogTrigger>
      <DialogContent
        className="sm:min-w-[48rem] sm:max-h-[80vh] flex flex-col"
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>
            {crawling ? "Crawling, please wait..." : "Confirm import links"}
          </DialogTitle>
        </DialogHeader>

        {errMessage ? (
          <Alert>
            <Terminal className="h-4 w-4" />
            <AlertTitle>crawl failed</AlertTitle>
            <AlertDescription>{errMessage}</AlertDescription>
          </Alert>
        ) : crawling ? (
          <div>
            <div>{`${progress}%`}</div>
            <Progress value={progress} />
          </div>
        ) : (
          <LinkTable links={links} deleteLinks={deleteLinks} />
        )}

        {!crawling && (
          <DialogFooter>
            <Button type="submit" loading={loading} onClick={comfirmSubmit}>
              Confirm
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
