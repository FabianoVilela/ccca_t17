import Period from '../../src/domain/vos/Period';

test('Should calculate the difference between two dates in milliseconds', function () {
  const start = new Date('2023-01-10T10:00:00');
  const end = new Date('2023-01-10T10:30:00');
  const period = new Period(start, end);
  const diff = period.calculateDiffInMili();

  expect(diff).toBe(1800000);
});
