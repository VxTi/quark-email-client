"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import type { Tag } from "@/types/email";
import { fetchTags, createTagRequest } from "@/lib/requests/tags";

interface TagContextType {
  tags: Tag[];
  isLoading: boolean;
  createTag: (name: string, color?: string) => Promise<void>;
  refreshTags: () => Promise<void>;
}

const TagContext = createContext<TagContextType | undefined>(undefined);

export function TagProvider({ children }: { children: ReactNode }) {
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshTags = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchTags();
      setTags(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createTag = useCallback(
    async (name: string, color?: string) => {
      try {
        await createTagRequest(name, color);
        await refreshTags();
      } catch (error) {
        console.error(error);
      }
    },
    [refreshTags]
  );

  useEffect(() => {
    refreshTags();
  }, [refreshTags]);

  return (
    <TagContext.Provider value={{ tags, isLoading, createTag, refreshTags }}>
      {children}
    </TagContext.Provider>
  );
}

export const useTags = () => {
  const context = useContext(TagContext);
  if (!context) throw new Error("useTags must be used within TagProvider");
  return context;
};
