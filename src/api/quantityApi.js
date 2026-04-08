import axiosInstance from "./axiosInstance";

const BASE = "/api/v1/quantities";

// ─── helpers ───────────────────────────────────────────────
const buildPayload = (thisQ, thatQ, targetQ = null) => ({
  thisQuantityDTO: thisQ,
  thatQuantityDTO: thatQ,
  ...(targetQ ? { targetQuantityDTO: targetQ } : {}),
});

// ─── Core Operations ───────────────────────────────────────

export const compareApi = async (thisQ, thatQ) => {
  const { data } = await axiosInstance.post(
    `${BASE}/compare`,
    buildPayload(thisQ, thatQ)
  );
  return data;
};

export const convertApi = async (thisQ, thatQ) => {
  const { data } = await axiosInstance.post(
    `${BASE}/convert`,
    buildPayload(thisQ, thatQ)
  );
  return data;
};

export const addApi = async (thisQ, thatQ) => {
  const { data } = await axiosInstance.post(
    `${BASE}/add`,
    buildPayload(thisQ, thatQ)
  );
  return data;
};

export const addWithTargetApi = async (thisQ, thatQ, targetQ) => {
  const { data } = await axiosInstance.post(
    `${BASE}/add-with-target-unit`,
    buildPayload(thisQ, thatQ, targetQ)
  );
  return data;
};

export const subtractApi = async (thisQ, thatQ) => {
  const { data } = await axiosInstance.post(
    `${BASE}/subtract`,
    buildPayload(thisQ, thatQ)
  );
  return data;
};

export const subtractWithTargetApi = async (thisQ, thatQ, targetQ) => {
  const { data } = await axiosInstance.post(
    `${BASE}/subtract-with-target-unit`,
    buildPayload(thisQ, thatQ, targetQ)
  );
  return data;
};

export const divideApi = async (thisQ, thatQ) => {
  const { data } = await axiosInstance.post(
    `${BASE}/divide`,
    buildPayload(thisQ, thatQ)
  );
  return data;
};

// ─── History ───────────────────────────────────────────────

export const getOperationHistoryApi = async (operation) => {
  const { data } = await axiosInstance.get(
    `${BASE}/history/operation/${operation}`
  );
  return data;
};

export const getHistoryByTypeApi = async (type) => {
  const { data } = await axiosInstance.get(`${BASE}/history/type/${type}`);
  return data;
};

export const getOperationCountApi = async (operation) => {
  const { data } = await axiosInstance.get(`${BASE}/count/${operation}`);
  return data;
};

export const getErroredHistoryApi = async () => {
  const { data } = await axiosInstance.get(`${BASE}/history/errored`);
  return data;
};