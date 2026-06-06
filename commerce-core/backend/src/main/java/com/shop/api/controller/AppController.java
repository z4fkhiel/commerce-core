package com.shop.api.controller;
import com.shop.api.model.*;
import com.shop.api.repo.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class AppController {
    @Autowired UserRepo uRepo;
    @Autowired ProductRepo pRepo;

    @PostMapping("/auth/register")
    public ResponseEntity<?> reg(@RequestBody User u) {
        if(uRepo.existsByEmail(u.email)) return ResponseEntity.status(409).body("Email ocupado");
        return ResponseEntity.ok(uRepo.save(u));
    }

    @PostMapping("/auth/login")
    public ResponseEntity<?> login(@RequestBody Map<String,String> c) {
        Optional<User> u = uRepo.findByEmailAndPassword(c.get("email"), c.get("password"));
        if(u.isPresent()) return ResponseEntity.ok(u.get());
        return ResponseEntity.status(401).body("Credenciales invalidas");
    }

    @GetMapping("/products") public List<Product> getP() { return pRepo.findAll(); }

    @GetMapping("/users/{id}") public User getU(@PathVariable Long id) { return uRepo.findById(id).orElse(null); }     

    @PostMapping("/users/{uid}/buy/{pid}")
    public User buy(@PathVariable Long uid, @PathVariable Long pid) {
        User u = uRepo.findById(uid).orElseThrow();
        Product p = pRepo.findById(pid).orElseThrow();
        u.myProducts.add(p);
        return uRepo.save(u);
    }
}