import { BASE_HEADERS, BASE_URL } from '@/constant';

type Method = 'POST' | 'GET' | 'PATCH' | 'DELETE';

type Option = {
  body?: BodyInit;
  header?: HeadersInit;
  jwt?: string;
};

export const fetcher = async (
  method: Method,
  subUrl: string,
  option: Option = {}
) => {
  const { body, header = BASE_HEADERS, jwt } = option;
  return fetch(BASE_URL + subUrl, {
    method: method,
    headers: {
      ...header,
      Authorization: jwt ? `Bearer ${jwt}` : '',
    },
    body: body,
  });
};
