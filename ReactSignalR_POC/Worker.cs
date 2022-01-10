using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Hosting;
using ReactSignalR_POC.Hubs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace ReactSignalR_POC
{
    public class Worker : BackgroundService
    {
        private IHubContext<ChatHub> _chatHub;

        public Worker(IHubContext<ChatHub> chatHub)
        {
            _chatHub = chatHub;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                await _chatHub.Clients.All.SendAsync("ReceiveMessage", "System", DateTime.Now.ToString("O"));
                await Task.Delay(1000);
            }
        }
    }
}
