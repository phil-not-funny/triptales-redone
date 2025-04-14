using System;
using System.Collections.Generic;

namespace Triptales.Application.Cmd
{
        public record AddPostCmd(string Title, string Description, string StartDate, string EndDate, List<AddPostDayCmd> Days);
        public record AddPostDayCmd(string Title, string Description, string Date);
}
