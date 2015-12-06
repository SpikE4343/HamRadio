using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Ham.Radio.Utils
{
  public class EventDispatcher
  {
    private Dictionary<Type, IEventHandler> handlers = new Dictionary<Type, IEventHandler>();

    public interface IEventHandler
    {
      void Fire(object evt);
    }

    public class EventHandler<T> : IEventHandler
    {
      public delegate void MessageReceivedHandler(T evt);
      public event MessageReceivedHandler OnEvent;
      public void Fire(T msg)
      {
        if (OnEvent != null)
          OnEvent(msg);
      }

      public void Fire(object evt)
      {
        if (OnEvent != null)
          OnEvent((T)evt);
      }
    }

    public void Fire(object m)
    {
      IEventHandler storage = null;
      if (handlers.TryGetValue(m.GetType(), out storage))
      {
        var handler = storage as IEventHandler;
        if (handler != null)
        {
          handler.Fire(m);
        }
      }
    }

    //public void Fire<T>(T m)
    //{
    //  IEventHandler storage = null;
    //  if (handlers.TryGetValue(typeof(T), out storage))
    //  {
    //    var handler = storage as EventHandler<T>;
    //    if (handler != null)
    //    {
    //      handler.Fire(m);
    //    }
    //  }
    //}

    public bool HasHandler<T>()
    {
      IEventHandler storage = null;
      if (handlers.TryGetValue(typeof(T), out storage))
      {
        return storage as EventHandler<T> != null;
      }

      return false; ;
    }

    public EventHandler<T> Handler<T>()
    {
      IEventHandler storage = null;
      EventHandler<T> result = null;
      handlers.TryGetValue(typeof(T), out storage);

      result = storage as EventHandler<T>;
      if (result == null)
      {
        result = new EventHandler<T>();
        handlers.Add(typeof(T), result);
      }

      return result;
    }
  }
}
