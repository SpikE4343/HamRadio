#ifndef RADIOSETTINGS_H
#define RADIOSETTINGS_H

#include <QWidget>

namespace Ui {
  class RadioSettings;
}

class RadioSettings : public QWidget
{
  Q_OBJECT

public:
  explicit RadioSettings(QWidget *parent = 0);
  ~RadioSettings();

private:
  Ui::RadioSettings *ui;
};

#endif // RADIOSETTINGS_H
