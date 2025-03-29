using Microsoft.AspNetCore.Mvc;
using proxreal_backend.Repository;
using Triptales.Application.Services;
using Triptales.Webapi.Infrastructure;

namespace Triptales.Webapi.Controllers
{
    [ApiController]
    [Route("/api/[controller]")]
    public class PostController : ControllerBase
    {
        private readonly TriptalesContext _db;
        private readonly UserService _service;
        private readonly UserRepository _repo;

        public PostController(TriptalesContext db)
        {
            _db = db;
            _repo = new UserRepository(db);
            _service = new UserService(db);
        }
    }
}
