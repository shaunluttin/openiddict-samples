using System.Threading.Tasks;

namespace Zamboni.AuthorizationServer {
    public interface IEmailSender {
        Task SendEmailAsync(string email, string subject, string message);
    }
}
