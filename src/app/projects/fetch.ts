export async function http(
    request: RequestInfo
  ): Promise<any> {
    const response = await fetch(request);
    const body = await response.json();
    console.log(body);
    return body;
  }
