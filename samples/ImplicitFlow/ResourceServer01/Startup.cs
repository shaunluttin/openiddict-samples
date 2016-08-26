using Microsoft.AspNetCore.Builder;
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

        public void Configure(IApplicationBuilder app)
        {
            app.UseDeveloperExceptionPage();

            app.UseStaticFiles();

            // Add a middleware used to validate access tokens and protect the API endpoints.
            // app.UseOAuthValidation();

            // Alternatively, you can also use the introspection middleware.
            // Using it is recommended if your resource server is in a
            // different application/separated from the authorization server.

            app.UseOAuthIntrospection(options =>
            {
                options.AutomaticAuthenticate = true;
                options.AutomaticChallenge = true;
                options.Authority = "http://localhost:12345/";
                options.Audiences.Add("ResourceServer01");
                options.ClientId = "ResourceServer01";
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
