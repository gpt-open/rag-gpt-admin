import { Separator } from "@/components/ui/separator";
import { DatePickerWithRange } from "./DateRangePicker";
import ChatConversation from "./ChatConversation";
import ChatMessage from "./ChatMessage";
import { ReviseDialog } from "./ReviseDialog";
import { useCallback, useEffect, useRef, useState } from "react";
import { getChatLogs, getConversationList } from "@/api";
import { DateRange } from "react-day-picker";
import { subDays } from "date-fns";
import axios from "axios";
import { toast } from "sonner";
import { CenterLoading } from "@/components/loading";
import InfiniteScroll from "react-infinite-scroll-component";

const ConversationPageSize = 20;
const MessagePageSize = 20;

export const Dashboard = () => {
  const [reviseDialogOpen, setReviseDialogOpen] = useState(false);
  const [timeRange, setTimeRange] = useState<DateRange>({
    from: subDays(new Date(), 1),
    to: new Date(),
  });
  const [chatLogs, setChatLogs] = useState<API.ChatLog[]>([]);
  const [conversationList, setConversationList] = useState<API.Conversation[]>(
    []
  );
  const [selectedMessage, setSelectedMessage] = useState<API.ChatLog>();
  const [pageState, setPageState] = useState({
    selectedUser: "",
    conversationPage: 1,
    messagePage: 1,
    messageInitLoading: true,
    messageMoreLoading: false,
    conversationInitLoading: true,
    conversationMoreLoading: false,
    hasMoreMessage: false,
    hasMoreConversation: false,
  });
  const cancelToken = useRef(axios.CancelToken.source());
  const initFlag = useRef(true);

  useEffect(() => {
    if (!timeRange.from || !timeRange.to) return;
    getConversationList({
      start_timestamp: Math.floor(timeRange.from.getTime() / 1000),
      end_timestamp: Math.floor(timeRange.to.getTime() / 1000),
      page: 1,
      page_size: ConversationPageSize,
    })
      .then(({ data: { conversation_list } }) => {
        const isEmpty = conversation_list.length === 0;
        setConversationList(conversation_list);
        setPageState((prev) => ({
          ...prev,
          conversationPage: 2,
          hasMoreConversation:
            conversation_list.length === ConversationPageSize,
          conversationInitLoading: false,
          messageInitLoading: initFlag.current && !isEmpty,
        }));
        if (!isEmpty && initFlag.current) {
          selectConversation(conversation_list[0].user_id);
        }
      })
      .catch(() =>
        setPageState((prev) => ({ ...prev, conversationInitLoading: false }))
      )
      .finally(() => (initFlag.current = false));
  }, [timeRange]);

  const onOpenChange = useCallback((open: boolean, message?: API.ChatLog) => {
    setSelectedMessage(message);
    setReviseDialogOpen(open);
  }, []);

  const selectConversation = async (user_id: string) => {
    if (pageState.selectedUser === user_id) return;

    if (pageState.messageInitLoading || pageState.messageMoreLoading) {
      cancelToken.current.cancel();
      cancelToken.current = axios.CancelToken.source();
    }

    setPageState((prev) => ({
      ...prev,
      selectedUser: user_id,
      messagePage: 1,
      messageInitLoading: true,
      messageMoreLoading: false,
    }));

    try {
      const {
        data: { query_list },
      } = await getChatLogs(
        {
          user_id,
          page: 1,
          page_size: MessagePageSize,
        },
        cancelToken.current.token
      );
      setChatLogs(query_list);
      setPageState((prev) => ({
        ...prev,
        messagePage: prev.messagePage + 1,
        hasMoreMessage: query_list.length === MessagePageSize,
        messageInitLoading: false,
      }));
    } catch (error) {
      if (!axios.isCancel(error)) {
        toast.error(
          (error as any).message ||
            "Failed to fetch chat logs. Please try again."
        );
        setPageState((prev) => ({ ...prev, messageInitLoading: false }));
      }
    }
  };

  const getMoreConversation = async () => {
    setPageState((prev) => ({
      ...prev,
      conversationMoreLoading: true,
    }));

    try {
      const {
        data: { conversation_list },
      } = await getConversationList({
        start_timestamp: Math.floor(timeRange.from!.getTime() / 1000),
        end_timestamp: Math.floor(timeRange.to!.getTime() / 1000),
        page: pageState.conversationPage,
        page_size: ConversationPageSize,
      });
      setConversationList((prev) => [...prev, ...conversation_list]);
      setPageState((prev) => ({
        ...prev,
        conversationPage: prev.conversationPage + 1,
        hasMoreConversation: conversation_list.length === ConversationPageSize,
        conversationMoreLoading: false,
      }));
    } catch (error) {
      toast.error(
        (error as any).message ||
          "Failed to fetch conversation list. Please try again."
      );
      setPageState((prev) => ({ ...prev, conversationMoreLoading: false }));
    }
  };

  const getMoreMessage = async () => {
    console.log("getMoreMessage");

    setPageState((prev) => ({
      ...prev,
      messageMoreLoading: true,
    }));

    try {
      const {
        data: { query_list },
      } = await getChatLogs(
        {
          user_id: pageState.selectedUser,
          page: pageState.messagePage,
          page_size: MessagePageSize,
        },
        cancelToken.current.token
      );
      setChatLogs((prev) => [...prev, ...query_list]);
      setPageState((prev) => ({
        ...prev,
        messagePage: prev.messagePage + 1,
        hasMoreMessage: query_list.length === MessagePageSize,
        messageMoreLoading: false,
      }));
    } catch (error) {
      if (!axios.isCancel(error)) {
        toast.error(
          (error as any).message ||
            "Failed to fetch chat logs. Please try again."
        );
        setPageState((prev) => ({ ...prev, messageMoreLoading: false }));
      }
    }
  };

  return (
    <div className="my-[5vh]">
      <div className="rounded border border-zinc-200">
        <div className="border-b border-zinc-200 px-5 py-4">
          <h3 className="text-xl font-semibold leading-6 text-zinc-900 ">
            Chat Logs
          </h3>
        </div>
        <div className="p-5 pb-0">
          <label className="text-md mb-2 block font-medium text-zinc-700">
            Filters
          </label>
          <DatePickerWithRange onChange={(date) => setTimeRange(date)} />
          <Separator className="my-4" />
        </div>
        <div className="flex w-full flex-row space-x-4 space-y-0 px-5">
          <ul
            className="min-w-80 max-w-xs divide-y divide-zinc-200 max-h-[38rem] overflow-y-auto"
            id="scrollable-conversation-list"
          >
            {pageState.conversationInitLoading ? (
              <CenterLoading />
            ) : (
              <InfiniteScroll
                dataLength={conversationList.length}
                next={getMoreConversation}
                hasMore={pageState.hasMoreConversation}
                loader={<div>loading</div>}
                scrollableTarget="scrollable-conversation-list"
              >
                {conversationList.map((conversation) => (
                  <ChatConversation
                    key={conversation.user_id}
                    activeUser={pageState.selectedUser}
                    conversation={conversation}
                    selectConversation={selectConversation}
                  />
                ))}
              </InfiniteScroll>
            )}
          </ul>

          <div className="flex grow items-center justify-center overflow-hidden">
            <div className="w-full">
              <div className="my-2 text-sm font-bold">Source: site</div>
              <div
                className="mb-4 flex h-[38rem] w-full flex-col overflow-auto rounded border border-zinc-200 p-2"
                id="scrollable-message-list"
              >
                {pageState.messageInitLoading ? (
                  <CenterLoading />
                ) : (
                  <InfiniteScroll
                    dataLength={chatLogs.length}
                    next={getMoreMessage}
                    hasMore={pageState.hasMoreMessage}
                    loader={<div>loading</div>}
                    scrollableTarget="scrollable-message-list"
                  >
                    {chatLogs.map((message) => (
                      <div key={message.id}>
                        <ChatMessage
                          message={message}
                          onOpenChange={onOpenChange}
                        />
                        <ChatMessage
                          message={message}
                          isBot
                          onOpenChange={onOpenChange}
                        />
                      </div>
                    ))}
                  </InfiniteScroll>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <ReviseDialog
        open={reviseDialogOpen}
        selectedMessage={selectedMessage}
        onOpenChange={onOpenChange}
      />
    </div>
  );
};
