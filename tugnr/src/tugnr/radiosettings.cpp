#include "radiosettings.h"
#include "ui_radiosettings.h"

RadioSettings::RadioSettings(QWidget *parent) :
  QWidget(parent),
  ui(new Ui::RadioSettings)
{
  ui->setupUi(this);
}

RadioSettings::~RadioSettings()
{
  delete ui;
}
