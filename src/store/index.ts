import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface State {
  markdown: string;
  setMarkdown: (markdown: string) => void;
}

// Default markdown content with embedded media examples for testing
const defaultMarkdown = `# Welcome to the Lexical Editor

This is a sample document with markdown features.

## Images

![Sample image](https://images.unsplash.com/photo-1579546929518-9e396f3cc809)

## YouTube Videos

https://www.youtube.com/watch?v=dQw4w9WgXcQ

## Tweets

https://twitter.com/lexicaljs/status/1685105883124830209

Try adding more content!
`;

export const useAppState = create<State>()(
  persist(
    (set) => ({
      markdown: defaultMarkdown,
      setMarkdown: (markdown) => set({ markdown }),
    }),
    {
      name: "editor-markdown", // storage key
      storage: createJSONStorage(() => localStorage),
    }
  )
);
