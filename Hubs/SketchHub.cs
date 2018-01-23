using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using SignalRDemo.Common;

namespace SignalRDemo.Hubs
{
    public class SketchHub : Hub
    {
        public Task NotifyClients(string color, int thickness, Point from, Point to)
        {
            return this.Clients
                .AllExcept(new[] { this.Context.ConnectionId })
                .InvokeAsync("Draw", color, thickness, from, to);
        }
    }
}