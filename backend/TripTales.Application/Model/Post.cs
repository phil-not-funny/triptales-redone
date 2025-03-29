using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Triptales.Webapi.Model;

namespace Triptales.Application.Model
{
    public class Post : BaseEntity
    {
#pragma warning disable CS8618 // Non-nullable field must contain a non-null value when exiting constructor. Consider adding the 'required' modifier or declaring as nullable.
        protected Post() { }
#pragma warning restore CS8618 // Non-nullable field must contain a non-null value when exiting constructor. Consider adding the 'required' modifier or declaring as nullable.

        public Post(User user, string title, string content)
        {
            User = user;
            Title = title;
            Content = content;
            Created = DateTime.Now;
        }

        public User User { get; set; }

        [DataType(DataType.Text)]
        [MinLength(5, ErrorMessage = "Content does not meet Requirements. Min Length = 5")]
        public string Title { get; set; }
        
        [DataType(DataType.Text)]
        [MinLength(1, ErrorMessage = "Content does not meet Requirements. Min Length = 1")]
        public string Content { get; set; }
        public DateTime Created { get; set; }
        public int Likes { get; set; } = 0;
        public bool Edited { get; set; } = false;
    }
}
