export const customFetch = async <T>(
  url: string,
  config: RequestInit,
): Promise<T> => {
  const response = await fetch(url, config)

  if (!response.ok) {
    let message = `Erro ${response.status}`

    try {
      const data = await response.json()
      if (data?.message) message = data.message
    } catch {
      const text = await response.text()
      if (text) message = text
    }

    throw new Error(message)
  }

  if (response.status === 204) {
    return {} as T
  }

  return (await response.json()) as T
}
