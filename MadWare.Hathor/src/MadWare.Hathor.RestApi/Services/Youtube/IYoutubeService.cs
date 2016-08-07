using MadWare.Hathor.RestApi.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MadWare.Hathor.RestApi.Services.Youtube
{
    public interface IYoutubeService
    {
        Task<YoutubeInfoModel> GetInfo(string videoId);
    }
}
