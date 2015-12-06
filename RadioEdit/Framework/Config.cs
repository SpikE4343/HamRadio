using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Boomlagoon.JSON;
using Ham.Radio.Utils;

namespace Ham.Radio
{
  public class Config : IJsonConvertable
  {
    public IntervalsConfig Intervals = new IntervalsConfig();
    public class IntervalsConfig : IJsonConvertable
    {
      public float InputUpdate = 0.01f;
      public float PanelUpdate = 0.0625f;
      public float VesselUpdate = 1.0f;

      #region IJsonConvertable Members

      public JSONObject ToJson()
      {
        var json = new JSONObject();
        json.Add("input", InputUpdate);
        json.Add("panel", PanelUpdate);
        json.Add("vessel", VesselUpdate);
        return json;
      }

      public void FromJson(JSONObject json)
      {
        InputUpdate = json["input"];
        PanelUpdate = json["panel"];
        VesselUpdate = json["vessel"];
      }

      #endregion
    }
    #region IJsonConvertable Members

    public JSONObject ToJson()
    {
      var json = new JSONObject();
      json.Add("intervals", Intervals.ToJson());
      return json;
    }

    public void FromJson(JSONObject json)
    {
      Intervals.FromJson(json["intervals"]);
    }

    #endregion
  }
}
