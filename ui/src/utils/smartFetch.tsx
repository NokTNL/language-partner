export default async function smartFetch<ResponseBody>(
  url: string,
  options?: RequestInit
): Promise<ResponseBody> {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`Error in smartFetch`);
  }
  // TODO: fix failed to parse JSON when status is 204
  const responseData = (await response.json().catch(() => {})) as ResponseBody;
  return responseData;
}
