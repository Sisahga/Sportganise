package com.sportganise.services;

import com.sportganise.entities.Account;
import java.util.Optional;

/** Service Interface for 'Account' entity. Defines C.R.U.D. operations. */
public interface AccountService {
  Optional<Account> getAccount(int accountId);
}
