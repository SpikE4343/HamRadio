
#include "FTM400DR.h"
#include "g3Log.h"

namespace g3
{

  const char* FTM400DR::labelCharEncoding = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!\"#$%&`()*+,-./:;<=>?@[\\]^_`{|}~?????? ???????????????????????????????????????????????????????????????????????????????????????????";

  FTM400DR::FTM400DR() 
    : windowOpen(true)
  {
  }


  FTM400DR::~FTM400DR()
  {
  }

  bool FTM400DR::load(const std::string& file)
  {
    FILE* fp = fopen(file.c_str(), "rb");
    if (fp == NULL)
      return false;

    fseek(fp, 0, SEEK_END);
    int fsize = ftell(fp);
    rewind(fp);

    dataBuffer.resize( fsize );

    size_t size = sizeof(data);
    int read = fread((void*)dataBuffer.data(), 1, fsize, fp);
    if (read != fsize)
    {
      fclose(fp);
      return false;
    }

    int err = ferror(fp);
    int eof = feof(fp);

    editsBuffer.assign( dataBuffer );

    data = (SaveData*)dataBuffer.data();
    edits = (SaveData*)editsBuffer.data();

    g3::Log::info("File read error %d", err );

    fclose(fp);

    g3::Log::info(data->callsign);

    return true;
  }

  bool FTM400DR::save(const std::string& file)
  {
    FILE* fp = fopen(file.c_str(), "wb");
    if (fp == NULL)
      return false;

    int wrote = fwrite((void*)editsBuffer.data(), 1, editsBuffer.size(), fp);
    fclose(fp);

    if (wrote != editsBuffer.size())
      return false;

    return true;
  }

  void FTM400DR::decodeLabel(char* label, int length)
  {
    for (int i = 0; i < length; ++i)
    {
      label[i] = labelCharEncoding[label[i]];
    }
  }

  void FTM400DR::decodeLabel(char* label, int length, std::string& decoded)
  {
    decoded.resize(length);
    for (int i = 0; i < length; ++i)
    {
      decoded[i] = labelCharEncoding[label[i]];
    }
  }

  void FTM400DR::DrawUI(float dt)
  {
    ImGui::Begin(name.c_str(), &windowOpen, ImVec2(200, 200));

    if (ImGui::CollapsingHeader("FTM-400"))
    {
      ImGui::LabelText("Callsign", edits->callsign);
    }

    std::string label;
    for (int i = 0; i < LabelCount; ++i)
    {
      ChannelData& channel = edits->left[i];

      if (!channel.used)
        continue;

      decodeLabel(edits->labelLeft[i].label, 8, label);
      ImGui::Text("[%d]=%s", i, label.c_str());
    }

    ImGui::End();
  }
}
