"use client";

import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/Button";
import { MoreHorizontal, Users, Edit, Image } from "lucide-react";
import { MembersSettingsDialog } from "./MembersSettings";
import { RenameGroupDialog } from "./RenameGroupChat";
import { ChangePictureDialog } from "./ChangeGroupPicture";

export default function GroupMenu() {
  const [isMembersSettingsOpen, setIsMembersSettingsOpen] = useState(false);
  const [isRenameGroupOpen, setIsRenameGroupOpen] = useState(false);
  const [isChangePictureOpen, setIsChangePictureOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-primaryColour bg-textPlaceholderColour/40 hover:bg-textPlaceholderColour"
          >
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-[200px] bg-white border-navbar"
        >
          <DropdownMenuItem
            className="flex items-center justify-between py-3 font-font text-primaryColour bg-white hover:bg-secondaryColour/20"
            onSelect={() => setIsMembersSettingsOpen(true)}
          >
            <span>Members Settings</span>
            <Users className="h-4 w-4 ml-2" />
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-primaryColour/20" />
          <DropdownMenuItem
            className="flex items-center justify-between py-3 font-font text-primaryColour bg-white hover:bg-secondaryColour/20"
            onSelect={() => setIsRenameGroupOpen(true)}
          >
            <span>Rename Group</span>
            <Edit className="h-4 w-4 ml-2" />
          </DropdownMenuItem>
          <DropdownMenuItem
            className="flex items-center justify-between py-3 font-font text-primaryColour bg-white hover:bg-secondaryColour/20"
            onSelect={() => setIsChangePictureOpen(true)}
          >
            <span>Change Picture</span>
            <Image className="h-4 w-4 ml-2" />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <MembersSettingsDialog
        isOpen={isMembersSettingsOpen}
        onClose={() => setIsMembersSettingsOpen(false)}
      />
      <RenameGroupDialog
        isOpen={isRenameGroupOpen}
        onClose={() => setIsRenameGroupOpen(false)}
      />
      <ChangePictureDialog
        isOpen={isChangePictureOpen}
        onClose={() => setIsChangePictureOpen(false)}
      />
    </>
  );
}
