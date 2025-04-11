import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { ProductSearchResponse } from "@/services/api/productSearchApi";
import { Card, CardContent } from "@/components/ui/card";

const RecentlyViewedSidebar = () => {
  const [recentItems, setRecentItems] = useState<ProductSearchResponse[]>([]);

  useEffect(() => {
    const stored = Cookies.get("recentlyViewedProducts");
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as ProductSearchResponse[];
        setRecentItems(parsed.slice(0, 3));
      } catch (error) {
        console.error("Failed to parse recently viewed products:", error);
      }
    }
  }, []);

  return (
    <div className="p-4 w-full border-t border-gray-200 mt-10">
      <h3 className="text-lg font-semibold text-textColour mb-3">
        Recently Viewed
      </h3>

      {recentItems.map((item, index) => (
        <a
          key={index}
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <Card className="transition-colors duration-200 hover:bg-muted">
            <CardContent className="flex items-center space-x-4 p-4">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-12 h-12 object-cover rounded"
              />
              <div>
                <div className="text-sm font-medium">
                  {item.title.split(" ").slice(0, 5).join(" ")}
                  {item.title.split(" ").length > 5 && "..."}
                </div>
                <div className="text-xs text-gray-500">{item.seller}</div>
                <a
                  href={item.link}
                  className="text-secondaryColour hover:text-fadedPrimaryColour text-l"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Visit
                </a>
              </div>
            </CardContent>
          </Card>
        </a>
      ))}
    </div>
  );
};

export default RecentlyViewedSidebar;
