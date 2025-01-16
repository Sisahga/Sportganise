package com.sportganise.services.account;

import com.sportganise.dto.account.CookiesDto;
import com.sportganise.entities.account.Account;
import com.sportganise.exceptions.AccountNotFoundException;
import java.util.List;
import org.springframework.stereotype.Service;

/** Service for creating cookies DTOs. */
@Service
public class CookiesService {

  private final AccountService accountService;

  /**
   * Constructor for the CookiesService.
   *
   * @param accountService AccountService object.
   */
  public CookiesService(AccountService accountService) {
    this.accountService = accountService;
  }

  /**
   * Creates a CookiesDto object.
   *
   * @param accountId Account ID.
   * @param firstName First name.
   * @param lastName Last name.
   * @param email Email.
   * @param pictureUrl Picture URL.
   * @param type Account type.
   * @param phone Phone number.
   * @return CookiesDto object.
   */
  public CookiesDto createCookiesDto(
      int accountId,
      String firstName,
      String lastName,
      String email,
      String pictureUrl,
      String type,
      String phone) {

    List<Integer> organizationIds = accountService.getOrganizationIdsByAccountId(accountId);

    return CookiesDto.builder()
        .accountId(accountId)
        .firstName(firstName)
        .lastName(lastName)
        .email(email)
        .pictureUrl(pictureUrl)
        .type(type)
        .phone(phone)
        .organisationIds(organizationIds)
        .build();
  }

  /**
   * Creates a CookiesDto object.
   *
   * @param email Email.
   * @return CookiesDto object.
   * @throws AccountNotFoundException If the account is not found.
   */
  public CookiesDto createCookiesDto(String email) throws AccountNotFoundException {
    Account account = accountService.getAccountByEmail(email);
    return createCookiesDto(
        account.getAccountId(),
        account.getFirstName(),
        account.getLastName(),
        email,
        account.getPictureUrl(),
        account.getType(),
        account.getPhone());
  }
}
