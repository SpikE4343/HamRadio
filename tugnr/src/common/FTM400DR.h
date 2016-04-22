#ifndef FTM400DR_h_include
#define FTM400DR_h_include

#include <stddef.h>

#include <QBuffer>
#include <QtGlobal>

#define add_offset( c, fo ) char _offset_##fo##_[(fo)-(c)]
#define packed( a ) a __attribute__((packed))

namespace tugnr
{
  class FTM400DR
  {
  public:
    
    const static quint32 LabelCount = 518U;
    const static int LabelLength = 8;

    packed( struct ChannelLabelData
    {
      char label[LabelLength];
    });

    packed( struct ChannelData
    {
      // quint8[0]
      quint8 unknown : 5;
      quint8 skip : 2;
      quint8 used : 1;

      // quint8[1]
      quint8 duplex : 2;
      quint8 oddsplit : 1;
      quint8 unknown8 : 1;
      quint8 mode : 3;
      quint8 unknown2 : 1;

      // quint8[2,3,4]
      quint8 freq[3]; //bcd

      // quint8[5]
      quint8 unknownB : 4;
      quint8 tmode : 3;
      quint8 unknownA : 1;

      // quint8[6,7,8]
      quint8 split[3]; //bcd

      // quint8[9]
      quint8 tone : 6;
      quint8 power : 2;

      // quint8[10]
      quint8 dtcs : 7;
      quint8 unknownC : 1;

      // quint8[11]
      quint8 unknown5: 7;
      quint8 showalpha : 1;

      // quint8[12]
      quint8 unknown6;

      // quint8[13]
      quint8 offset;

      // quint8[14,15]
      quint8 unknown7[2];
    });

    packed( struct SaveData
    {
      char marker[6];

      add_offset(0x0 + sizeof(marker), 0x02B8);
      char callsign[10];

      add_offset(0x02B8 + sizeof(callsign), 0x0480);
      ChannelData leftZero;
      ChannelLabelData labelLeftZero;
      ChannelData rightZero;
      ChannelLabelData labelRightzero;

      add_offset(0x0480 + 16*2 + 8*2, 0x0800);
      ChannelData left[500];

      add_offset(0x0800 + sizeof(left), 0x2860);
      ChannelData right[500];

      add_offset(0x2860 + sizeof(right), 0x48C0);
      ChannelLabelData labelLeft[518];
      ChannelLabelData labelRight[518];
    });

    static const QString labelCharEncoding;
    QString fileName;

    SaveData* data;
    SaveData* edits;

    QBuffer dataBuffer;
    QBuffer editsBuffer;

    bool load();
    bool save();
    bool saveAs(const QString& file);

    FTM400DR(const QString& file);
    FTM400DR();
    ~FTM400DR();

    void encodeLabel( char* dest, const QString& label);
    char encodeLabelCharacter(char target);
  private:

    // in-place
    void decodeLabel(char* label, int length);
    void decodeLabel(char* label, int length, QString& decoded);
  };
}

#endif
