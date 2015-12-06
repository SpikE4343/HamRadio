using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Boomlagoon.JSON;

namespace Ham.Radio.Utils
{
  public interface IJsonConvertable
  {
    JSONObject ToJson();
    void FromJson(JSONObject json);
  }
}
