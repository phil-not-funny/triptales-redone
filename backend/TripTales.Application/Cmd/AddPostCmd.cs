using System;

namespace Triptales.Application.Cmd
{
        public record AddPostCmd(string Title, string Description, string StartDate, string EndDate);
}
