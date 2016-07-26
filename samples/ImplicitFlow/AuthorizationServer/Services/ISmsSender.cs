using System.Threading.Tasks;

namespace Zamboni.AuthorizationServer {
    public interface ISmsSender {
        Task SendSmsAsync(string number, string message);
    }
}
