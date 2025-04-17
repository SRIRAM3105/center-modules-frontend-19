
package com.communitysolar.dto.auth;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Email;
import lombok.Data;

@Data
public class LoginRequest {
    @NotBlank
    @Email(message = "Please enter a valid email address")
    private String email;

    @NotBlank
    private String password;
}
