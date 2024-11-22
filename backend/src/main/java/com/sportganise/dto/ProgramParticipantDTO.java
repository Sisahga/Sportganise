package com.sportganise.dto;

public class ProgramParticipantDTO {
    private Integer accountId;
    private String firstName;
    private String lastName;
    private String email;

    // Constructor
    public ProgramParticipantDTO(Integer accountId, String firstName, String lastName, String email) {
        this.accountId = accountId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
    }

    // Getters and setters for each fields
    public Integer getAccountId() {
        return accountId;
    }

    public void setAccountId(Integer accountId) {
        this.accountId = accountId;
    }

    public String getName() {
        return firstName+" "+lastName;
    }

    public void setName(String firstName, String lastName) {
        this.firstName = firstName;
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
