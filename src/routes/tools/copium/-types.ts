import { z } from "zod";

export const formSchema = z.object({
  user: z.string(),
  subreddit: z.string(),
});

export type TFormSchema = z.infer<typeof formSchema>;

export interface RedditResult {
  postTitle: string;
  user: string;
  subreddit: string;
  content?: string;
}