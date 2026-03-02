import { create } from "zustand";
import { RedditResult } from "~/routes/tools/copium/-types";

type RedditStates = {
  results: RedditResult[];
};

type RedditActions = {
  addResult: (result: RedditResult) => void;
  clearResults: () => void;
};

type RedditStore = RedditStates & RedditActions;

export const useRedditStore = create<RedditStore>()((set, get) => ({
  results: [],

  addResult: (result) =>
    set((state) => ({ results: [...state.results, result] })),
  clearResults: () => set({ results: [] }),
}));

export const useAddResult = () => useRedditStore((state) => state.addResult);
export const useClearResults = () => useRedditStore((state) => state.clearResults);
