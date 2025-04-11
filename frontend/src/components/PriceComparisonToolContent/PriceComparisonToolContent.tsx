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
import PriceComparisonSkeleton from "./PriceComparisonSkeleton";
import { addRecentlyViewedProduct } from "@/services/cookiesService.ts";
import RecentlyViewedSidebar from "@/components/PriceComparisonToolContent/RecentlyViewedSidebar.tsx";

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
    cell: (props: any) => {
      const value = props.getValue();
      return isNaN(parseFloat(value)) ? (
        <div className="text-xs text-gray-400 italic">{value}</div>
      ) : (
        <div>${parseFloat(value).toFixed(2)}</div>
      );
    },
  },
  {
    accessorKey: "link",
    header: () => (
      <div className="flex items-center">
        Link
        <LinkIcon size={15} className="mx-2" />
      </div>
    ),
    cell: (props: any) => {
      const product = props.row.original; // get full row data

      const handleVisitClick = () => {
        addRecentlyViewedProduct({
          title: product.title,
          imageUrl: product.imageUrl,
          price: product.price,
          seller: product.seller,
          link: product.link,
        });
      };

      return (
        <a
          href={product.link}
          onClick={handleVisitClick}
          className="text-secondaryColour hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          Visit
        </a>
      );
    },
  },
];

export default function PriceComparisonToolContent() {
  const [tableData, setTableData] = useState<ProductSearchResponse[]>([]);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null);
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(false);

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
      setLoading(true);
      const products = await searchProducts(searchInput);
      setTableData(products);
    } catch (error) {
      console.error("Search failed:", error);
      setTableData([]);
    } finally {
      setLoading(false);
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
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
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
      {loading ? (
        <PriceComparisonSkeleton />
      ) : (
        <div className="flex flex-col md:flex-row md:items-start gap-4">
          <div className="flex-1">
            <Table className="table">
              {/* Render table header only if we have rows */}
              {table.getRowModel().rows.length > 0 && (
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
              )}

              {/* Body section handles all states: data, welcome message, no results */}
              <TableBody>
                {table.getRowModel().rows.length > 0 && (
                  <>
                    {table.getRowModel().rows.map((row) => (
                      <TableRow key={row.id}>
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </>
                )}

                {!searchInput.trim() &&
                  table.getRowModel().rows.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="text-center py-12"
                      >
                        <div className="text-lg font-semibold text-textColour mb-2">
                          Ready to find the best deals?
                        </div>
                        <div className="text-sm text-gray-500">
                          Start by searching for your favorite sports gear
                          above.
                        </div>
                      </TableCell>
                    </TableRow>
                  )}

                {searchInput.trim() &&
                  table.getRowModel().rows.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="text-center py-12"
                      >
                        <div className="text-sm text-gray-500">
                          No results found. Try a different keyword.
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* Pagination */}
      {table.getRowModel().rows.length > 0 && (
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
      )}
      <RecentlyViewedSidebar />
    </div>
  );
}
