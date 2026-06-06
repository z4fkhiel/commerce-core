package com.shop.api;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import com.shop.api.repo.ProductRepo;
import com.shop.api.model.Product;
import java.util.List;

@SpringBootApplication
public class ApiApplication {
    public static void main(String[] args) { SpringApplication.run(ApiApplication.class, args); }

    @Bean
    CommandLineRunner initDatabase(ProductRepo repo) {
        return args -> {
            if (repo.count() == 0) {
                repo.saveAll(List.of(
                    new Product("iPhone 15 Pro", 1200.0, "Apple"),
                    new Product("Samsung S24", 900.0, "Samsung"),
                    new Product("MacBook Air", 1100.0, "Apple"),
                    new Product("Monitor Dell 27", 250.0, "Dell"),
                    new Product("Teclado Logitech", 40.0, "Logitech")
                ));
            }
        };
    }
}