/* eslint-disable @typescript-eslint/no-explicit-any */

// Table Columns
import { ColumnDef } from "@tanstack/react-table";
// Helper Component
import { ViewAuthor } from "./ViewAuthor";
import { DropDownMenu } from "./DropDownMenu";
// UI Component
import { Button } from "@/components/ui/Button";
// Icons
import {
  File,
  User,
  Calendar,
  CircleArrowOutUpRight,
  LoaderCircle,
} from "lucide-react";
// Helper Util Functions
import { getDate } from "@/utils/getDate";
import { getFileName } from "@/utils/getFileName";
// Types
import { TrainingPlan } from "@/types/trainingplans";
// Services
import { getAccountIdCookie } from "@/services/cookiesService";
import useGetCookies from "@/hooks/useGetCookies.ts";
import { useEffect, useState } from "react";

const MenuCell = ({
  planId,
  userId,
  shared,
}: {
  planId: number;
  userId: number;
  shared: boolean;
}) => {
  const { cookies, preLoading } = useGetCookies();
  const [accountId, setAccountId] = useState<number>(0);

  useEffect(() => {
    if (!preLoading && cookies) {
      setAccountId(getAccountIdCookie(cookies));
    }
  }, [preLoading, cookies]);

  if (preLoading) {
    return (
      <div>
        <LoaderCircle className="animate-spin h-6 w-6" />
      </div>
    );
  }

  return (
    accountId === userId && (
      <div>
        <DropDownMenu planId={planId} accId={userId} shared={shared} />
      </div>
    )
  );
};

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
    cell: ({ row }: any) => {
      // Downloadable File
      const shared = row.original.shared;
      return (
        <div className="flex items-center gap-1">
          {shared && (
            <CircleArrowOutUpRight
              size={12}
              color="rgb(107 114 128 / var(--tw-text-opacity, 1))"
            />
          )}
          <a
            className="lowercase underline text-gray-600 hover:text-cyan-300"
            href={row.getValue("docUrl")}
            target="_blank"
            rel="noopener noreferrer"
            download
          >
            {getFileName(row.getValue("docUrl"))}
          </a>
        </div>
      );
    },
  },
  {
    accessorKey: "userId",
    header: ({ column }: any) => {
      return (
        // Sort Button
        <Button
          className="flex items-center bg-transparent"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Author
          <User size={15} className="mx-2" />
        </Button>
      );
    },
    cell: ({ row }: any) => (
      // Fetch Person Info of User
      <ViewAuthor userId={row.getValue("userId")} />
    ),
  },
  {
    accessorKey: "creationDate",
    header: ({ column }: any) => {
      return (
        // Sort Button
        <Button
          className="flex items-center bg-transparent"
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
      const planId = row.original.planId; // Access planId from outside its scope
      const userId = row.original.userId;
      const shared = row.original.shared;

      // Display The Drop Down Menu only for the files that belong to the current logged in user
      // A user cannot share or delete files that do no belong to them
      return <MenuCell planId={planId} userId={userId} shared={shared} />;
    },
  },
];
