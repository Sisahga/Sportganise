import axios from "axios";
import { getBearerToken } from "@/services/apiHelper";

export interface ProductSearchResponse {
  title: string;
  imageUrl: string;
  price: string;
  seller: string;
  link: string;
}

export const searchProducts = async (
  query: string,
): Promise<ProductSearchResponse[]> => {
  try {
    const response = await axios.get<ProductSearchResponse[]>(
      "http://localhost:8080/api/search/products", //TODO:  change back to this as it currently runs locally on local backend `/api/search/products`,
      {
        params: { query },
        headers: {
          Authorization: getBearerToken(),
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error("Failed to fetch product search results:", error);
    throw error;
  }
};
