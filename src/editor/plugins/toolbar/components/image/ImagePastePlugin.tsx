import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $getSelection,
  $isRangeSelection,
  PASTE_COMMAND,
  COMMAND_PRIORITY_HIGH,
} from "lexical";
import { useEffect } from "react";
import { $createImageNode } from "~/editor/nodes/ImageNode";

const IMAGE_MARKDOWN_REGEX = /!\[(.*?)\]\((.*?)\)/;

export default function ImagePastePlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    const removePasteOverride = editor.registerCommand(
      PASTE_COMMAND,
      (event: ClipboardEvent) => {
        event.preventDefault();
        const text = event.clipboardData?.getData("text/plain")?.trim();
        if (!text) return false;

        const match = text.match(IMAGE_MARKDOWN_REGEX);
        if (match) {
          const altText = match[1];
          const url = match[2];

          editor.update(() => {
            const selection = $getSelection();
            if (!$isRangeSelection(selection)) return;
            if (!selection.isCollapsed()) {
              selection.removeText();
            }
            const imageNode = $createImageNode({ src: url, altText });
            selection.insertNodes([imageNode]);
          });
          return true;
        }

        return false;
      },
      COMMAND_PRIORITY_HIGH
    );

    return () => {
      removePasteOverride();
    };
  }, [editor]);

  return null;
}
