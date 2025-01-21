import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function PriceComparisonToolContent() {
  // TODO: Replace with backend/database data
  const data = [
    {
      company: "Amazon",
      product:
        "Yonex ZR 100 Light Aluminum Blend Badminton Racquet with Full Cover",
      price: 30.99,
      link: "#",
      image: "https://via.placeholder.com/50",
    },
    {
      company: "Racquets4U",
      product: "Yonex ZR 100 Light Badminton Racquet (White/Grey, Strung)",
      price: 25.99,
      link: "#",
      image: "https://via.placeholder.com/50",
    },
    {
      company: "eBay",
      product: "Yonex ZR 100 Light Aluminum Badminton Racquet with Full Cover",
      price: 54.99,
      link: "#",
      image: "https://via.placeholder.com/50",
    },
    {
      company: "Walmart",
      product:
        "Yonex ZR 100 Light Aluminum Badminton Racquet with Full Cover, Set of 2 Blue",
      price: 42.99,
      link: "#",
      image: "https://via.placeholder.com/50",
    },
  ];

  // State for sorting
  const [sortedData, setSortedData] = useState(data);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null);

  // Sorting function
  const sortByPrice = () => {
    const sorted = [...sortedData].sort((a, b) => {
      if (sortOrder === "asc") {
        return b.price - a.price;
      }
      return a.price - b.price;
    });

    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    setSortedData(sorted);
  };

  return (
    <div className="p-6">
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
        <Input
          type="text"
          placeholder="Search sports equipment..."
          className="w-full md:w-1/2 bg-navbar text-textColour p-2 rounded-lg"
        />
        <Button className="bg-secondaryColour text-white p-2 rounded-lg">
          Search
        </Button>
        {/* TODO: Integrate search functionality with backend */}

        {/* Sort Button */}
        <Button
          className="bg-primaryColour text-white p-2 rounded-lg shadow-lg hover:bg-secondaryColour"
          onClick={sortByPrice}
        >
          Sort by Price {sortOrder === "asc" ? "▲" : "▼"}
        </Button>
      </div>

      {/* Data Table */}
      <div className="overflow-x-auto">
        <Table className="min-w-full">
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Details</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Link</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.map((item, index) => (
              <TableRow
                key={index}
                className={`hover:bg-secondaryColour hover:text-white ${
                  index % 2 === 0 ? "bg-white" : "bg-navbar"
                }`}
              >
                <TableCell>
                  <img
                    src={item.image}
                    alt="Product"
                    className="h-12 w-12 object-cover rounded"
                  />
                </TableCell>
                <TableCell>
                  <div className="font-bold text-textColour">
                    {item.company}
                  </div>
                  <div className="text-sm text-fadedPrimaryColour">
                    {item.product}
                  </div>
                </TableCell>
                <TableCell>${item.price.toFixed(2)}</TableCell>
                <TableCell>
                  <a
                    href={item.link}
                    className="text-secondaryColour hover:underline"
                  >
                    Visit
                  </a>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
