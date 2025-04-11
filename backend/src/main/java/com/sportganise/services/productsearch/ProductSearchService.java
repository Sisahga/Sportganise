package com.sportganise.services.productsearch;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sportganise.dto.productsearch.ProductSearchRequestDto;
import com.sportganise.dto.productsearch.ProductSearchResponseDto;
import com.sportganise.exceptions.ResourceNotFoundException;
import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

/**
 * Service for fetching and aggregating product search results from Amazon and Google Shopping using
 * RapidAPI endpoints.
 */
@Service
public class ProductSearchService {

  private final RestTemplate restTemplate;
  private final ObjectMapper objectMapper;

  @Value("${rapidapi.key}")
  private String rapidApiKey;

  /** Initializes the service with a new {@link RestTemplate} and {@link ObjectMapper}. */
  public ProductSearchService() {
    this.restTemplate = new RestTemplate();
    this.objectMapper = new ObjectMapper();
  }

  /**
   * Searches for products on Amazon using RapidAPI.
   *
   * @param requestDto The search request containing the query.
   * @return A list of Amazon products.
   * @throws ResourceNotFoundException if the API call fails.
   */
  public List<ProductSearchResponseDto> searchAmazonProducts(ProductSearchRequestDto requestDto) {
    try {
      String query = requestDto.getQuery();
      String url =
          "https://real-time-amazon-data.p.rapidapi.com/search?query="
              + query
              + "&country=US&page=1";

      System.out.println("Query: " + query);
      System.out.println("URL: " + url);

      HttpHeaders headers = new HttpHeaders();
      headers.set("X-RapidAPI-Key", rapidApiKey);
      headers.set("X-RapidAPI-Host", "real-time-amazon-data.p.rapidapi.com");

      HttpEntity<String> entity = new HttpEntity<>(headers);

      ResponseEntity<String> response =
          restTemplate.exchange(url, HttpMethod.GET, entity, String.class);

      System.out.println("Status Code: " + response.getStatusCode());

      JsonNode root = objectMapper.readTree(response.getBody());
      JsonNode products = root.path("data").path("products");

      List<ProductSearchResponseDto> results = new ArrayList<>();

      for (JsonNode product : products) {
        ProductSearchResponseDto dto = new ProductSearchResponseDto();
        dto.setTitle(product.path("product_title").asText());
        dto.setImageUrl(product.path("product_photo").asText());

        String rawPrice = product.path("product_price").asText();
        String numericPrice = rawPrice.replaceAll("[^\\d.]", "");
        dto.setPrice(numericPrice);

        dto.setSeller("Amazon");
        dto.setLink(product.path("product_url").asText());
        results.add(dto);
      }

      return results;

    } catch (Exception e) {
      e.printStackTrace();
      throw new ResourceNotFoundException("Failed to fetch product data: " + e.getMessage());
    }
  }

  /**
   * Searches for products on Google Shopping using RapidAPI.
   *
   * @param requestDto The search request containing the query.
   * @return A list of Google Shopping products.
   * @throws ResourceNotFoundException if the API call fails.
   */
  private List<ProductSearchResponseDto> searchGoogleShoppingProducts(
      ProductSearchRequestDto requestDto) {
    try {
      String query = requestDto.getQuery();
      String url =
          "https://real-time-product-search.p.rapidapi.com/search-v2"
              + "?q="
              + query
              + "&country=ca"
              + "&language=en"
              + "&page=1"
              + "&limit=10"
              + "&sort_by=BEST_MATCH"
              + "&product_condition=ANY"
              + "&return_filters=true";

      HttpHeaders headers = new HttpHeaders();
      headers.set("X-RapidAPI-Key", rapidApiKey);
      headers.set("X-RapidAPI-Host", "real-time-product-search.p.rapidapi.com");

      HttpEntity<String> entity = new HttpEntity<>(headers);
      ResponseEntity<String> response =
          restTemplate.exchange(url, HttpMethod.GET, entity, String.class);

      JsonNode root = objectMapper.readTree(response.getBody());
      JsonNode products = root.path("data").path("products");

      List<ProductSearchResponseDto> results = new ArrayList<>();
      for (JsonNode product : products) {
        ProductSearchResponseDto dto = new ProductSearchResponseDto();
        dto.setTitle(product.path("product_title").asText());
        dto.setImageUrl(product.path("product_photos").get(0).asText());
        dto.setLink(product.path("product_page_url").asText());

        JsonNode priceArray = product.path("typical_price_range");
        if (priceArray.isArray() && priceArray.size() > 0) {
          String price = priceArray.get(0).asText().replaceAll("[^\\d.]", "");
          dto.setPrice(price.isEmpty() ? "See link for prices" : price);
        } else {
          dto.setPrice("See link for prices");
        }

        dto.setSeller("Google Shopping");
        results.add(dto);
      }

      return results;

    } catch (Exception e) {
      e.printStackTrace();
      throw new ResourceNotFoundException(
          "Failed to fetch Google Shopping data: " + e.getMessage());
    }
  }

  /**
   * Searches for products on eBay using the RapidAPI eBay Search API.
   *
   * @param requestDto the request containing the product search query
   * @return a list of product search results mapped to {@link ProductSearchResponseDto}
   * @throws ResourceNotFoundException if the API call fails or returns an invalid response
   */
  private List<ProductSearchResponseDto> searchEbayProducts(ProductSearchRequestDto requestDto) {
    try {
      String query = requestDto.getQuery();
      String url = "https://your-ebay-api-url/endpoint?searchQuery=" + query;

      HttpHeaders headers = new HttpHeaders();
      headers.set("X-RapidAPI-Key", rapidApiKey);
      headers.set("X-RapidAPI-Host", "your-ebay-api-host");

      HttpEntity<String> entity = new HttpEntity<>(headers);
      ResponseEntity<String> response =
          restTemplate.exchange(url, HttpMethod.GET, entity, String.class);

      JsonNode root = objectMapper.readTree(response.getBody());
      JsonNode products = root.path("results");

      List<ProductSearchResponseDto> results = new ArrayList<>();
      for (JsonNode product : products) {
        ProductSearchResponseDto dto = new ProductSearchResponseDto();
        dto.setTitle(product.path("title").asText());
        dto.setImageUrl(product.path("image").asText());
        dto.setLink(product.path("url").asText());

        String rawPrice = product.path("price").asText();
        String numericPrice = rawPrice.replaceAll("[^\\d.]", "");
        dto.setPrice(numericPrice);

        dto.setSeller("eBay");
        results.add(dto);
      }

      return results;
    } catch (Exception e) {
      e.printStackTrace();
      throw new ResourceNotFoundException("Failed to fetch eBay data: " + e.getMessage());
    }
  }

  /**
   * Searches for products from all available providers.
   *
   * @param query The product search query string.
   * @return A combined list of product results.
   */
  public List<ProductSearchResponseDto> searchProducts(String query) {
    ProductSearchRequestDto requestDto = new ProductSearchRequestDto();
    requestDto.setQuery(query);

    List<ProductSearchResponseDto> combinedResults = new ArrayList<>();
    combinedResults.addAll(searchAmazonProducts(requestDto));
    combinedResults.addAll(searchGoogleShoppingProducts(requestDto));
    combinedResults.addAll(searchEbayProducts(requestDto));

    return combinedResults;
  }
}
