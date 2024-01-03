using System.Security.Cryptography;
using System.Text;

namespace Cinetix.Helper
{
    public class Hashing
    {
        // ComputeHash
        // Encrypts a string using SHA_256 algorithm
        // 
        // Parameter 
        //  input:
        //      The string that will be hashed using SHA_256 algorithm
        //
        // Return:
        //  The hashed string
        //
        // Process:
        //  This function will convert input into array of bytes
        //  The reason for that is the algorithm operates on array of bytes
        //  After that, the array of bytes will be hashed
        public static byte[] ComputeHash(string input)
        {
            using (SHA256 sha256 = SHA256.Create())
            {
                return sha256.ComputeHash(Encoding.UTF8.GetBytes(input));
            }
        }
    }
}
