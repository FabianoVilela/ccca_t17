import Ride from '../../src/domain/entities/Ride';

test('Shoul not create a ride with invalid coordinate', function () {
  expect(() => Ride.create('', -180, 180, -180, 180)).toThrow(
    new Error('Invalid latitude!'),
  );
});
