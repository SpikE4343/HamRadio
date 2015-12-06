using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text;
using Ham.Radio.Items;
using Ham.Radio.Utils;

namespace Ham.Radio.Messages
{
  [AttributeUsage(AttributeTargets.Class, AllowMultiple = false)]
  public class MessageSerializerAttribute : Attribute
  {
    public readonly MsgType Id;

    public MessageSerializerAttribute(MsgType id)
    {
      Id = id;
    }
  }

  public enum MsgType
  {
    None,
    GroupState = 0,
    Telemetry = 1,
    AnalogInput = 2,
    Action = 3,
    Heartbeat = 4,
    AnalogMeterTelemetry = 5,
    LogInfo = 6,
    NumMessages
  }

  public interface IMessage
  {
    MsgType Type { get; }
    void write(BinaryWriter stream);
    void read(BinaryReader stream);
  }

  [ClassSerializer("TelemetryMsg")]
  [MessageSerializer(MsgType.Telemetry)]
  public class TelemetryMsg : IMessage, IPoolable
  {
    public byte id;
    public byte display = 0;
    public byte precision;
    public byte startDigit;
    public byte maxDigits;
    public int value;

    public void write(BinaryWriter stream)
    {
      stream.Write(id);
      stream.Write(display);
      stream.Write(precision);
      stream.Write(startDigit);
      stream.Write(maxDigits);
      int lvalue = (int)(value * Math.Pow(10, precision));
      stream.Write(lvalue);
    }

    public void read(BinaryReader stream)
    {
      id = (byte)stream.ReadByte();
      display = (byte)stream.ReadByte();
      precision = (byte)stream.ReadByte();
      startDigit = (byte)stream.ReadByte();
      maxDigits = (byte)stream.ReadByte();
      value = stream.ReadInt32();
    }

    public void Reset()
    {
      display = 0;
      precision = 0;
      startDigit = 0;
      maxDigits = 0;
      value = 0;
    }

    #region IMessage Members

    public MsgType Type
    {
      get { return MsgType.Telemetry; }
    }

    #endregion
  }

  [ClassSerializer("GroupStateMsg")]
  [MessageSerializer(MsgType.GroupState)]
  public class GroupStateMsg : IMessage, IPoolable
  {
    public byte id;
    public byte state = 0;

    #region IMessage Members

    public MsgType Type
    {
      get { return MsgType.GroupState; }
    }

    #endregion

    public void write(BinaryWriter stream)
    {
      stream.Write(id);
      stream.Write(state);
    }

    public void read(BinaryReader stream)
    {
      id = (byte)stream.ReadByte();
      state = (byte)stream.ReadByte();
    }

    public void Reset()
    {
      id = 0;
      state = 0;
    }
  }

  [ClassSerializer("AnalogMeterMsg")]
  [MessageSerializer(MsgType.AnalogMeterTelemetry)]
  public class AnalogMeterMsg : IMessage, IPoolable
  {
    public byte meter;
    public byte value = 0;

    #region IMessage Members

    public MsgType Type
    {
      get { return MsgType.AnalogMeterTelemetry; }
    }

    #endregion

    public void write(BinaryWriter stream)
    {
      stream.Write(meter);
      stream.Write(value);
    }

    public void read(BinaryReader stream)
    {
      meter = (byte)stream.ReadByte();
      value = (byte)stream.ReadByte();
    }

    public void Reset()
    {
      meter = 0;
      value = 0;
    }
  }

  [ClassSerializer("HeartbeatMsg")]
  [MessageSerializer(MsgType.Heartbeat)]
  public class HeartbeatMsg : IMessage, IPoolable
  {
    public int frame;

    #region IMessage Members

    public MsgType Type
    {
      get { return MsgType.Heartbeat; }
    }

    #endregion

    public void write(BinaryWriter stream)
    {
      stream.Write(frame);
    }

    public void read(BinaryReader stream)
    {
      frame = stream.ReadInt32();
    }

    public void Reset()
    {
      frame = 0;
    }
  }

  [ClassSerializer("LogInfoMsg")]
  [MessageSerializer(MsgType.LogInfo)]
  public class LogInfoMsg : IMessage, IPoolable
  {
    public string message;

    #region IMessage Members

    public MsgType Type
    {
      get { return MsgType.LogInfo; }
    }

    #endregion

    public void write(BinaryWriter stream)
    {
      short len = (short)message.Length;
      stream.Write(len);
      stream.Write(message.ToCharArray(), 0, len);
    }

    public void read(BinaryReader stream)
    {
      short len = stream.ReadInt16();
      message = new string(stream.ReadChars(len));
    }

    public void Reset()
    {
      message = string.Empty;
    }
  }

  [ClassSerializer("AnalogInputMsg")]
  [MessageSerializer(MsgType.AnalogInput)]
  public class AnalogInputMsg : IMessage, IPoolable
  {
    public MsgType Type { get { return MsgType.AnalogInput; } }

    public byte id;
    public float value;

    public void write(BinaryWriter stream)
    {
      stream.Write(id);
      stream.Write(value);
    }

    public void read(BinaryReader stream)
    {
      id = stream.ReadByte();
      value = stream.ReadSingle();
    }

    public void Reset()
    {
      id = 0;
      value = 0.0f;
    }
  }

  public struct MessageHeader
  {
    public byte e;
    public byte R;
    public byte type;
    public byte size;

    public static int Size { get { return sizeof(byte) * 4; } }

    public void Read(BinaryReader rdr)
    {
      e = rdr.ReadByte();
      R = rdr.ReadByte();
      type = rdr.ReadByte();
      size = rdr.ReadByte();
    }
  }

  public class MessageManager
  {
    BinaryWriter msgWriter = new BinaryWriter(new MemoryStream());
    BinaryWriter writer = new BinaryWriter(new MemoryStream());
    BinaryReader reader = new BinaryReader(new MemoryStream());

    private Stream stream { get { return reader.BaseStream; } }
    private int BytesRemaining { get { return (int)(stream.Length); } }

    private bool HasPendingMessage = false;
    static Dictionary<MsgType, Type> msgCreator = new Dictionary<MsgType, Type>();

    MsgType PendingType = MsgType.None;
    byte PendingSize = 0;

    public MessageManager()
    {
      InitializeItems();
    }

    private void InitializeItems()
    {
      foreach (var assembly in AppDomain.CurrentDomain.GetAssemblies())
      {
        foreach (var type in GetTypesWithPanelItemAttribute(typeof(MessageSerializerAttribute), assembly))
        {
          foreach (var attr in type.GetCustomAttributes(typeof(MessageSerializerAttribute), false))
          {
            var item = attr as MessageSerializerAttribute;
            AddMessage(item.Id, type);
          }
        }
      }
    }

    private IEnumerable<Type> GetTypesWithPanelItemAttribute(Type attr, Assembly assembly)
    {
      foreach (Type type in assembly.GetTypes())
      {
        if (type.GetCustomAttributes(attr, false).Length > 0)
        {
          yield return type;
        }
      }
    }

    public void SetStream(Stream stream)
    {
      reader = new BinaryReader(stream);
      writer = new BinaryWriter(stream);
    }

    public void AddMessage(MsgType msg, Type creator)
    {
      msgCreator.Add(msg, creator);
    }

    private bool ReadHeader(BinaryReader rdr, out MsgType type, out byte size)
    {
      type = MsgType.None;
      size = 0;

      if (BytesRemaining < 4)
        return false;

      //Console.Write((char)streamReader.PeekChar()); x 
      byte marker = reader.ReadByte();

      if (marker != 'e')
      {
        //Console.Write((char)marker);
        return false;
      }

      char marker1 = (char)reader.ReadByte();
      //Console.Write(marker);
      if (marker1 != 'R')
      {
        return false;
      }

      type = (MsgType)reader.ReadByte();
      //Console.Write((byte)PendingType);
      size = reader.ReadByte();

      return true;

      //rdr.BaseStream.
      //char e = (char)rdr.ReadByte();
      //char r = (char)rdr.ReadByte();
      //type = rdr.ReadByte();
      //size = rdr.ReadByte();
      //return e == 'e' && r == 'R' && type >= 0 && type < (int)SerialConnection.MsgType.NumMessages;
    }

    private void WriteHeader(BinaryWriter wrt, byte type, byte size)
    {
      wrt.Write('e');
      wrt.Write('R');
      wrt.Write(type);
      wrt.Write(size);
    }



    public void WriteMsg(IMessage msg)
    {
      msgWriter.Seek(0, SeekOrigin.Begin);
      WriteHeader(msgWriter, (byte)msg.Type, 0);
      msg.write(msgWriter);
      byte size = (byte)msgWriter.BaseStream.Position;
      msgWriter.Seek(0, SeekOrigin.Begin);
      WriteHeader(msgWriter, (byte)msg.Type, size);



      var ms = msgWriter.BaseStream as MemoryStream;
      writer.Write(ms.GetBuffer(), 0, (int)size + 4);

      //Log.Debug("write: {0}", BitConverter.ToString(ms.GetBuffer(), 0, (int)size + 4));

      Singleton.Get<ObjectPool>().Release((IPoolable)msg);
    }

    public void ReadMsg()
    {
      if (!HasPendingMessage)
      {
        if (!ReadHeader(reader, out PendingType, out PendingSize))
          return;

        HasPendingMessage = true;
      }

      if (!HasPendingMessage || BytesRemaining < PendingSize)
      {
        return;
      }

      HasPendingMessage = false;

      var msgType = (MsgType)PendingType;
      var msg = Singleton.Get<ObjectPool>().Grab<IMessage>(msgCreator[msgType]);
      msg.read(reader);

      //Log.Debug("read: {0}", msg);

      Singleton.Get<EventDispatcher>().Fire(msg);
      Singleton.Get<ObjectPool>().Release((IPoolable)msg);
    }
  }
}
