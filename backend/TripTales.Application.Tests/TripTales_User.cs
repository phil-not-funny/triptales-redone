using Xunit;
using Triptales.Webapi.Model;

namespace Triptales.Webapi.UnitTests
{
    public class TripTales_UserCreation
    {
        const string USER_NAME = "max"; 
        const string EMAIL = "max.mustermann@edu.com"; 
        const string VALID_PASSWORD = "n71f~DFm3.Wf"; 
        const string WRONG_PASSWORD = "fW59E8}u&y*r"; 
        const string DISPLAY_NAME = "max77"; 

        [Fact]
        public void UserIsCreated_PasswordIsCheckedWithValidPassword_PasswordIsCorrect()
        {
            // Given
            User user = new User(USER_NAME, EMAIL, VALID_PASSWORD, DISPLAY_NAME);

            // When +Then
            Assert.True(user.CheckPassword(VALID_PASSWORD), "Password should be correct");
        }

        [Fact]
        public void UserIsCreated_PasswordIsCheckedWithWrongPassword_PasswordIsIncorrect()
        {
            // When
            User user = new User(USER_NAME, EMAIL, VALID_PASSWORD, DISPLAY_NAME);

            // Then
            Assert.False(user.CheckPassword(WRONG_PASSWORD), "Password should be incorrect");
        }
    }

}
