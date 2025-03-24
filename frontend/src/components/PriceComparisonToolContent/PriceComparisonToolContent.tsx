/* eslint-disable @typescript-eslint/no-explicit-any */

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
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Search, DollarSign, ShoppingCart, LinkIcon } from "lucide-react";
import {
  searchProducts,
  ProductSearchResponse,
} from "@/services/api/productSearchApi";

// Define columns for React Table
const columns = [
  {
    accessorKey: "imageUrl",
    header: () => (
      <div className="flex items-center">
        Image
        <ShoppingCart size={15} className="mx-2" />
      </div>
    ),
    cell: (props: any) => (
      <img
        src={props.getValue()}
        alt="Product"
        className="h-12 w-12 object-cover rounded"
      />
    ),
  },
  {
    accessorKey: "seller",
    header: "Company",
    cell: (props: any) => (
      <div className="font-bold text-textColour">{props.getValue()}</div>
    ),
  },
  {
    accessorKey: "title",
    header: "Product",
    cell: (props: any) => (
      <div className="text-sm text-fadedPrimaryColour">{props.getValue()}</div>
    ),
  },
  {
    accessorKey: "price",
    header: () => (
      <div className="flex items-center">
        Price
        <DollarSign size={15} className="mx-2" />
      </div>
    ),
    cell: (props: any) => <div>${parseFloat(props.getValue()).toFixed(2)}</div>,
  },
  {
    accessorKey: "link",
    header: () => (
      <div className="flex items-center">
        Link
        <LinkIcon size={15} className="mx-2" />
      </div>
    ),
    cell: (props: any) => (
      <a
        href={props.getValue()}
        className="text-secondaryColour hover:underline"
        target="_blank"
        rel="noopener noreferrer"
      >
        Visit
      </a>
    ),
  },
];

export default function PriceComparisonToolContent() {
  const [tableData, setTableData] = useState<ProductSearchResponse[]>([]);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null);
  const [searchInput, setSearchInput] = useState("");

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  // Sort function
  const sortByPrice = () => {
    const sorted = [...tableData].sort((a, b) => {
      const priceA = parseFloat(a.price);
      const priceB = parseFloat(b.price);
      return sortOrder === "asc" ? priceB - priceA : priceA - priceB;
    });
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    setTableData(sorted);
  };

  // Fetch live data on search
  const handleSearch = async () => {
    try {
      const products = await searchProducts(searchInput);
      setTableData(products);
    } catch (error) {
      console.error("Search failed:", error);
      setTableData([]);
    }
  };

  return (
    <div className="p-6 mb-32 mt-32">
      {/* Header */}
      <div className="text-left md:text-center mb-6">
        <h1 className="text-2xl font-bold text-textColour">Best Deals</h1>
        <p className="text-sm text-fadedPrimaryColour">
          Search and compare sports equipment prices across multiple online
          shops.
        </p>
      </div>

      {/* Search and Sort */}
      <div className="flex flex-col md:flex-row md:justify-center mb-6 gap-2">
        {/* Search Bar */}
        <div className="relative w-full px-4 sm:px-0 mb-4 md:mb-0">
          <Search className="absolute left-7 sm:left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            type="text"
            placeholder="Search by product name"
            className="font-font pl-10 h-10 sm:h-12 w-full bg-white border border-gray-200 rounded-lg text-sm sm:text-base"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>
        <Button
          className="bg-secondaryColour text-white p-2 rounded-lg"
          onClick={handleSearch}
        >
          Search
        </Button>

        {/* Sort Button */}
        <Button
          className="bg-primaryColour text-white p-2 rounded-lg shadow-lg hover:bg-secondaryColour"
          onClick={sortByPrice}
        >
          Sort by Price {sortOrder === "asc" ? "▲" : "▼"}
        </Button>
      </div>

      {/* Data Table */}
      <Table className="table">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-6 text-center">
                No data available
              </TableCell>
            </TableRow>
          )}
        </TableBody>
        <TableCaption>Compare sports equipment prices.</TableCaption>
      </Table>

      {/* Pagination */}
      <div className="flex space-x-2 justify-center my-5">
        <Button
          variant="outline"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
