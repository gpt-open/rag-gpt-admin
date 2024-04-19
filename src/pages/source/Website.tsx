import { useEffect, useState } from "react";
import SeparatorWithText from "@/components/separatorWithText";
import { Input } from "@/components/ui/input";
import { LinkTable } from "./LinkTable";
import { FilterLinksDialog } from "./FilterLinksDialog";
import { deleteCrawlData, getCrawlStateWithList, importCrawlData } from "@/api";
import { toast } from "sonner";
import { SplitListDialog } from "./SplitListDialog";

export const Website = () => {
  const [site, setSite] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [links, setLinks] = useState<API.CrawlUrlData[]>([]);
  const [selectedUrl, setSelectedUrl] = useState<API.CrawlUrlData>();
  const [openSplitListDialog, setOpenSplitListDialog] =
    useState<boolean>(false);

  useEffect(() => {
    getLinks();
  }, []);

  const getLinks = async () => {
    try {
      const {
        data: { url_list },
      } = await getCrawlStateWithList();
      setLinks(url_list);
    } catch (error) {
      toast.error((error as any).message || "Failed to get link list.");
    }
    setLoading(false);
  };

  const deleteLinks = async (ids: number[]) => {
    await deleteCrawlData(ids);
    setLinks((prev) => prev.filter((link) => !ids.includes(link.id)));
    toast.success("Deleted successfully");
  };

  const updateLinks = async (ids: number[]) => {
    await importCrawlData(ids);
    getLinks();
    toast.success("Updated successfully");
  };

  const onSplitDetailsDialogOpenChange = (
    open: boolean,
    urlData?: API.CrawlUrlData
  ) => {
    setOpenSplitListDialog(open);
    setSelectedUrl(urlData);
  };

  return (
    <div className="mt-[5vh]">
      <div className="mb-10 rounded border border-zinc-200">
        <div className="border-b border-zinc-200 px-5 py-4">
          <h3 className="text-xl font-semibold leading-6 text-zinc-900 ">
            Website
          </h3>
        </div>
        <div className="p-5">
          <div>
            <div>
              <small className="text-sm font-medium leading-none">Crawl</small>
              <div className="flex w-full items-center space-x-2 mt-2">
                <Input
                  type="url"
                  placeholder="https://www.example.com"
                  value={site}
                  onChange={(e) => setSite(e.target.value)}
                />
                <FilterLinksDialog
                  site={site}
                  onDialogClose={() => setSite("")}
                  onConfirm={getLinks}
                />
              </div>
            </div>
            <p className="mt-5 text-sm text-zinc-500 dark:text-zinc-300">
              This will crawl all the links starting with the URL (not including
              files on the website).
            </p>
            <div className="pt-8">
              {/* links */}
              <div>
                <SeparatorWithText content="Included Links" />
                <LinkTable
                  links={links}
                  loading={loading}
                  deleteLinks={deleteLinks}
                  updateLinks={updateLinks}
                  onSelectLink={(urlData) =>
                    onSplitDetailsDialogOpenChange(true, urlData)
                  }
                />
              </div>
              <SplitListDialog
                open={openSplitListDialog}
                selectedUrl={selectedUrl}
                onOpenChange={onSplitDetailsDialogOpenChange}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
