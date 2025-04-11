package com.sportganise.controllers.productsearch;

import com.sportganise.dto.productsearch.ProductSearchResponseDto;
import com.sportganise.services.productsearch.ProductSearchService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/** REST controller for handling product search requests from the frontend. */
@RestController
@RequestMapping("/api/search")
public class ProductSearchController {

  @Autowired private ProductSearchService productSearchService;

  /**
   * Searches for products across all supported providers.
   *
   * @param query The product name or keyword to search for.
   * @return A list of product search results.
   */
  @GetMapping("/products")
  public List<ProductSearchResponseDto> searchProducts(@RequestParam String query) {
    return productSearchService.searchProducts(query);
  }
}
