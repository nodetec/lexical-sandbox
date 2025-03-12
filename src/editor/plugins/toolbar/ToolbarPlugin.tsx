import { Button } from "~/components/ui/button";
import { LOW_PRIORIRTY, RICH_TEXT_OPTIONS, RichTextAction } from "./constants";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { mergeRegister, $getNearestNodeOfType } from "@lexical/utils";

import {
  HeadingTagType,
  $createHeadingNode,
  $isHeadingNode,
} from "@lexical/rich-text";
import { $setBlocksType } from "@lexical/selection";
// import { $isCodeNode, getDefaultCodeLanguage } from "@lexical/code";

import {
  $getSelection,
  $isRangeSelection,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  FORMAT_TEXT_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
  $createParagraphNode,
} from "lexical";
import React, { useEffect, useState } from "react";
import { cn } from "~/lib/utils";
import { useKeyBinds } from "./hooks/useKeybinds";
import { $isListNode, ListNode } from "@lexical/list";
import ListActions from "./components/list/ListActions";
import CodeBlockActions from "./components/codeblock/CodeblockActions";
import YoutubeAction from "./components/youtube/YouTubeActions";
import TwitterAction from "./components/twitter/TwitterActions";
import ImageAction from "./components/image/ImageActions";
import { Select } from "~/components/catalyst/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { PlusIcon } from "lucide-react";
import { InsertProfileButton } from "./components/profile/ProfileActions";

export function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const [disableMap, setDisableMap] = useState<{ [id: string]: boolean }>({
    [RichTextAction.Undo]: true,
    [RichTextAction.Redo]: true,
  });
  const [selectionMap, setSelectionMap] = useState<{ [id: string]: boolean }>(
    {}
  );
  const [open, setOpen] = useState(false);

  const [blockType, setBlockType] = useState("paragraph");

  // Use useCallback to memoize the updateToolbar function
  const updateToolbar = React.useCallback(() => {
    const selection = $getSelection();

    if ($isRangeSelection(selection)) {
      const newSelectionMap = {
        [RichTextAction.Bold]: selection.hasFormat("bold"),
        [RichTextAction.Italics]: selection.hasFormat("italic"),
        [RichTextAction.Underline]: selection.hasFormat("underline"),
        [RichTextAction.Strikethrough]: selection.hasFormat("strikethrough"),
        [RichTextAction.Code]: selection.hasFormat("code"),
      };
      setSelectionMap(newSelectionMap);

      const anchorNode = selection.anchor.getNode();
      const element =
        anchorNode.getKey() === "root"
          ? anchorNode
          : anchorNode.getTopLevelElementOrThrow();
      const elementKey = element.getKey();
      const elementDOM = editor.getElementByKey(elementKey);

      if (!elementDOM) return;

      if ($isListNode(element)) {
        const parentList = $getNearestNodeOfType(anchorNode, ListNode);
        const type = parentList ? parentList.getTag() : element.getTag();
        setBlockType(type);
      } else {
        const type = $isHeadingNode(element)
          ? element.getTag()
          : element.getType();
        setBlockType(type);
      }
    }
  }, [editor]);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateToolbar();
        });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          updateToolbar();
          return false;
        },
        LOW_PRIORIRTY
      ),
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload) => {
          setDisableMap((prevDisableMap) => ({
            ...prevDisableMap,
            undo: !payload,
          }));
          return false;
        },
        LOW_PRIORIRTY
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload) => {
          setDisableMap((prevDisableMap) => ({
            ...prevDisableMap,
            redo: !payload,
          }));
          return false;
        },
        LOW_PRIORIRTY
      )
    );
  }, [editor, updateToolbar]);

  const onAction = (id: RichTextAction) => {
    switch (id) {
      case RichTextAction.Bold: {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
        break;
      }
      case RichTextAction.Italics: {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
        break;
      }
      case RichTextAction.Underline: {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
        break;
      }
      case RichTextAction.Strikethrough: {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough");
        break;
      }
      case RichTextAction.Code: {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, "code");
        break;
      }
      case RichTextAction.Undo: {
        editor.dispatchCommand(UNDO_COMMAND, undefined);
        break;
      }
      case RichTextAction.Redo: {
        editor.dispatchCommand(REDO_COMMAND, undefined);
        break;
      }
    }
  };

  useKeyBinds({ onAction });

  const updateFormat = (heading: HeadingTagType | "paragraph") => {
    editor.update(() => {
      const selection = $getSelection();

      if ($isRangeSelection(selection)) {
        if (heading === "paragraph") {
          $setBlocksType(selection, () => $createParagraphNode());
        } else {
          $setBlocksType(selection, () => $createHeadingNode(heading));
        }
      }
    });
  };

  return (
    <div className="flex gap-2 p-4 items-center">
      <Select
        className="w-[140px]"
        aria-label="text format"
        name="text format"
        value={blockType}
        onChange={(e) =>
          updateFormat(e.target.value as HeadingTagType | "paragraph")
        }
      >
        <option value="paragraph">Paragraph</option>
        <option value="h1">Heading 1</option>
        <option value="h2">Heading 2</option>
        <option value="h3">Heading 3</option>
        <option value="h4">Heading 4</option>
        <option value="h5">Heading 5</option>
        <option value="h6">Heading 6</option>
      </Select>

      {RICH_TEXT_OPTIONS.map(({ id, icon }, index) =>
        id === RichTextAction.Divider ? (
          <div className="my-2 border" key={`${id}-${index}`} />
        ) : (
          <Button
            key={`${id}-${index}`}
            className={cn(selectionMap[id] && "bg-primary/5")}
            size="icon"
            variant="ghost"
            onClick={() => onAction(id)}
            disabled={disableMap[id]}
          >
            {icon}
          </Button>
        )
      )}
      <ListActions blockType={blockType} />
      <CodeBlockActions blockType={blockType} />
      <InsertProfileButton />
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button size="sm" variant="outline">
            <PlusIcon /> Insert
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem asChild>
            <YoutubeAction />
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <TwitterAction />
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <ImageAction />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
