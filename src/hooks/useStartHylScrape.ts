import { useMutation } from "@tanstack/react-query";

interface StartScrapePayload {
  limit: number;
}

interface StartScrapeData {
  id: number;
  description?: string;
  created_by_email: string;
  scrape_begin: Date;
  scrape_end: Date;
  created_at: Date;
  updated_at: Date;
  errors: string[]
}

/**
 * Fires the POST /api/v3/hylscraper/scrape request to initialise a scrape job.
 * Returns a jobId that can be used to subscribe to SSE progress events.
 */
export function useStartHylScrape(getToken: () => Promise<string | null>) {
  return useMutation<StartScrapeData, Error, StartScrapePayload>({
    mutationFn: async ({ limit }) => {
      const token = await getToken()
      if (!token) throw new Error("Unauthorized")
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v3/hylscraper/scrape?limit=${limit}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error(await res.text());
      const data: StartScrapeData = await res.json();
      // console.log(data)
      return data;
    },
  });
}
