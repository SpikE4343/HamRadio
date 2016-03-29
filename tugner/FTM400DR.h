#pragma once
#include <stddef.h>
#include <string>

#include "g3Types.h"
#include "g3Util.h"
#include "g3ImUi.h"
#include "g3MemoryBuffer.h"

#define add_offset( c, fo ) char _offset_##fo##_[(fo)-(c)]

namespace g3
{

  class FTM400DR
    : public IImUiWindow
  {
  public:
    
    const static uint32 LabelCount = 518U;

    g3_packed(struct ChannelLabelData
    {
      char label[8];
    });

    g3_packed(struct ChannelData
    {
      // uint8[0]
      uint8 unknown : 5;
      uint8 skip : 2;
      uint8 used : 1;

      // uint8[1]
      uint8 duplex : 2;
      uint8 oddsplit : 1;
      uint8 unknown8 : 1;
      uint8 mode : 3;
      uint8 unknown2 : 1;

      // uint8[2,3,4]
      uint8 freq[3]; //bcd

      // uint8[5]
      uint8 unknownB : 4;
      uint8 tmode : 3;
      uint8 unknownA : 1;

      // uint8[6,7,8]
      uint8 split[3]; //bcd

      // uint8[9]
      uint8 tone : 6;
      uint8 power : 2;

      // uint8[10]
      uint8 dtcs : 7;
      uint8 unknownC : 1;

      // uint8[11]
      uint8 unknown5: 7;
      uint8 showalpha : 1;

      // uint8[12]
      uint8 unknown6;

      // uint8[13]
      uint8 offset;

      // uint8[14,15]
      uint8 unknown7[2];

    });

    g3_packed(struct SaveData
    {
      char marker[6];

      add_offset(6, 0x02B8);
      char callsign[10];

      add_offset(0x02B8+10, 0x0480);
      ChannelData leftZero;
      ChannelLabelData labelLeftZero;

      ChannelData rightZero;
      ChannelLabelData labelRightzero;

      add_offset(0x0480 + 16*2 + 8*2, 0x0800);
      ChannelData left[500];

      add_offset(0x0800 + 16 * 500, 0x2860);
      ChannelData right[500];

      add_offset(0x2860 + 16 * 500, 0x48C0);
      ChannelLabelData labelLeft[518];
      ChannelLabelData labelRight[518];
    });

    static const char* labelCharEncoding;

    SaveData* data;
    SaveData* edits;

    MemoryBuffer dataBuffer;
    MemoryBuffer editsBuffer;

    //g3Assert(sizeof(data) == 65536)

    bool load(const std::string& file);
    bool save(const std::string& file);

    FTM400DR();
    ~FTM400DR();


    virtual void DrawUI(float dt);

  private:

    // in-place
    void decodeLabel(char* label, int length);
    void decodeLabel(char* label, int length, std::string& decoded);

    bool windowOpen;
  };

}
