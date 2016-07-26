using System.ComponentModel.DataAnnotations;

namespace Zamboni.AuthorizationServer {
    public class ForgotPasswordViewModel {
        [Required]
        [EmailAddress]
        public string Email { get; set; }
    }
}
