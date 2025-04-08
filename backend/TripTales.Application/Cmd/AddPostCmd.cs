using System;

namespace Triptales.Application.Cmd
{
        public record AddPostCmd(string Title, string Description, Guid AuthorGuid, string StartDate, string EndDate);
}
