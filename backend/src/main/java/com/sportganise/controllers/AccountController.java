package com.sportganise.controllers;

import com.sportganise.dto.accounts.UpdateAccountDto;
import com.sportganise.entities.Account;
import com.sportganise.exceptions.ResourceNotFoundException;
import com.sportganise.services.auth.AccountService;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST Controller for managing 'Account' Entities. Handles HTTP request and routes them to
 * appropriate services.
 */
@RestController
@RequestMapping("/api/account")
public class AccountController {

  @Autowired private AccountService accountService;

  @GetMapping("/")
  public String index() {
    return "Welcome to Sportganise";
  }

  // GET: Account (1) by ID.
  @GetMapping("/{id}")
  public ResponseEntity<Optional<Account>> getAccount(@PathVariable Integer id) {
    return new ResponseEntity<>(this.accountService.getAccount(id), HttpStatus.OK);
  }

  @PutMapping("/{id}")
  public ResponseEntity<Void> updateAccount(
      @PathVariable Integer id, @RequestBody UpdateAccountDto body) {

    try {
      this.accountService.updateAccount(id, body);
    } catch (ResourceNotFoundException e) {
      return ResponseEntity.notFound().build();
    }

    return ResponseEntity.ok().build();
  }
}
