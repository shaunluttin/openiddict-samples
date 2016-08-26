using System.Linq;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using CryptoHelper;
using OpenIddict;
using Microsoft.Extensions.Configuration;
using System;
using Mvc.Server.Models;
using Mvc.Server.Services;

namespace Mvc.Server
{
    public class Startup
    {
        public void ConfigureServices(IServiceCollection services)
        {
            var configuration = new ConfigurationBuilder()
                        .AddJsonFile("config.json")
                        .AddEnvironmentVariables()
                        .Build();

            services.AddDbContext<ApplicationDbContext>(options =>
                options.UseSqlServer(configuration["Data:DefaultConnection:ConnectionString"]));

            services.AddIdentity<ApplicationUser, IdentityRole<Guid>>()
                .AddEntityFrameworkStores<ApplicationDbContext, Guid>()
                .AddDefaultTokenProviders();

            // Register the OpenIddict services, including the default Entity Framework stores.
            services.AddOpenIddict<ApplicationUser, IdentityRole<Guid>, ApplicationDbContext, Guid>()

                // Enable the authorization, logout, token and userinfo endpoints.
                .EnableAuthorizationEndpoint("/connect/authorize")
                .EnableLogoutEndpoint("/connect/logout")
                .EnableUserinfoEndpoint("/connect/userinfo")
                .EnableIntrospectionEndpoint("/connect/introspect")

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

        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILogger<Startup> logger)
        {
            // Set the Environment e.g. via PowerShell> $env:ASPNETCORE_ENVIRONMENT="Development"
            logger.LogInformation(env.EnvironmentName);

            app.UseIdentity();
            app.UseOAuthValidation();

            app.UseCors(builder => builder
                .AllowAnyHeader()
                .AllowAnyOrigin()
                .AllowAnyMethod());

            app.UseOpenIddict();
            app.UseMvcWithDefaultRoute();

            // In a production app, seed this in a setup tool.
            SeedDatabase(app, env);
        }

        private void SeedDatabase(IApplicationBuilder app, IHostingEnvironment env)
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
                    var aureliaOidcHost = env.IsDevelopment()
                            ? "localhost:9000"
                            : "TODO.azurewebsites.net";

                    context.Applications.Add(new OpenIddictApplication<Guid>
                    {
                        ClientId = "Aurelia.OidcClientJs",
                        ClientSecret = Crypto.HashPassword("secret_secret_secret"),
                        DisplayName = "Aurelia Oidc Client Js",
                        LogoutRedirectUri = $"http://{aureliaOidcHost}/signout-oidc",
                        RedirectUri = $"http://{aureliaOidcHost}/signin-oidc",
                        Type = OpenIddictConstants.ClientTypes.Public
                    });

                    var oidcClientHost = env.IsDevelopment()
                           ? "localhost:5000"
                           : "TODO.azurewebsites.net";

                    context.Applications.Add(new OpenIddictApplication<Guid>
                    {
                        ClientId = "OidcClientJs.OidcClient",
                        ClientSecret = Crypto.HashPassword("secret_secret_secret"),
                        DisplayName = "Oidc Client Js - Oidc Client Sample",
                        LogoutRedirectUri = $"http://{oidcClientHost}/oidc-client-sample.html",
                        RedirectUri = $"http://{oidcClientHost}/oidc-client-sample.html",
                        Type = OpenIddictConstants.ClientTypes.Public
                    });

                    context.Applications.Add(new OpenIddictApplication<Guid>
                    {
                        ClientId = "OidcClientJs.UserManager",
                        ClientSecret = Crypto.HashPassword("secret_secret_secret"),
                        DisplayName = "Oidc Client Js - User Manager Sample",
                        LogoutRedirectUri = $"http://{oidcClientHost}/user-manager-sample.html",
                        RedirectUri = $"http://{oidcClientHost}/user-manager-sample.html",
                        Type = OpenIddictConstants.ClientTypes.Public
                    });

                    context.Applications.Add(new OpenIddictApplication<Guid>
                    {
                        ClientId = "ResourceServer01",
                        ClientSecret = Crypto.HashPassword("secret_secret_secret"),
                        Type = OpenIddictConstants.ClientTypes.Confidential
                    });

                    // TODO Consider using JWT or Validation for ResourceServer02, 
                    // TODO because we used introspection for ResourceServer01
                    context.Applications.Add(new OpenIddictApplication<Guid>
                    {
                        ClientId = "ResourceServer02",
                        ClientSecret = Crypto.HashPassword("secret_secret_secret"),
                        Type = OpenIddictConstants.ClientTypes.Confidential
                    });      
                }

                context.SaveChanges();
            }
        }
    }
}
