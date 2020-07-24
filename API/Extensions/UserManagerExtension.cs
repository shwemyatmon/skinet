using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Core.Entities.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace API.Extensions
{
    public static class UserManagerExtension
    {
        public static async Task<AppUser> FindByUserByClaimsPrincipalWithAddressAsync(this UserManager<AppUser> 
        input,ClaimsPrincipal user){
           var email= user?.Claims.FirstOrDefault(x => x.Type == ClaimTypes.Email)?.Value;

           return await input.Users.Include(u => u.Address).SingleOrDefaultAsync(u => u.Email == email);
        }

        public static async Task<AppUser> FindByEmailFromClaimPrincipal(this UserManager<AppUser> input,
        ClaimsPrincipal user) {
             var email= user?.Claims.FirstOrDefault(x => x.Type == ClaimTypes.Email)?.Value;

           return await input.Users.SingleOrDefaultAsync(u => u.Email == email);
        }
    }
}