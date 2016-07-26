using System.ComponentModel.DataAnnotations;

namespace Zamboni.AuthorizationServer {
    public class ErrorViewModel {
        [Display(Name = "Error")]
        public string Error { get; set; }

        [Display(Name = "Description")]
        public string ErrorDescription { get; set; }
    }
}
