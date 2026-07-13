
export type ScraperStatus = "idle" | "initializing" | "connected" | "fetching" | "done" | "error";

export interface ScrapedPost {
  url: string;
  title: string;
  author: string;
}

export interface HylNotifyPayload {
  session_id: number;
  payload_type: "post" | "comment";
  post?: {
    id: number;
    session_id: number;
    url: string;
    author: string;
    title: string;
    content: string;
  };
  comments?: Array<{
    id: number;
    session_id: number;
    post_id: number;
    url: string;
    author: string;
    content: string;
  }>;
}

