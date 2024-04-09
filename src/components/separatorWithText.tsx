const SeparatorWithText = ({ content }: { content: string }) => {
  return (
    <div className="my-4 flex items-center">
      <hr className="w-full border-t border-zinc-300" />
      <span className="whitespace-nowrap px-2 text-zinc-600">{content}</span>
      <hr className="w-full border-t border-zinc-300" />
    </div>
  );
};

export default SeparatorWithText;
