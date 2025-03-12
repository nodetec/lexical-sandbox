import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { registerCodeHighlighting, $createCodeNode } from "@lexical/code";

import { $setBlocksType } from "@lexical/selection";

import { BracesIcon } from "lucide-react";
import { useEffect } from "react";
import { Button } from "~/components/ui/button";
import { $getSelection, $isRangeSelection } from "lexical";
import { $createParagraphNode } from "lexical";

interface CodeBlockPluginProps {
  blockType: string;
}

export default function CodeBlockActions({ blockType }: CodeBlockPluginProps) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    registerCodeHighlighting(editor);
  }, [editor]);

  const onAddCodeBlock = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        // Create the code block
        const codeNode = $createCodeNode();

        // Create paragraph nodes before and after
        const paragraphBefore = $createParagraphNode();
        const paragraphAfter = $createParagraphNode();

        // First transform selection to codeblock
        $setBlocksType(selection, () => codeNode);

        // Then insert paragraphs around it
        // Insert before
        codeNode.insertBefore(paragraphBefore);
        // Insert after
        codeNode.insertAfter(paragraphAfter);
      }
    });
  };

  return (
    <div className="flex gap-1">
      <Button
        size="icon"
        variant="ghost"
        className={blockType === "code" ? "bg-primary/5" : ""}
        onClick={onAddCodeBlock}
      >
        <BracesIcon />
      </Button>
    </div>
  );
}
