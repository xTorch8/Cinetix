﻿using System.ComponentModel.DataAnnotations;

namespace Cinetix.DTO.Users
{
    public class DTORegister
    {
        [Required]
        public string FirstName { get; set; }

        public string? LastName { get; set; }

        [Required]
        public string Email { get; set; }

        [Required]
        public string Password { get; set; }

        [Required]
        public string ConfirmPassword { get; set; }
    }
}
