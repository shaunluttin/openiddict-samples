using OpenIddict;
using Microsoft.EntityFrameworkCore;

namespace Zamboni.AuthorizationServer
{
    public class ApplicationDbContext : OpenIddictDbContext<ApplicationUser>
    {
        public ApplicationDbContext(DbContextOptions options) : base(options)
        {

        }
    }
}