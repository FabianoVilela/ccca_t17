import RideCompletedEvent from '../../../domain/events/RideCompletedEvent';
import Mediator from '../../../infra/madiators/Mediator';
import Queue from '../../../infra/queues/Queue';
import PaymentGateway from '../../gateways/PaymentGateway';
import RideRepository from '../../repositories/RideRepository';
import UseCase from '../UseCase';

type Input = {
  rideId: string;
};

export default class FinishRide implements UseCase {
  constructor(
    readonly rideRepository: RideRepository,
    readonly mediator: Mediator,
    readonly paymentGateway: PaymentGateway,
    readonly queue: Queue,
  ) {}

  async execute(input: Input): Promise<void> {
    const ride = await this.rideRepository.getById(input.rideId);

    ride.register('rideCompleted', async (event: RideCompletedEvent) => {
      // this.mediator.notify('rideCompleted', event); // NOTE: Using mediator
      // await this.paymentGateway.processPayment(event); // NOTE: Not queued
      await this.queue.publish('rideCompleted', event);
    });

    ride.finish();

    await this.rideRepository.updateRide(ride);
  }
}
