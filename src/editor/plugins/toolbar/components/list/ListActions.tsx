import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { ListIcon, ListOrderedIcon } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
} from "@lexical/list";

interface ListPluginProps {
  blockType: string;
}

export default function ListActions({ blockType }: ListPluginProps) {
  const [editor] = useLexicalComposerContext();

  return (
    <>
      <Button
        size="icon"
        variant="ghost"
        className={blockType === "ol" ? "bg-primary/5" : ""}
        onClick={() => {
          if (blockType === "ol") {
            editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
          } else {
            editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
          }
        }}
      >
        <ListOrderedIcon />
      </Button>

      <Button
        size="icon"
        variant="ghost"
        className={blockType === "ul" ? "bg-primary/5" : ""}
        onClick={() => {
          if (blockType === "ul") {
            editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
          } else {
            editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
          }
        }}
      >
        <ListIcon />
      </Button>
    </>
  );
}
