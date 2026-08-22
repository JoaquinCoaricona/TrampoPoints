package com.trampopoints.dto;

public class UpdateDriverRequestDto {
    private String name;
    private String lastName;
    private String email;
    private String phone;
    private String avatarUrl;

    public UpdateDriverRequestDto() {}

    public UpdateDriverRequestDto(String name, String lastName, String email, String phone, String avatarUrl) {
        this.name = name;
        this.lastName = lastName;
        this.email = email;
        this.phone = phone;
        this.avatarUrl = avatarUrl;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getAvatarUrl() {
        return avatarUrl;
    }

    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }
}
