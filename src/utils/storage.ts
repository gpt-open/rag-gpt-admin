export const saveAccount = (userID: string) =>
  localStorage.setItem("kf_admin_account", userID);
export const getAccount = () => localStorage.getItem("kf_admin_account");

export const saveToken = (token: string) =>
  localStorage.setItem("kf_token", token);
export const getToken = () => localStorage.getItem("kf_token");
export const removeToken = () => localStorage.removeItem("kf_token");
