using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Triptales.Application.Cmd
{
    public record AddCommentCmd(Guid? Parent, string Content);
}
