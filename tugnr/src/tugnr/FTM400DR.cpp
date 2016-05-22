// FTM400DR
//

#include <QFile>
#include "FTM400DR.h"

namespace tugnr
{
  // Channel display label strings are encoded with this special
  // character set
  //
  const QString FTM400DR::labelCharEncoding = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!\"#$%&`()*+,-./:;<=>?@[\\]^_`{|}~?????? ???????????????????????????????????????????????????????????????????????????????????????????";

  // File based constructor
  //
  FTM400DR::FTM400DR( const QString& file )
    : fileName(file)
  {

  }

  FTM400DR::FTM400DR()
  {

  }

  FTM400DR::~FTM400DR()
  {

  }

  // Read settings at filepath
  //
  bool FTM400DR::load()
  {
    QFile file( fileName );

    if( !file.open( QIODevice::ReadOnly ) )
      return false;

    auto fsize = file.size();
    qint64 size = sizeof(data);

    dataBuffer.setData( file.readAll() );
    if( dataBuffer.size() != fsize )
      return false;

    if( size != fsize )
      return false;

    editsBuffer.setData( dataBuffer.data() );

    data = (SaveData*)dataBuffer.data().data();
    edits = (SaveData*)editsBuffer.data().data();

    return true;
  }

  bool FTM400DR::save()
  {
    return saveAs(fileName);
  }

  // Write edits to the file at filepath
  //
  bool FTM400DR::saveAs(const QString& filepath)
  {
    QFile file( filepath );
    fileName = filepath;

    if(!file.open( QIODevice::WriteOnly ))
      return false;

    auto wrote = file.write( editsBuffer.data() );

    return wrote != editsBuffer.size();
  }

  // Translate c string in-place from encoded character set
  //
  void FTM400DR::decodeLabel(char* label, int length)
  {
    for (int i = 0; i < length; ++i)
    {
      label[i] = labelCharEncoding[label[i]].toLatin1();
    }
  }

  // Translate c string to string from encoded character
  // set
  //
  void FTM400DR::decodeLabel(
      char* label, int length, QString& decoded)
  {
    decoded.resize(length);
    for (int i = 0; i < length; ++i)
    {
      decoded[i] = labelCharEncoding[label[i]];
    }
  }

  char FTM400DR::encodeLabelCharacter( char target )
  {
    for( quint8 c=0; c < labelCharEncoding.size(); ++c)
    {
      if( target == labelCharEncoding[c])
        return (char)c;
    }

    return 255;
  }

  void FTM400DR::encodeLabel( char* dest, const QString& label )
  {
    for( int i =0; i < label.size() && i < LabelLength && dest[i]; ++i)
    {
      dest[i] = encodeLabelCharacter( label[i].toLatin1() );
    }
  }
}
