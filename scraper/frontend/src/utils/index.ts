export type CommonResponse<T> = {
  status: boolean;
  message: string;
  data: T;
};


export const backendUrl = import.meta.env.VITE_BACKEND_BASE_URL as string;
