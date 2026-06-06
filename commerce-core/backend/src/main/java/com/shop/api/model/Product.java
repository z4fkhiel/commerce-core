package com.shop.api.model;
import jakarta.persistence.*;

@Entity
@Table(name="products")
public class Product {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
    public Long id;
    public String name;
    public Double price;
    public String brand;
    
    public Product(){}
    public Product(String n, Double p, String b){
        this.name=n; this.price=p; this.brand=b;
    }
}