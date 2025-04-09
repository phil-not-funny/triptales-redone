using Triptales.Application.Dtos;
using Triptales.Application.Model;
using Triptales.Webapi.Infrastructure;

namespace Triptales.Application.Services
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
