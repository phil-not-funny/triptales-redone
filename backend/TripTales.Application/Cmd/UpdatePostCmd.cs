using System.Collections.Generic;

namespace Triptales.Application.Cmd
{
    public record UpdatePostCmd(string Title, string Description, string StartDate, string EndDate, List<string> Pictures, List<UpdatePostDayCmd> Days);

    public record UpdatePostDayCmd(string Title, string Description, string Date, List<string> Pictures);

}
