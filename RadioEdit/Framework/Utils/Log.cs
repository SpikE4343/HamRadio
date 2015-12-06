using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Ham.Radio
{
  public class Log
  {
    public interface Implementation
    {
      void Debug(string message, params object[] args);
      void Info(string message, params object[] args);
      void Error(string message, params object[] args);
    }

    public static Implementation Implementor;

    public static void Debug(string message, params object[] args)
    {
      if (Implementor == null)
        return;

      Implementor.Debug(message + "\n", args);
    }

    public static void Info(string message, params object[] args)
    {
      if (Implementor == null)
        return;

      Implementor.Info(message + "\n", args);
    }

    public static void Error(string message, params object[] args)
    {
      if (Implementor == null)
        return;

      Implementor.Error(message + "\n", args);
    }
  }

  public class ConsoleLogger : Log.Implementation
  {
    public void Debug(string message, params object[] args)
    {
      Console.Write(string.Format(message, args));
    }

    public void Info(string message, params object[] args)
    {
      Console.Write(string.Format(message, args));
    }

    public void Error(string message, params object[] args)
    {
      Console.Write("Error: " + string.Format(message, args));
    }
  }
}
