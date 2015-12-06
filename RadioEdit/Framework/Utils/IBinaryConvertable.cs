using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;

namespace Ham.Radio.Utils
{
  public interface IBinaryConvertable
  {
    void ToBinary(BinaryWriter stream);
    void FromBinary(BinaryReader stream);
  }
}
