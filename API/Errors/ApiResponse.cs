using System;

namespace API.Errors
{
    public class ApiResponse
    {

        public ApiResponse(int statusCode, string message=null)
        {
            this.StatusCode = statusCode;
            this.Message = message ?? GetDefaultMessageFromStatusCodeMessage(statusCode);

        }        

        public int StatusCode { get; set; }
        public string Message { get; set; }

        private string GetDefaultMessageFromStatusCodeMessage(int statusCode)
        {
            return statusCode switch
            {
                400 => "A bad request, you have made",
                401 => "Authorized, you are not",
                404 => "Resource found, it was found",
                500 => "Errors are the path to dark side, dart side lead to hate lead to career change.",
                
                _ => null
            };
        }
    }
}