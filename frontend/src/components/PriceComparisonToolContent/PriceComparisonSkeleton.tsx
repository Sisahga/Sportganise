import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DollarSign, ShoppingCart, LinkIcon } from "lucide-react";

const PriceComparisonSkeleton = () => {
  const skeletonRows = 10;
  const fadeStep = 0.08;

  return (
    <Table className="table">
      <TableHeader>
        <TableRow>
          <TableHead style={{ width: "5rem" }}>
            <div className="flex items-center w-20">
              Image
              <ShoppingCart size={15} className="ml-2 text-muted" />
            </div>
          </TableHead>
          <TableHead style={{ width: "6rem" }}>
            <div className="w-24">Company</div>
          </TableHead>
          <TableHead>
            <div className="w-[90%]">Product</div>
          </TableHead>
          <TableHead style={{ width: "4rem" }}>
            <div className="flex items-center w-12">
              Price
              <DollarSign size={15} className="ml-2 text-muted" />
            </div>
          </TableHead>
          <TableHead style={{ width: "3rem" }}>
            <div className="flex items-center w-10">
              Link
              <LinkIcon size={15} className="ml-2 text-muted" />
            </div>
          </TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {Array.from({ length: skeletonRows }).map((_, index) => (
          <TableRow
            key={index}
            style={{ opacity: 1 - index * fadeStep }}
            className="animate-pulse"
          >
            <TableCell>
              <div className="h-12 w-12 bg-gray-200 rounded" />
            </TableCell>
            <TableCell>
              <div className="h-12 w-24 bg-gray-200 rounded" />
            </TableCell>
            <TableCell>
              <div className="h-12 w-[70%] bg-gray-200 rounded" />
            </TableCell>
            <TableCell>
              <div className="h-8 w-12 bg-gray-200 rounded" />
            </TableCell>
            <TableCell>
              <div className="h-8 w-10 bg-gray-200 rounded" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>

      <TableCaption>Compare sports equipment prices.</TableCaption>
    </Table>
  );
};

export default PriceComparisonSkeleton;
