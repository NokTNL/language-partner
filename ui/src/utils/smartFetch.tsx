export default async function smartFetch<ResponseBody>(
  url: string,
  options?: RequestInit
): Promise<ResponseBody> {
  const response = await fetch(url, options);
  const responseJson = (await response.json()) as ResponseBody;
  if (!response.ok) {
    throw new Error(`Error in smartFetch: ${responseJson}`);
  }
  return responseJson;
}
