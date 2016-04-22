#include <QString>
#include <QtTest>

class ExampleTest : public QObject
{
  Q_OBJECT

public:
  ExampleTest();

private Q_SLOTS:
  void initTestCase();
  void cleanupTestCase();
  void testCase1();
};

ExampleTest::ExampleTest()
{
}

void ExampleTest::initTestCase()
{
}

void ExampleTest::cleanupTestCase()
{
}

void ExampleTest::testCase1()
{
  QVERIFY2(true, "Failure");
}

QTEST_APPLESS_MAIN(ExampleTest)

#include "tst_exampletest.moc"
