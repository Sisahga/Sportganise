package com.sportganise.Controllers;

import com.sportganise.Services.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/api/user")
// TODO[246]: configure CORS policy
@CrossOrigin(origins = "*")
public class AccountController {
    // Use keyword 'final' for immutability in the service
    private final AccountService accountService;
    @Autowired
    public AccountController(AccountService accountService) {
        this.accountService = accountService;
    }
}
