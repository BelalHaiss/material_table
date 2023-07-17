import axios from 'axios';
import { HTTP_METHOD } from 'next/dist/server/web/http';
let token: string | null;
export type ARGS = {
  url: string;
  requestOption?: { method: HTTP_METHOD; data?: any };
};

axios.defaults.baseURL = process.env.NEXT_PUBLIC_SERVER_HOST;

// axios.defaults.baseURL = '/api';
export const fetcher = async ({ url, requestOption }: ARGS) => {
  try {
    const res = await axios({
      url,
      method: requestOption?.method,
      data: requestOption?.data,
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return res.data;
  } catch (error: any) {
    console.log({ error });
    alert(error.message);
    return null;
  }
};
