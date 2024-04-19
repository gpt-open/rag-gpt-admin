import { Input } from "@/components/ui/input";
import React from "react";
import upload from "@/assets/upload.svg";
import deleteFile from "@/assets/delete.svg";
import { Button } from "@/components/ui/button";
import SeparatorWithText from "@/components/separatorWithText";
import { v4 as uuidV4 } from "uuid";

interface FileWithUUid extends File {
  uuid: string;
}

export const Files = () => {
  const [files, setFiles] = React.useState<FileWithUUid[]>([]);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0] as FileWithUUid | undefined;
    if (!file) return;
    file.uuid = uuidV4();
    setFiles((prev) => [...prev, file]);
    console.log(file);
  };

  const deleteFile = (uuid: string) => {
    setFiles((prev) => prev.filter((file) => file.uuid !== uuid));
  };

  return (
    <div className="mt-[5vh]">
      <div className="mb-10 rounded border border-zinc-200">
        <div className="border-b border-zinc-200 px-5 py-4">
          <h3 className="text-xl font-semibold leading-6 text-zinc-900 ">
            Files
          </h3>
        </div>
        <div className="p-5">
          <div>
            <div
              className="border border-neutral-200 p-16 cursor-pointer"
              onClick={() => inputRef.current?.click()}
            >
              <Input
                ref={inputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="text/html,.pdf,.doc,.docx,.txt"
                multiple
                type="file"
                name="file"
              />
              <div className="flex flex-col items-center justify-center gap-4">
                <img width={20} src={upload} alt="upload" />
                <div className="items-center justify-center text-center">
                  <p className="text-sm text-zinc-600 ">
                    Drag &amp; drop files here, or click to select files
                  </p>
                  <span
                    className="text-xs text-zinc-500 dark:text-zinc-300"
                    id="file_type_help"
                  >
                    Supported File Types: .pdf, .doc, .docx, .txt
                  </span>
                </div>
              </div>
            </div>
            <p
              className="mt-2 text-center text-sm text-zinc-500 dark:text-zinc-300"
              id="file_input_help"
            >
              If you are uploading a PDF, make sure you can select/highlight the
              text.
            </p>
            <div className="pt-8">
              {!!files.length && (
                <div>
                  <SeparatorWithText content="Attached Files" />
                  {files.map((file) => (
                    <FileItem
                      file={file}
                      key={file.uuid}
                      deleteFile={deleteFile}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        {!!files.length && (
          <div className="flex justify-end bg-zinc-100 px-5 py-3">
            <Button size="sm">Save</Button>
          </div>
        )}
      </div>
    </div>
  );
};

const DeleteSvgButton = ({ onClick }: { onClick: () => void }) => (
  <button
    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-80 underline-offset-4 hover:underline dark:text-zinc-50 h-9 px-4 py-2 ml-1 text-red-600 transition-transform duration-500 ease-in-out hover:text-red-500"
    type="button"
    onClick={onClick}
  >
    <img width={16} src={deleteFile} alt="delete" />
  </button>
);

const FileItem = ({
  file,
  deleteFile,
}: {
  file: FileWithUUid;
  deleteFile: (uuid: string) => void;
}) => (
  <div className="mt-5 max-h-[36rem] overflow-auto pr-2">
    <div className="grid grid-cols-10 pb-4">
      <div className="col-span-9">
        <span className="break-words">{file.name}</span>{" "}
        {/* <span className="text-sm text-zinc-500">
      (2,153 chars)
    </span> */}
      </div>
      <div className="flex items-center justify-end">
        <DeleteSvgButton onClick={() => deleteFile(file.uuid)} />
      </div>
    </div>
  </div>
);
