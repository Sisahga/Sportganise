package com.sportganise.controllers.productsearch;

import com.sportganise.dto.productsearch.ProductSearchResponseDto;
import com.sportganise.services.productsearch.ProductSearchService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/search")
public class ProductSearchController {

  @Autowired private ProductSearchService productSearchService;

  @GetMapping("/products")
  public List<ProductSearchResponseDto> searchProducts(@RequestParam String query) {
    return productSearchService.searchProducts(query);
  }
}
