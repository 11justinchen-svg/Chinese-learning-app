export const LOCAL_DATA_CHANGED_EVENT = "mozhi:local-data-changed";
export const LOCAL_DATA_REFRESHED_EVENT = "mozhi:local-data-refreshed";
export const LOCAL_DATA_UPDATED_AT_KEY = "mozhi.learning.updated-at.v1";

export function markLocalLearningDataChanged() {
  if (typeof window === "undefined") return;
  localStorage.setItem(LOCAL_DATA_UPDATED_AT_KEY, String(Date.now()));
  window.dispatchEvent(new Event(LOCAL_DATA_CHANGED_EVENT));
}
