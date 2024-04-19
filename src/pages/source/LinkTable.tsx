import * as React from "react";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import {
  ColumnDef,
  ColumnFiltersState,
  PaginationState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DocStatus } from "@/constant/constant";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const DocStatusMap = {
  [DocStatus.Recorded]: {
    text: "Recorded",
    bgColor: "#787878",
  },
  [DocStatus.Crawling]: {
    text: "Crawling",
    bgColor: "#6cb2eb",
  },
  [DocStatus.Crawled]: {
    text: "Crawled",
    bgColor: "#17a2b8",
  },
  [DocStatus.Stored]: {
    text: "Stored",
    bgColor: "#38c172",
  },
  [DocStatus.Expired]: {
    text: "Expired",
    bgColor: "#e3342f",
  },
};

export function LinkTable({
  links,
  loading,
  updateLinks,
  deleteLinks,
  onSelectLink,
}: {
  links: API.CrawlUrlData[];
  loading?: boolean;
  updateLinks?: (id: number[]) => Promise<void>;
  deleteLinks: (id: number[]) => Promise<void>;
  onSelectLink?: (link: API.CrawlUrlData) => void;
}) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [updateLoading, setUpdateLoading] = React.useState(false);
  const [deleteLoading, setDeleteLoading] = React.useState(false);
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  const columns: ColumnDef<API.CrawlUrlData>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "url",
      header: "Url",
      cell: ({ row }) => (
        <div
          className="cursor-pointer"
          onClick={() => onSelectLink?.(row.original)}
        >
          {row.getValue("url")}
        </div>
      ),
    },
    {
      accessorKey: "content_length",
      header: () => <div className="text-right">Size</div>,
      cell: ({ row }) => {
        return (
          <div className="text-right font-medium">
            {row.getValue("content_length")}
          </div>
        );
      },
    },
    {
      accessorKey: "doc_status",
      header: () => <div className="text-right">Status</div>,
      cell: ({ row }) => {
        const statusData =
          DocStatusMap[row.getValue("doc_status") as DocStatus];
        return (
          <div className="text-right">
            <Badge
              className="text-white"
              style={{ backgroundColor: statusData.bgColor }}
              variant="outline"
            >
              {statusData.text}
            </Badge>
          </div>
        );
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const link = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <DotsHorizontalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(link.url)}
              >
                Copy link
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => deleteLinks([link.id])}>
                Delete
              </DropdownMenuItem>
              {updateLinks && (
                <DropdownMenuItem onClick={() => updateLinks([link.id])}>
                  Update
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data: links,
    columns,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    state: {
      pagination,
      columnFilters,
      rowSelection,
    },
  });

  return (
    <div className="w-full flex-1 overflow-hidden flex flex-col">
      <div className="flex items-center py-4 pl-1">
        <Input
          placeholder="Filter url..."
          value={(table.getColumn("url")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("url")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border flex flex-col overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  {loading ? "loading..." : "No results."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        {!!table.getFilteredSelectedRowModel().rows.length ? (
          <>
            <div className="flex items-center">
              {updateLinks && (
                <Button
                  size="sm"
                  variant="outline"
                  loading={updateLoading}
                  style={{ marginRight: "8px" }}
                  onClick={async () => {
                    setUpdateLoading(true);
                    await updateLinks(
                      table
                        .getFilteredSelectedRowModel()
                        .rows.map((item) => item.original.id)
                    );
                    setUpdateLoading(false);
                    table.resetRowSelection();
                  }}
                >
                  Update
                </Button>
              )}
              <Button
                size="sm"
                variant="destructive"
                loading={deleteLoading}
                onClick={async () => {
                  setDeleteLoading(true);
                  await deleteLinks(
                    table
                      .getFilteredSelectedRowModel()
                      .rows.map((item) => item.original.id)
                  );
                  setDeleteLoading(false);
                  table.resetRowSelection();
                }}
              >
                Delete
              </Button>
            </div>
            <div className="flex-1 text-sm text-muted-foreground">
              {table.getFilteredSelectedRowModel().rows.length} of{" "}
              {table.getFilteredRowModel().rows.length} row(s) selected.
            </div>
          </>
        ) : (
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredRowModel().rows.length} total
          </div>
        )}
        {table.getFilteredRowModel().rows.length > 10 && (
          <Pagination className="w-fit">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  isDisabled={!table.getCanPreviousPage()}
                  onClick={() => table.previousPage()}
                />
              </PaginationItem>
              <CustomPagination
                totalPages={table.getPageCount()}
                pageIndex={pagination.pageIndex}
                setPageIndex={(idx) => table.setPageIndex(idx)}
              />
              <PaginationItem>
                <PaginationNext
                  isDisabled={!table.getCanNextPage()}
                  onClick={() => table.nextPage()}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </div>
  );
}

function CustomPagination({
  totalPages,
  pageIndex,
  setPageIndex,
}: {
  totalPages: number;
  pageIndex: number;
  setPageIndex: (idx: number) => void;
}) {
  const pageNeighbours = 2;

  const getPageRange = (currentPage: number) => {
    const startPage = Math.max(1, currentPage - pageNeighbours);
    const endPage = Math.min(totalPages, currentPage + pageNeighbours);
    let pages = Array.from({ length: endPage - startPage + 1 }, (_, i) =>
      String(startPage + i)
    );

    if (startPage > 1) {
      pages = ["1", "ellipsisLeft", ...pages];
    }
    if (endPage < totalPages) {
      pages = [...pages, "ellipsisRight", String(totalPages)];
    }
    return pages;
  };

  const pages = getPageRange(pageIndex + 1);

  return (
    <Pagination>
      {pages.map((page) => {
        if (page === "ellipsisLeft" || page === "ellipsisRight") {
          return (
            <PaginationItem key={page}>
              <PaginationEllipsis />
            </PaginationItem>
          );
        } else {
          return (
            <PaginationItem key={page}>
              <PaginationLink
                isActive={pageIndex === Number(page) - 1}
                onClick={() => setPageIndex(Number(page) - 1)}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          );
        }
      })}
    </Pagination>
  );
}

export default CustomPagination;
