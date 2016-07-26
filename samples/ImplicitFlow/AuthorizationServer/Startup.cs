using System.Linq;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using CryptoHelper;
using OpenIddict;

namespace Zamboni.AuthorizationServer
{
    public class Startup
    {
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddDbContext<ApplicationDbContext>(options =>
            {
                options.UseSqlite("Filename=./authorization.db");
            });

            services.AddIdentity<ApplicationUser, IdentityRole>()
                .AddEntityFrameworkStores<ApplicationDbContext>()
                .AddDefaultTokenProviders();

            // Register the OpenIddict services, including the default Entity Framework stores.
            services.AddOpenIddict<ApplicationUser, ApplicationDbContext>()

                // Enable the authorization, logout, token and userinfo endpoints.
                .EnableAuthorizationEndpoint("/connect/authorize")
                .EnableLogoutEndpoint("/connect/logout")
                .EnableUserinfoEndpoint("/connect/userinfo")

                // Note: the Mvc.Client sample only uses the authorization code flow but you can enable
                // the other flows if you need to support implicit, password or client credentials.
                .AllowImplicitFlow()

                // During development, you can disable the HTTPS requirement.
                .DisableHttpsRequirement()

                // Register a new ephemeral key, that is discarded when the application
                // shuts down. Tokens signed using this key are automatically invalidated.
                // This method should only be used during development.
                .AddEphemeralSigningKey();

            services.AddCors();
            services.AddMvc();

            services.AddTransient<IEmailSender, AuthMessageSender>();
            services.AddTransient<ISmsSender, AuthMessageSender>();
        }

        public void Configure(IApplicationBuilder app)
        {
            app.UseIdentity();
            app.UseOAuthValidation();

            app.UseCors(builder => builder
                .AllowAnyHeader()
                .AllowAnyOrigin()
                .AllowAnyMethod());

            app.UseOpenIddict();
            app.UseMvcWithDefaultRoute();

            // In a production app, seed this in a setup tool.
            SeedDatabase(app);
        }

        private void SeedDatabase(IApplicationBuilder app)
        {
            var options = app
                .ApplicationServices
                .GetRequiredService<DbContextOptions<ApplicationDbContext>>();

            using (var context = new ApplicationDbContext(options))
            {
                // drop and recreate
                context.Database.EnsureDeleted();
                context.Database.EnsureCreated();
                
                if (!context.Applications.Any())
                {
                    context.Applications.Add(new OpenIddictApplication
                    {
                        ClientId = "myClient",
                        ClientSecret = Crypto.HashPassword("secret_secret_secret"),
                        DisplayName = "My client application",
                        LogoutRedirectUri = "http://localhost:9000/signout-oidc",
                        RedirectUri = "http://localhost:9000/signin-oidc",
                        Type = OpenIddictConstants.ClientTypes.Public
                    });
                }

                context.SaveChanges();
            }
        }
    }
}