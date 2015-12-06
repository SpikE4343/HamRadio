using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using Boomlagoon.JSON;
using Ham.Radio.Messages;
using Ham.Radio.Network;
using Ham.Radio.Utils;

namespace Ham.Radio
{
  public class Application : IJsonConvertable
  {
    public void Initialize()
    {
      Singleton.Set(new Config());
      Singleton.Set(new ObjectPool());
      Singleton.Set(new MessageManager());
      var input = Singleton.Set(new InputDispatcher());
      Singleton.Set(new EventDispatcher());
      Singleton.Set(new ClassSerializer());
      Singleton.Set(new Connection());


      input.Initialize();
      //CreateDefaultLayout();
    }

    public void Shutdown()
    {
      Singleton.DestroyAll();
    }

    public void UpdateConnection()
    {
      Singleton.Get<Connection>().Update();
    }

    public void Load(string file)
    {
      if (!File.Exists(file))
        return;

      string text = File.ReadAllText(file);
      FromJson(JSONObject.Parse(text));
    }

    public void Save(string file)
    {
      string text = ToJson().ToString();
      File.WriteAllText(file, text);
    }

    #region IJsonConvertable Members

    public JSONObject ToJson()
    {
      var json = new JSONObject();
      json.Add("config", Singleton.Get<Config>().ToJson());
      json.Add("connection", Singleton.Get<Connection>().ToJson());
      return json;
    }

    public void FromJson(JSONObject json)
    {
      Singleton.Get<Config>().FromJson(json["config"]);
      Singleton.Get<Connection>().FromJson(json["connection"]);
    }

    #endregion
  }
}
