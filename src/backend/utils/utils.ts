export interface ResponseData {
  success: boolean;
  data: unknown;
  statusCode: number;
  message: string;
}

export type SendResponse = (
  success: boolean,
  data: unknown,
  statusCode: number,
  message: string,
) => ResponseData;

const sendResponse: SendResponse = (
  success: boolean,
  data: unknown,
  statusCode: number,
  message: string,
) => {
  return {
    success,
    data,
    statusCode,
    message,
  };
};

export { sendResponse };
