package com.sportganise.services;

import com.sportganise.entities.Account;
import com.sportganise.entities.Role;
import com.sportganise.repositories.AccountRepository;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/** Implementation of AccountService. */
@Service
public class AccountServiceImpl implements AccountService {
  private final AccountRepository accountRepository;

  @Autowired
  public AccountServiceImpl(AccountRepository accountRepository) {
    this.accountRepository = accountRepository;
  }

  @Override
  public Optional<Account> getAccount(int accountId) {
    return accountRepository.findById(accountId);
  }

  /** Method to check if user has permissions role. */
  public boolean hasPermissions(Role type) {
    if (type == Role.ADMIN || type == Role.COACH) {
      return true;
    } else {
      return false;
    }
  }
}
