declare namespace API {
  type ChangeAdminPwdParams = {
    account_name: string;
    current_password: string;
    new_password: string;
  };
  type GetConversationListParams = {
    start_timestamp: number;
    end_timestamp: number;
    page: number;
    page_size: number;
  };
  type GetChatLogsParams = {
    page: number;
    page_size: number;
    user_id: string;
  };
  type GetInterveneRecordsParams = {
    start_timestamp: number;
    end_timestamp: number;
    page: number;
    page_size: number;
  };
  type AddInterveneRecordParams = {
    query: string;
    intervene_answer: string;
    source?: string[];
  };

  // entity
  type BotSettings = {
    id: number;
    initial_messages: string[];
    suggested_messages: string[];
    bot_name: string;
    bot_avatar: string;
    chat_icon: string;
    placeholder: string;
    model: string;
  };
  type LatestQuery = {
    id: number;
    query: string;
    answer: string;
    source: string[];
    ctime: number;
    mtime: number;
  };
  type Conversation = {
    user_id: string;
    latest_query: LatestQuery;
  };
  type ChatLog = {
    id: number;
    user_id: string;
    query: string;
    answer: string;
    source: string[];
  };
  type InterveneRecord = {
    id: number;
    query: string;
    intervene_answer: string;
    source: string[];
  };
  type CrawlUrlData = {
    id: number;
    domain_id: number;
    url: string;
    content_length: number;
    doc_status: number;
    version: number;
    ctime: number;
    mtime: number;
  };
  // `domain_status` meanings:
  // 1 - 'Domain statistics gathering'
  // 2 - 'Domain statistics gathering collected'
  // 3 - 'Domain processing'
  // 4 - 'Domain processed'
  type CrawlSiteInfo = {
    id: number;
    domain: string;
    domain_status: number;
    version: number;
    ctime: number;
    mtime: number;
  };

  // response
  type BaseResopnse<T> = {
    retcode: number;
    message: string;
    data: T;
  };
  type GetBotSettingsData = {
    config: BotSettings;
  };
  type GetChatLogsData = {
    query_list: ChatLog[];
    total_count: number;
  };
  type GetInvterveneRecordsData = {
    intervene_list: InterveneRecord[];
    total_count: number;
  };
  type GetCrawlStateWithListData = {
    domain_status: string;
    url_list: CrawlUrlData[];
  };
}
