package com.sportganise.Controllers;

import com.sportganise.Services.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST Controller for managing 'Account' Entities.
 * Handles HTTP request and routes them to appropriate services.
 */
@RestController
@RequestMapping("/api/account")
// TODO[246]: configure CORS policy
@CrossOrigin(origins = "*")
public class AccountController {
    @GetMapping("/")
    public String index() {
        return "Welcome to Sportganise";
    }
}