using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Triptales.Application.Model;

namespace proxreal_backend.Repository
{
    public interface ICrudRepository<T> where T : BaseEntity
    {
        Task<List<T>> GetAll();
        void Insert(T entity);
        void Update(T entity);
        void Delete(T entity);
        Task<T?> GetFromGuid(Guid guid);
    }
}
