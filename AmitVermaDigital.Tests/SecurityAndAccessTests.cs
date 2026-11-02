using AmitVermaDigital.Areas.Admin.Controllers;
using AmitVermaDigital.Controllers;
using AmitVermaDigital.Services;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging.Abstractions;
using System.Reflection;
using System.Security.Claims;

namespace AmitVermaDigital.Tests;

public class SecurityAndAccessTests
{
    [Theory]
    [InlineData(typeof(DashboardController))]
    [InlineData(typeof(AmitVermaDigital.Areas.Admin.Controllers.PromptsController))]
    [InlineData(typeof(SettingsController))]
    [InlineData(typeof(VideosController))]
    [InlineData(typeof(MessagesController))]
    public void AdminControllers_RequireAdminRoleAuthorization(Type controllerType)
    {
        var authAttr = controllerType.GetCustomAttribute<AuthorizeAttribute>();
        Assert.NotNull(authAttr);
        Assert.Equal("Admin", authAttr.Roles);
    }

    [Theory]
    [InlineData(typeof(DashboardController))]
    [InlineData(typeof(AmitVermaDigital.Areas.Admin.Controllers.PromptsController))]
    [InlineData(typeof(SettingsController))]
    [InlineData(typeof(VideosController))]
    [InlineData(typeof(MessagesController))]
    public void AdminControllers_DoNotAllowAnonymousAccessOnAnyAction(Type controllerType)
    {
        var methods = controllerType.GetMethods(BindingFlags.Instance | BindingFlags.Public | BindingFlags.DeclaredOnly);
        foreach (var method in methods)
        {
            var allowAnon = method.GetCustomAttribute<AllowAnonymousAttribute>();
            Assert.Null(allowAnon);
        }
    }

    [Fact]
    public void AccountController_DoesNotExposePublicRegistration()
    {
        var methods = typeof(AccountController).GetMethods(BindingFlags.Instance | BindingFlags.Public | BindingFlags.DeclaredOnly);
        var registerMethod = methods.FirstOrDefault(m => m.Name.Contains("Register", StringComparison.OrdinalIgnoreCase)
                                                      || m.Name.Contains("SignUp", StringComparison.OrdinalIgnoreCase));
        Assert.Null(registerMethod);
    }

    [Fact]
    public void AccountController_Logout_RequiresAuthorization()
    {
        var logoutMethod = typeof(AccountController).GetMethod("Logout");
        Assert.NotNull(logoutMethod);
        var authAttr = logoutMethod.GetCustomAttribute<AuthorizeAttribute>();
        Assert.NotNull(authAttr);
    }

    [Fact]
    public void AccountController_Login_WhenUnauthenticated_ReturnsViewResult()
    {
        var authServiceMock = new DummyAdminAuthService();
        var controller = new AccountController(authServiceMock, NullLogger<AccountController>.Instance)
        {
            ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext()
            }
        };

        var result = controller.Login(returnUrl: "/Admin");

        var viewResult = Assert.IsType<ViewResult>(result);
        Assert.NotNull(viewResult);
        Assert.Equal("/Admin", controller.ViewData["ReturnUrl"]);
    }

    [Fact]
    public void AccountController_Login_WhenAuthenticatedAdmin_RedirectsToDashboard()
    {
        var authServiceMock = new DummyAdminAuthService();
        var user = new ClaimsPrincipal(new ClaimsIdentity(new[]
        {
            new Claim(ClaimTypes.Name, "admin@domain.com"),
            new Claim(ClaimTypes.Role, "Admin")
        }, "Cookies"));

        var httpContext = new DefaultHttpContext { User = user };
        var controller = new AccountController(authServiceMock, NullLogger<AccountController>.Instance)
        {
            ControllerContext = new ControllerContext { HttpContext = httpContext }
        };

        var result = controller.Login(returnUrl: null);

        var redirectResult = Assert.IsType<RedirectToActionResult>(result);
        Assert.Equal("Index", redirectResult.ActionName);
        Assert.Equal("Dashboard", redirectResult.ControllerName);
        Assert.Equal("Admin", redirectResult.RouteValues?["area"]);
    }

    [Fact]
    public async Task AccountController_Login_Post_InvalidModel_ReturnsViewWithModel()
    {
        var authServiceMock = new DummyAdminAuthService();
        var controller = new AccountController(authServiceMock, NullLogger<AccountController>.Instance)
        {
            ControllerContext = new ControllerContext { HttpContext = new DefaultHttpContext() }
        };
        controller.ModelState.AddModelError("Username", "Required");

        var model = new AmitVermaDigital.Models.ViewModels.LoginViewModel { Username = "", Password = "" };
        var result = await controller.Login(model);

        var viewResult = Assert.IsType<ViewResult>(result);
        Assert.Same(model, viewResult.Model);
    }

    [Fact]
    public async Task AccountController_Login_Post_InvalidCredentials_AddsModelError()
    {
        var authServiceMock = new DummyAdminAuthService { ShouldSucceed = false, ErrorMessage = "Invalid credentials. 4 attempt(s) remaining." };
        var controller = new AccountController(authServiceMock, NullLogger<AccountController>.Instance)
        {
            ControllerContext = new ControllerContext { HttpContext = new DefaultHttpContext() }
        };

        var model = new AmitVermaDigital.Models.ViewModels.LoginViewModel { Username = "wrong@admin.com", Password = "bad" };
        var result = await controller.Login(model);

        var viewResult = Assert.IsType<ViewResult>(result);
        Assert.False(controller.ModelState.IsValid);
        Assert.True(controller.ModelState.ContainsKey(string.Empty));
        var error = controller.ModelState[string.Empty]!.Errors.First();
        Assert.Equal("Invalid credentials. 4 attempt(s) remaining.", error.ErrorMessage);
    }

    [Fact]
    public async Task AccountController_Login_Post_ValidCredentials_SignsInAndRedirectsToAdmin()
    {
        var authServiceMock = new DummyAdminAuthService { ShouldSucceed = true };
        var testAuth = new TestAuthenticationService();

        var services = new ServiceCollection();
        services.AddSingleton<Microsoft.AspNetCore.Authentication.IAuthenticationService>(testAuth);
        var serviceProvider = services.BuildServiceProvider();

        var httpContext = new DefaultHttpContext { RequestServices = serviceProvider };
        var controller = new AccountController(authServiceMock, NullLogger<AccountController>.Instance)
        {
            ControllerContext = new ControllerContext
            {
                HttpContext = httpContext,
                RouteData = new Microsoft.AspNetCore.Routing.RouteData()
            },
            Url = new DummyUrlHelper()
        };

        var model = new AmitVermaDigital.Models.ViewModels.LoginViewModel { Username = "admin@domain.com", Password = "CorrectPassword1!" };
        var result = await controller.Login(model);

        Assert.NotNull(testAuth.SignedInPrincipal);
        Assert.True(testAuth.SignedInPrincipal.IsInRole("Admin"));
        Assert.Equal("admin@domain.com", testAuth.SignedInPrincipal.Identity?.Name);

        var redirectResult = Assert.IsType<RedirectToActionResult>(result);
        Assert.Equal("Index", redirectResult.ActionName);
        Assert.Equal("Dashboard", redirectResult.ControllerName);
        Assert.Equal("Admin", redirectResult.RouteValues?["area"]);
    }

    [Fact]
    public async Task AccountController_Logout_SignsOutUserAndRedirectsToHome()
    {
        var authServiceMock = new DummyAdminAuthService();
        var testAuth = new TestAuthenticationService();

        var services = new ServiceCollection();
        services.AddSingleton<Microsoft.AspNetCore.Authentication.IAuthenticationService>(testAuth);
        var serviceProvider = services.BuildServiceProvider();

        var httpContext = new DefaultHttpContext { RequestServices = serviceProvider };
        var controller = new AccountController(authServiceMock, NullLogger<AccountController>.Instance)
        {
            ControllerContext = new ControllerContext
            {
                HttpContext = httpContext,
                RouteData = new Microsoft.AspNetCore.Routing.RouteData()
            },
            Url = new DummyUrlHelper()
        };

        var result = await controller.Logout();

        Assert.True(testAuth.SignedOut);
        var redirectResult = Assert.IsType<RedirectToActionResult>(result);
        Assert.Equal("Index", redirectResult.ActionName);
        Assert.Equal("Home", redirectResult.ControllerName);
    }

    private class DummyUrlHelper : IUrlHelper
    {
        public ActionContext ActionContext { get; set; } = new();
        public string? Action(Microsoft.AspNetCore.Mvc.Routing.UrlActionContext actionContext) => "/mock-action";
        public string? Content(string? contentPath) => contentPath;
        public bool IsLocalUrl(string? url) => url != null && url.StartsWith("/");
        public string? Link(string? routeName, object? values) => "/mock-link";
        public string? RouteUrl(Microsoft.AspNetCore.Mvc.Routing.UrlRouteContext routeContext) => "/mock-route";
    }

    private class TestAuthenticationService : Microsoft.AspNetCore.Authentication.IAuthenticationService
    {
        public ClaimsPrincipal? SignedInPrincipal { get; private set; }
        public bool SignedOut { get; private set; }

        public Task<AuthenticateResult> AuthenticateAsync(HttpContext context, string? scheme)
            => Task.FromResult(AuthenticateResult.NoResult());

        public Task ChallengeAsync(HttpContext context, string? scheme, AuthenticationProperties? properties)
            => Task.CompletedTask;

        public Task ForbidAsync(HttpContext context, string? scheme, AuthenticationProperties? properties)
            => Task.CompletedTask;

        public Task SignInAsync(HttpContext context, string? scheme, ClaimsPrincipal principal, AuthenticationProperties? properties)
        {
            SignedInPrincipal = principal;
            return Task.CompletedTask;
        }

        public Task SignOutAsync(HttpContext context, string? scheme, AuthenticationProperties? properties)
        {
            SignedOut = true;
            return Task.CompletedTask;
        }
    }

    private class DummyAdminAuthService : IAdminAuthService
    {
        public bool IsConfigured => true;
        public string? AdminEmail => "admin@domain.com";
        public bool ShouldSucceed { get; set; } = true;
        public string? ErrorMessage { get; set; }
        public bool IsLockedOut(string clientIp, out TimeSpan? remainingTime) { remainingTime = null; return false; }
        public Task<(bool Success, string? ErrorMessage, bool IsLockedOut)> ValidateCredentialsAsync(string usernameOrEmail, string password, string clientIp)
            => Task.FromResult((ShouldSucceed, ErrorMessage, false));
        public string HashPassword(string password) => "HASH";
        public bool VerifyPassword(string password, string hashedPassword) => true;
    }
}
