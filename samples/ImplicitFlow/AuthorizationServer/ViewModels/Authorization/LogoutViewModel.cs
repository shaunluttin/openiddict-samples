using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace Zamboni.AuthorizationServer {
    public class LogoutViewModel {
        [BindNever]
        public string RequestId { get; set; }
    }
}
