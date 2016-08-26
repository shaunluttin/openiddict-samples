using System.Security.Claims;
using AspNet.Security.OAuth.Validation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Linq;

namespace Mvc.Server.Controllers {
    [Route("api")]
    public class ResourceController : Controller {
        [Authorize(ActiveAuthenticationSchemes = OAuthValidationDefaults.AuthenticationScheme)]
        [HttpGet("message")]
        public IActionResult GetMessage() {
            var identity = User.Identity as ClaimsIdentity;
            if (identity == null) {
                return BadRequest();
            }

            return Content($"ResourceServer2 says that you have authorized access to resources belonging to {identity.Name}.");
            
            // return Json(
            //    from claim in User.Claims
            //    select new { claim.Type, claim.Value }
            // );
        }

        [HttpGet("message-public")]
        public IActionResult GetMessagePublic() {
            return Content("");
        }    
    }
}
