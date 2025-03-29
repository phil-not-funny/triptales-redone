using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Triptales.Application.Model;
using Triptales.Webapi.Infrastructure;

namespace proxreal_backend.Repository
{
    public class PostRepository : ICrudRepository<Post> 
    {
        private readonly TriptalesContext _db;

        public PostRepository(TriptalesContext db)
        {
            _db = db;
        }

        public void Delete(Post entity)
        {
            throw new NotImplementedException();
        }

        public Task<List<Post>> GetAll()
        {
            throw new NotImplementedException();
        }

        public Task<Post?> GetFromGuid(Guid guid)
        {
            throw new NotImplementedException();
        }

        public void Insert(Post entity)
        {
            throw new NotImplementedException();
        }

        public void Update(Post entity)
        {
            throw new NotImplementedException();
        }
    }
}
