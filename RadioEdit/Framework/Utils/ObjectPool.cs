using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Ham.Radio.Utils
{
  public class ObjectPool
  {
    private Dictionary<Type, Queue<IPoolable>> pool = new Dictionary<Type, Queue<IPoolable>>();

    public T Grab<T>() where T : IPoolable, new()
    {
      Queue<IPoolable> queue;
      if (pool.TryGetValue(typeof(T), out queue) &&
          queue.Count > 0)
      {
        return (T)queue.Dequeue();
      }
      return new T();
    }

    public object Grab(Type t)
    {
      Queue<IPoolable> queue;
      if (pool.TryGetValue(t, out queue) &&
          queue.Count > 0)
      {
        return queue.Dequeue();
      }
      return Activator.CreateInstance(t);
    }

    public T Grab<T>(Type t)
    {
      return (T)Grab(t);
    }

    public void Release(IPoolable msg)
    {
      Queue<IPoolable> queue;
      if (!pool.TryGetValue(msg.GetType(), out queue))
      {
        queue = new Queue<IPoolable>();
        pool.Add(msg.GetType(), queue);
      }
      msg.Reset();
      queue.Enqueue(msg);
    }
  }
}
