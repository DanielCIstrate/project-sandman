package com.codecool.demo.model;

public enum UserRole {
    ADMIN,
    USER;

    @Override
    public String toString() {
        return  "ROLE_"+this.name();
        // "ROLE_ADMIN", "ROLE_USER" are special strings in Spring Security
    }

    public String toNoPrefixString() {
        return this.name();     // sometimes we need the version without the "ROLE_" prefix
    }
}