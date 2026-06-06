package com.shop.api.model;
import jakarta.persistence.*;
import java.util.*;

@Entity
@Table(name="users") 
public class User {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
    public Long id;
    
    @Column(unique=true) 
    public String email;
    public String password;
    public String name;
    
    @ManyToMany(fetch=FetchType.EAGER)
    public List<Product> myProducts = new ArrayList<>();
}