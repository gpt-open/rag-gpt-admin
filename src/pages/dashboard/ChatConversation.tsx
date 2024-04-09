import clsx from "clsx";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

const ChatConversation = ({
  activeUser,
  conversation,
  selectConversation,
}: {
  activeUser: string;
  conversation: API.Conversation;
  selectConversation: (user_id: string) => void;
}) => {
  return (
    <li
      key={conversation.user_id}
      className={clsx(
        "relative px-4 py-5 rounded border cursor-pointer select-none hover:bg-zinc-100",
        activeUser === conversation.user_id && "bg-zinc-100"
      )}
      onClick={() => selectConversation(conversation.user_id)}
    >
      <div className="flex justify-between space-x-3">
        <p className="truncate text-sm text-zinc-500">{`Customer: ${conversation.latest_query.query}`}</p>
        <span className="shrink-0 whitespace-nowrap text-sm text-zinc-500">
          {dayjs(conversation.latest_query.ctime * 1000).fromNow()}
        </span>
      </div>
      <div className="mt-1">
        <p className="line-clamp-2 text-sm text-black">
          {`Bot: ${conversation.latest_query.answer}`}
        </p>
      </div>
    </li>
  );
};

export default ChatConversation;
