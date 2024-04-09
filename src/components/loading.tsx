import LoadingSvg from "./loadingSvg";

export const CenterLoading = () => (
  <div className="w-full h-full flex items-center justify-center">
    <div className="flex flex-col items-center">
      <LoadingSvg className="fill-slate-500" />
      <span className="text-sm text-zinc-500 mt-1">loading...</span>
    </div>
  </div>
);
