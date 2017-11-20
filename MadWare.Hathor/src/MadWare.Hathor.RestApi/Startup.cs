using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using MadWare.Hathor.RestApi.Services.Youtube;
using Microsoft.AspNetCore.Cors.Infrastructure;
using Microsoft.Extensions.Caching.Memory;
using MadWare.Hathor.RestApi.Services.HubManager;

namespace MadWare.Hathor.RestApi
{
    public class Startup
    {
        public Startup(IHostingEnvironment env)
        {
            var builder = new ConfigurationBuilder()
                .SetBasePath(env.ContentRootPath)
                .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
                .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true)
                .AddEnvironmentVariables();
            Configuration = builder.Build();
        }

        public IConfigurationRoot Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddCors();
            var policy = new CorsPolicy();

            // Add framework services.
            services.AddMemoryCache();
            services.AddMvc();

            services.AddSignalR(options => options.Hubs.EnableDetailedErrors = true);

            services.AddDataProtection(opt => opt.ApplicationDiscriminator = "hathor");

            //app services
            services.AddScoped(typeof(IHubManager), typeof(HubManager));
            services.AddSingleton<IYoutubeService>((serviceProvider) => {
                return new YoutubeService(Configuration["YouTube:ApiKey"], "Hathor", serviceProvider.GetService<IMemoryCache>());
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
        {
            app.UseCors(builder => {
                builder
                .AllowCredentials()
                .AllowAnyOrigin()
                .AllowAnyMethod()
                .AllowAnyHeader();
            });

            loggerFactory.AddConsole(Configuration.GetSection("Logging"));
            loggerFactory.AddDebug();

            app.UseWebSockets();
            app.UseSignalR();
            app.UseMvc();
            
        }
    }
}
