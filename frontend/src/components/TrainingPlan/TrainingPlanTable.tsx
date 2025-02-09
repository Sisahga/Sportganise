/* eslint-disable @typescript-eslint/no-explicit-any */
// React
import { useState } from "react";
// Hooks
import usePersonalInformation from "@/hooks/usePersonalInfromation";
// Table
import {
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  flexRender,
  getFilteredRowModel,
  SortingState,
  getSortedRowModel,
} from "@tanstack/react-table";
// UI Components
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
// Icons
import { Search, File, User, Calendar, Ellipsis, Trash2 } from "lucide-react";
// Types
import { TrainingPlan } from "@/types/trainingplans";
// Helper Util Functions
import { getDate } from "@/utils/getDate";
import { getFileName } from "@/utils/getFileName";
// Logs
import log from "loglevel";

// Table Column Definitions
// ... follows type TrainingPlan
export const columns = [
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
    cell: (props: any) => (
      <a
        className="miniscule underline text-gray-600 hover:text-cyan-300"
        href={props.getValue("trainingPlan")}
        target="_blank"
        rel="noopener noreferrer"
        download
      >
        {getFileName(props.getValue("docUrl"))}
      </a>
    ),
  },
  {
    accessorKey: "userId",
    header: ({ column }: any) => {
      return (
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
    cell: (props: any) => {
      const { data: accountDetails } = usePersonalInformation(
        props.getValue("userId")
      );
      return (
        <div className="capitalize">
          {accountDetails ? (
            `${accountDetails?.firstName} ${accountDetails?.lastName}`
          ) : (
            <span className="text-yellow-600">"DNE"</span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "creationDate",
    header: ({ column }: any) => {
      return (
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
    cell: (props: any) => (
      <div className="capitalize">
        {getDate(props.getValue("creationDate"))}
      </div>
    ),
  },
  {
    id: "menu",
    cell: () => {
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
              <DropdownMenuItem onClick={() => {}}>
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

// Props
interface TrainingPlanTableProps {
  data: TrainingPlan[]; // Table accepts only 'data', in this case of type TrainingPlan
}

export default function TrainingPlanTable({ data }: TrainingPlanTableProps) {
  log.info("TrainingPlanTable -> data from TrainingPlanTableProps is", data);
  const [sorting, setSorting] = useState<SortingState>([]); // Sorting State for column creationDate and userId

  // Table Definition and Creation
  const table = useReactTable({
    data, // Component Prop - NOTE: must be 'data'
    columns, // Column definition - NOTE: must be 'column'
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  return (
    <div>
      {/** Search Bar */}
      <div className="relative w-full px-4 sm:px-0 mb-4 mx-auto max-w-5xl">
        <Search className="absolute left-7 sm:left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
        <Input
          type="text"
          placeholder="Search by file name"
          className="pl-10 h-10 sm:h-12 w-full bg-white border border-gray-200 rounded-lg text-sm sm:text-base"
          value={(table.getColumn("docUrl")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("docUrl")?.setFilterValue(event.target.value)
          }
        />
      </div>

      {/** Table */}
      <Table className="table">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    <div className="overflow-x-scroll max-w-[150px]">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </div>
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-6 text-center">
                You do not have any training plans
              </TableCell>
            </TableRow>
          )}
        </TableBody>
        <TableCaption>A list of all your training plans.</TableCaption>
      </Table>

      {/** Pagination */}
      <div className="flex space-x-2 justify-center my-5">
        <div>
          <Button
            variant="outline"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
        </div>
        <div>
          <Button
            variant="outline"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
