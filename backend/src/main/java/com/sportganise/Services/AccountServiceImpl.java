package com.sportganise.Services;

import com.sportganise.Entities.Account;
import com.sportganise.Repositories.AccountRepository;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/** Implementation of AccountService */
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
}
