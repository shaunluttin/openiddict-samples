using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using NWebsec.AspNetCore.Middleware;

namespace Mvc.Server
{
    public class Startup
    {
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddMvc();
        }

        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            app.UseDeveloperExceptionPage();

            // Add a middleware used to validate access tokens and protect the API endpoints.
            // app.UseOAuthValidation();

            // Alternatively, you can also use the introspection middleware.
            // Using it is recommended if your resource server is in a
            // different application/separated from the authorization server.

            var authServerHost = env.IsDevelopment() 
                ? "http://localhost:12345"
                : "https://zamboni-auth.azurewebsites.net";

            app.UseOAuthIntrospection(options =>
            {
                options.AutomaticAuthenticate = true;
                options.AutomaticChallenge = true;
                options.Authority = authServerHost;
                options.Audiences.Add("ResourceServer02");
                options.ClientId = "ResourceServer02";
                options.ClientSecret = "secret_secret_secret";
            });

            app.UseCsp(options => options.DefaultSources(directive => directive.Self())
                .ImageSources(directive => directive.Self()
                    .CustomSources("*"))
                .ScriptSources(directive => directive.Self()
                    .UnsafeInline())
                .StyleSources(directive => directive.Self()
                    .UnsafeInline()));

            app.UseXContentTypeOptions();

            app.UseXfo(options => options.Deny());

            app.UseXXssProtection(options => options.EnabledWithBlockMode());

            app.UseStatusCodePagesWithReExecute("/error");

            app.UseCors(builder => builder
                .AllowAnyHeader()
                .AllowAnyOrigin()
                .AllowAnyMethod());            
            
            app.UseMvcWithDefaultRoute();
        }
    }
}
