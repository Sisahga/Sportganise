package com.sportganise.dto.productsearch;

public class ProductSearchResponseDto {
    private String title;
    private String imageUrl;
    private String price;
    private String seller;
    private String link;

    public ProductSearchResponseDto() {}

    public ProductSearchResponseDto(String title, String imageUrl, String price, String seller, String link) {
        this.title = title;
        this.imageUrl = imageUrl;
        this.price = price;
        this.seller = seller;
        this.link = link;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getPrice() {
        return price;
    }

    public void setPrice(String price) {
        this.price = price;
    }

    public String getSeller() {
        return seller;
    }

    public void setSeller(String seller) {
        this.seller = seller;
    }

    public String getLink() {
        return link;
    }

    public void setLink(String link) {
        this.link = link;
    }
}
