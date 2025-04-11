package com.sportganise.dto.productsearch;

/** Represents a product returned from a product search, including key display fields. */
public class ProductSearchResponseDto {
  private String title;
  private String imageUrl;
  private String price;
  private String seller;
  private String link;

  public ProductSearchResponseDto() {}

  /**
   * Constructs a ProductSearchResponseDto with all fields.
   *
   * @param title the title of the product
   * @param imageUrl the image URL of the product
   * @param price the price of the product
   * @param seller the seller of the product
   * @param link the link to the product
   */
  public ProductSearchResponseDto(
      String title, String imageUrl, String price, String seller, String link) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.price = price;
    this.seller = seller;
    this.link = link;
  }

  public String getTitle() {
    return title;
  }

  /**
   * Sets the title of the product.
   *
   * @param title the product title
   */
  public void setTitle(String title) {
    this.title = title;
  }

  public String getImageUrl() {
    return imageUrl;
  }

  /**
   * Sets the image of the product.
   *
   * @param imageUrl the product image
   */
  public void setImageUrl(String imageUrl) {
    this.imageUrl = imageUrl;
  }

  public String getPrice() {
    return price;
  }

  /**
   * Sets the price of the product.
   *
   * @param price the product price
   */
  public void setPrice(String price) {
    this.price = price;
  }

  public String getSeller() {
    return seller;
  }

  /**
   * Sets the seller of the product.
   *
   * @param seller the product seller
   */
  public void setSeller(String seller) {
    this.seller = seller;
  }

  public String getLink() {
    return link;
  }

  /**
   * Sets the link of the product.
   *
   * @param link the product link
   */
  public void setLink(String link) {
    this.link = link;
  }
}
