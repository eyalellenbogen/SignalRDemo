using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace SignalRDemo.Hubs
{
    public class GameHub : Hub
    {
        public Task SendMove(string direction, int speed)
        {
            return this.Clients
                .AllExcept(new[] { this.Context.ConnectionId })
                .InvokeAsync("PlayerMove", direction, speed);
        }

        public Task SendButton(string button, bool isDown)
        {
            return this.Clients
                .AllExcept(new[] { this.Context.ConnectionId })
                .InvokeAsync("PlayerButton", button, isDown);
        }
    }
}