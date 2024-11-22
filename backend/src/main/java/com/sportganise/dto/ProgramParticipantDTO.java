package com.sportganise.dto;

import com.sportganise.entities.Role;

public class ProgramParticipantDTO {
  private Integer accountId;
  private Role type;
  private String email;
  private String address;
  private String phone;
  private String firstName;
  private String lastName;

  // Constructor
  public ProgramParticipantDTO(
      Integer accountId,
      Role type,
      String email,
      String address,
      String phone,
      String firstName,
      String lastName) {
    this.accountId = accountId;
    this.type = type;
    this.email = email;
    this.address = address;
    this.phone = phone;
    this.firstName = firstName;
    this.lastName = lastName;
  }

  // Getters and setters for each fields
  public Integer getAccountId() {
    return accountId;
  }

  public void setAccountId(Integer accountId) {
    this.accountId = accountId;
  }

  public Role getType() {
    return type;
  }

  public void setType(Role type) {
    this.type = type;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public String getAddress() {
    return address;
  }

  public void setAddress(String address) {
    this.address = address;
  }

  public String getPhone() {
    return phone;
  }

  public void setPhone(String phone) {
    this.phone = phone;
  }

  public String getName() {
    return firstName + " " + lastName;
  }

  public void setName(String firstName, String lastName) {
    this.firstName = firstName;
    this.lastName = lastName;
  }
}
