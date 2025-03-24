package com.sportganise.services.productsearch;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sportganise.dto.productsearch.ProductSearchRequestDto;
import com.sportganise.dto.productsearch.ProductSearchResponseDto;
import com.sportganise.exceptions.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;

@Service
public class ProductSearchService {

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    @Value("${rapidapi.key}")
    private String rapidApiKey;

    public ProductSearchService() {
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
    }

    public List<ProductSearchResponseDto> searchAmazonProducts(ProductSearchRequestDto requestDto) {
        try {
            String query = requestDto.getQuery();
            String url = "https://real-time-amazon-data.p.rapidapi.com/search?query=" + query + "&country=US&page=1";

            System.out.println("Query: " + query);
            System.out.println("URL: " + url);
            System.out.println("RapidAPI Key: " + rapidApiKey);

            HttpHeaders headers = new HttpHeaders();
            headers.set("X-RapidAPI-Key", rapidApiKey);
            headers.set("X-RapidAPI-Host", "real-time-amazon-data.p.rapidapi.com");

            HttpEntity<String> entity = new HttpEntity<>(headers);

            ResponseEntity<String> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    entity,
                    String.class
            );

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


    public List<ProductSearchResponseDto> searchProducts(String query) {
        ProductSearchRequestDto requestDto = new ProductSearchRequestDto();
        requestDto.setQuery(query);
        return searchAmazonProducts(requestDto);
    }
}
