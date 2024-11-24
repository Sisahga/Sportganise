package com.sportganise.services;

import com.sportganise.entities.Account;
import com.sportganise.repositories.AccountRepository;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Implementation of AccountService.
 */
@Service
public class AccountService {
    private final AccountRepository accountRepository;

    @Autowired
    public AccountService(AccountRepository accountRepository) {
        this.accountRepository = accountRepository;
    }

    /**
     * Gets an Account by Id.
     *
     * @param accountId Id of the account to retrieve
     * @return Account object if exists, null if not.
     */
    public Optional<Account> getAccount(int accountId) {
        return accountRepository.findById(accountId);
    }
}

