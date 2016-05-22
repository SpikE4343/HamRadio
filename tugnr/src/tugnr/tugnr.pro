#-------------------------------------------------
#
# Project created by QtCreator 2016-03-29T22:35:15
#
#-------------------------------------------------

QT       += core gui

greaterThan(QT_MAJOR_VERSION, 4): QT += widgets

TARGET = tugnr
TEMPLATE = app


SOURCES += main.cpp\
        mainwindow.cpp \
    FTM400DR.cpp \
    radiosettings.cpp

HEADERS  += mainwindow.h \
    FTM400DR.h \
    radiosettings.h

#FORMS    +=

RESOURCES += \
    tugnr_resc.qrc

FORMS += \
    radiosettings.ui
