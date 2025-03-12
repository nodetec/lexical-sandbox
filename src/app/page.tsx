"use client";

import { useEffect, useState } from "react";
import { Editor } from "~/editor/Editor";

export default function Home() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="editor-shell">
      {isClient ? <Editor /> : <p>Loading editor...</p>}
    </div>
  );
}
