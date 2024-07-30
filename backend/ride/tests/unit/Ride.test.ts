import Position from '../../src/domain/entities/Position';
import Ride from '../../src/domain/entities/Ride';

test('Shoul not create a ride with invalid coordinate', function () {
  expect(() => Ride.create('', -180, 180, -180, 180)).toThrow(
    new Error('Invalid latitude!'),
  );
});

test('Should calculate the distance of the race', function () {
  const ride = Ride.create('', 0, 0, 0, 0);
  const account = {
    name: 'John Doe',
    email: 'john.doe@gmail.com',
    cpf: '97456321558',
    password: '123456',
    passwordType: 'plain',
    isPassenger: false,
    isDriver: true,
    carPlate: 'ABC1234',
  };

  ride.accept(account);
  ride.start();

  const lastPosition = Position.create('', -27.584905257808835, -48.545022195325124);
  const currentPosition = Position.create('', -27.496887588317275, -48.522234807851476);
  ride.updatePosition(lastPosition, currentPosition);

  expect(ride.distance).toBe(10);
});
