using Microsoft.AspNetCore.Mvc;

namespace AmitVermaDigital.Controllers;

public class ErrorController : Controller
{
    [Route("Error/Status")]
    public IActionResult Status(int code)
    {
        ViewBag.StatusCode = code;

        return code switch
        {
            404 => View("NotFound"),
            403 => View("AccessDenied"),
            _ => View("Generic")
        };
    }
}
