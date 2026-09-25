using System.Collections.Generic;
using System.Linq;

namespace Triptales.Application.Model
{
    /// <summary>
    /// Helpers for many-to-many collections of entities (likes, followers).
    /// </summary>
    public static class EntityCollectionExtensions
    {
        /// <summary>
        /// Removes <paramref name="entity"/> from the collection if an entity with the same
        /// <see cref="BaseEntity.Guid"/> is already contained, otherwise adds it.
        /// </summary>
        public static void Toggle<T>(this ICollection<T> collection, T entity) where T : BaseEntity
        {
            if (collection.Any(e => e.Guid == entity.Guid))
                collection.Remove(entity);
            else
                collection.Add(entity);
        }
    }
}
