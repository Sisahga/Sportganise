import {
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  flexRender,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "../ui/Button";
import { Input } from "../ui/input";
import { Search, File, User, Calendar } from "lucide-react";

const MockData = [
  {
    trainingPlan: "Document1.doc",
    author: "Coach Steven",
    date: new Date(),
  },
  {
    trainingPlan: "ShuttleCock_techniques.doc",
    author: "Coach Micheal",
    date: new Date(),
  },
  {
    trainingPlan: "TrainingSessionNotes.dox",
    author: "Benjamin",
    date: new Date(),
  },
  {
    trainingPlan: "Document1.doc",
    author: "Coach Steven",
    date: new Date(),
  },
  {
    trainingPlan: "ShuttleCock_techniques.doc",
    author: "Coach Micheal",
    date: new Date(),
  },
  {
    trainingPlan: "TrainingSessionNotes.dox",
    author: "Benjamin",
    date: new Date(),
  },
  {
    trainingPlan: "Document1.doc",
    author: "Coach Steven",
    date: new Date(),
  },
  {
    trainingPlan: "badminton_pro.doc",
    author: "Coach Micheal",
    date: new Date(),
  },
  {
    trainingPlan: "TrainingSessionNotes.dox",
    author: "Benjamin",
    date: new Date(),
  },
  {
    trainingPlan: "paymentPlan.doc",
    author: "Coach Steven",
    date: new Date(),
  },
  {
    trainingPlan: "ShuttleCock_techniques.doc",
    author: "Coach Micheal",
    date: new Date(),
  },
  {
    trainingPlan: "TrainingSessionNotes.dox",
    author: "Benjamin",
    date: new Date(),
  },
];

interface ColumnTypes {
  trainingPlan: string; //change to File
  author: string;
  date: Date;
}

export const columns = [
  {
    accessorKey: "trainingPlan",
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
        {props.getValue("trainingPlan")}
      </a>
    ),
  },
  {
    accessorKey: "author",
    header: () => {
      return (
        <div className="flex items-center">
          Author
          <User size={15} className="mx-2" />
        </div>
      );
    },
    cell: (props: any) => (
      <div className="capitalize">{props.getValue("author")}</div>
    ),
  },
  {
    accessorKey: "date",
    header: (props: any) => {
      return (
        <div className="flex items-center">
          {props.getContext}
          <Calendar size={15} className="mx-2" />
        </div>
      );
    },
    cell: (props: any) => (
      <div className="capitalize">{props.getValue("date").toDateString()}</div>
    ),
  },
];

export default function TrainingPlanTable() {
  const [data /*setData*/] = useState<ColumnTypes[]>(MockData);

  const table = useReactTable({
    data, //needs to be date
    columns, //needs to be column
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });
  return (
    <div>
      <div className="mb-4 flex items-center gap-4">
        <Search />
        <Input
          placeholder="Search by file name"
          value={
            (table.getColumn("trainingPlan")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("trainingPlan")?.setFilterValue(event.target.value)
          }
        />
      </div>
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
