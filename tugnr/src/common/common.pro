#-------------------------------------------------
#
# Project created by QtCreator 2016-03-29T22:50:44
#
#-------------------------------------------------

QT       += widgets

TARGET = common
TEMPLATE = lib
CONFIG += staticlib

SOURCES += common.cpp \
    FTM400DR.cpp

HEADERS += common.h \
    FTM400DR.h
unix {
    target.path = /usr/lib
    INSTALLS += target
}
