using System;

namespace Triptales.Webapi.Cmd
{
        public record AddPostCmd(string Title, string Description, Guid AuthorGuid, string StartDate, string EndDate);
}
