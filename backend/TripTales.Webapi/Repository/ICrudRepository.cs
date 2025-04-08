using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Triptales.Application.Model;

namespace Triptales.Repository
{
    public interface ICrudRepository<T> where T : BaseEntity
    {
        Task<List<T>> GetAll();
        Task<bool> Insert(T entity);
        Task<bool> Update(T entity);
        Task<bool> Delete(Guid guid);
        Task<T?> GetFromGuid(Guid guid);
    }
}
