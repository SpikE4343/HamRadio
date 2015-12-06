using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Framework.Radio
{
  public class MemoryEntry
  {
    public int Id;
    public long Frequency;
    public string Name;

    public bool Used;
    public bool Skip;

    public int TxPower;

    public float Offset;
    public float Tone;
    public int Mode;
    public int Dtcs;
  }
}
