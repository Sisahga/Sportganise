/* eslint-disable @typescript-eslint/no-explicit-any */

// Table Columns
import { ColumnDef } from "@tanstack/react-table";
// Hooks
import usePersonalInformation from "@/hooks/usePersonalInfromation";
// UI Component
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/Button";
// Icons
import { File, User, Calendar, Ellipsis, Trash2, Share } from "lucide-react";
// Helper Util Functions
import { getDate } from "@/utils/getDate";
import { getFileName } from "@/utils/getFileName";
// Types
import { TrainingPlan } from "@/types/trainingplans";
// Logging
import log from "loglevel";

// Table Column Definitions
// ... follows type TrainingPlan
export const columns: ColumnDef<TrainingPlan>[] = [
  {
    accessorKey: "docUrl",
    header: () => {
      return (
        <div className="flex items-center">
          Attachment
          <File size={15} className="mx-2" />
        </div>
      );
    },
    cell: ({ row }: any) => (
      // Downloadable File
      <a
        className="lowercase underline text-gray-600 hover:text-cyan-300"
        href={row.getValue("docUrl")}
        target="_blank"
        rel="noopener noreferrer"
        download
      >
        {getFileName(row.getValue("docUrl"))}
      </a>
    ),
  },
  {
    accessorKey: "userId",
    header: ({ column }: any) => {
      return (
        // Sort Button
        <Button
          className="flex items-center"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Author
          <User size={15} className="mx-2" />
        </Button>
      );
    },
    cell: ({ row }: any) => {
      // Fetch Person Info of User
      const { data: accountDetails } = usePersonalInformation(
        row.getValue("userId"),
      );
      return (
        <div className="capitalize">
          {accountDetails ? (
            `${accountDetails?.firstName} ${accountDetails?.lastName}`
          ) : (
            <span className="text-yellow-600">DNE</span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "creationDate",
    header: ({ column }: any) => {
      return (
        // Sort Button
        <Button
          className="flex items-center"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <Calendar size={15} className="mx-2" />
        </Button>
      );
    },
    cell: ({ row }: any) => (
      // Format Date
      <div className="capitalize">{getDate(row.getValue("creationDate"))}</div>
    ),
  },
  {
    id: "menu",
    cell: ({ row }: any) => {
      // Menu Options: share, delete
      const fileUrl = row.original.docUrl; // Access docUrl cell row from outside its scope
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-6 w-6">
              <Ellipsis />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Options</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={() => {
                  log.debug("TableColumns -> Sharing fileUrl", fileUrl);
                }}
              >
                <Share />
                <span>Share</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  log.debug("TableColumns -> Deleting fileUrl", fileUrl);
                }}
              >
                <Trash2 color="red" />
                <span className="text-red">Delete</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
