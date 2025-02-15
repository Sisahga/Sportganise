// React
import { useState } from "react";
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
import { ColumnDef } from "@tanstack/react-table";
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
// Icons
import { Search } from "lucide-react";
// Types
import { TrainingPlan } from "@/types/trainingplans";
// Logs
import log from "loglevel";

// Props
interface TrainingPlanTableProps {
  columns: ColumnDef<TrainingPlan>[]; // Table accepts only 'columns', column definition is of type TrainingPlan
  data: TrainingPlan[]; // Table accepts only 'data', in this case of type TrainingPlan
}

export default function TrainingPlanTable({
  columns,
  data,
}: TrainingPlanTableProps) {
  log.info("Rendered TrainingPlanTable component");
  log.info("TrainingPlanTable -> data from TrainingPlanTableProps is", data);
  log.info(
    "TrainingPlanTable -> columns from TrainingPlanTableProps is",
    columns,
  );
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
                      header.getContext(),
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
                        cell.getContext(),
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
