using System.ComponentModel.DataAnnotations;

namespace Zamboni.AuthorizationServer {
    public class ExternalLoginConfirmationViewModel
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }
    }
}
