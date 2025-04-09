using Triptales.Webapi.Dtos;
using Triptales.Webapi.Model;
using Triptales.Webapi.Infrastructure;

namespace Triptales.Webapi.Services
{
    public class PostService
    {
        private readonly TripTalesContext _db;

        public PostService(TripTalesContext db)
        {
            _db = db;
        }
    }
}
