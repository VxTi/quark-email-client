"use client";

import { createContext, type ReactNode, useCallback, useContext, useEffect, useState } from "react";
import { createTagRequest, fetchTags } from "@/lib/requests/tags";
import type { Tag } from "@/types/email";

interface TagContextType {
  tags: Tag[];
  isLoading: boolean;
  createTag: (name: string, color: string) => Promise<void>;
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
    async (name: string, color: string) => {
      try {
        await createTagRequest(name, color);
        await refreshTags();
      } catch (error) {
        console.error(error);
      }
    },
    [refreshTags],
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
