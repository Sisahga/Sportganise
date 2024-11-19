package com.sportganise.Controllers;

import com.sportganise.Entities.Account;
import com.sportganise.Services.AccountService;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST Controller for managing 'Account' Entities. Handles HTTP request and routes them to
 * appropriate services.
 */
@RestController
@RequestMapping("/api/account")
// TODO[246]: configure CORS policy
@CrossOrigin(origins = "*")
public class AccountController {
  private final AccountService accountService;

  @Autowired
  public AccountController(AccountService accountService) {
    this.accountService = accountService;
  }

  @GetMapping("/")
  public String index() {
    return "Welcome to Sportganise";
  }

  // GET: Account (1) by ID.
  @GetMapping("/{id}")
  public ResponseEntity<Optional<Account>> getAccount(@PathVariable Integer id) {
    return new ResponseEntity<>(this.accountService.getAccount(id), HttpStatus.OK);
  }
}
