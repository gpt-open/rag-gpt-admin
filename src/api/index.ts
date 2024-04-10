import createAxiosInstance from "@/utils/request";
import { CancelToken } from "axios";

const hostname = window.location.hostname;
const protocol = window.location.protocol;
const isHttps = protocol === "https:";

const guessUrl = `${protocol}//${hostname}${isHttps ? "" : ":7000"}`;

const request = createAxiosInstance(import.meta.env.VITE_BASE_URL || guessUrl);

export const adminLogin = (
  account_name: string,
  password: string
): Promise<API.BaseResopnse<{ token: string }>> =>
  request.post(`/open_kf_api/login`, {
    account_name,
    password,
  });

export const adminLogout = (account_name: string) =>
  request.post(`/open_kf_api/logout`, {
    account_name,
  });

export const changeAdminPassword = (params: API.ChangeAdminPwdParams) =>
  request.post(`/open_kf_api/update_password`, params);

export const getBotSettings = (): Promise<
  API.BaseResopnse<API.GetBotSettingsData>
> => request.post(`/open_kf_api/get_bot_setting`);

export const updateBotSettings = (params: API.BotSettings) =>
  request.post(`/open_kf_api/update_bot_setting`, params);

export const submitCrawlTask = (site: string) =>
  request.post(`/open_kf_api/submit_crawl_site`, {
    site,
    timestamp: Math.floor(Date.now() / 1000),
  });

export const getCrawlState = (
  site: string
): Promise<API.BaseResopnse<{ sites_info: API.CrawlSiteInfo[] }>> =>
  request.post(`/open_kf_api/get_crawl_site_info`, { site });

export const getCrawlStateWithList = (
  site?: string
): Promise<API.BaseResopnse<API.GetCrawlStateWithListData>> =>
  request.post(`/open_kf_api/get_crawl_url_list`, { site });

export const importCrawlData = (id_list: number[]) =>
  request.post(`/open_kf_api/add_crawl_url_list`, { id_list });

export const deleteCrawlData = (id_list: number[]) =>
  request.post(`/open_kf_api/delete_crawl_url_list`, { id_list });

export const getConversationList = (
  params: API.GetConversationListParams
): Promise<API.BaseResopnse<{ conversation_list: API.Conversation[] }>> =>
  request.post(`/open_kf_api/get_user_conversation_list`, params);

export const getChatLogs = (
  params: API.GetChatLogsParams,
  cancelToken?: CancelToken
): Promise<API.BaseResopnse<API.GetChatLogsData>> =>
  request.post(`/open_kf_api/get_user_query_history_list`, params, {
    cancelToken,
  });

export const getInterveneRecords = (params: API.GetInterveneRecordsParams) =>
  request.post(`/open_kf_api/get_intervene_record`, params);

export const addInterveneRecord = (params: API.AddInterveneRecordParams) =>
  request.post(`/open_kf_api/add_intervene_record`, params);

export const updateInterveneRecord = (params: API.AddInterveneRecordParams) =>
  request.post(`/open_kf_api/update_intervene_record`, params);

export const batchDeleteInterveneRecord = (id_list: number[]) =>
  request.post(`/open_kf_api/batch_delete_intervene_record`, { id_list });

export const uploadPicture = (
  file: File
): Promise<API.BaseResopnse<{ picture_url: string }>> => {
  const formData = new FormData();
  formData.append("picture_file", file);
  return request.post(`/open_kf_api/upload_picture`, formData);
};
