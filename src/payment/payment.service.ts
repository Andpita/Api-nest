import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentEntity } from './entities/payment.entity';
import { Repository } from 'typeorm';
import { CreateOrderDTO } from 'src/order/dtos/create-order.dto';
import { PaymentCreditCardEntity } from './entities/payment-credit-card.entity';
import { PaymentType } from './enum/payment-type.enum';
import { PaymentPixEntity } from './entities/payment-pix.entity';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(PaymentEntity)
    private readonly PaymentRepository: Repository<PaymentEntity>,
  ) {}

  async createPayment(newOrder: CreateOrderDTO): Promise<PaymentEntity> {
    if (newOrder.amountPayments) {
      //cartão
      const paymentCC = new PaymentCreditCardEntity(
        PaymentType.Done,
        10,
        0,
        10,
        newOrder,
      );
      return this.PaymentRepository.save(paymentCC);
    } else if (newOrder.codePix && newOrder.datePayment) {
      //pix
      const paymentPix = new PaymentPixEntity(
        PaymentType.Done,
        10,
        0,
        10,
        newOrder,
      );
      return this.PaymentRepository.save(paymentPix);
    }

    throw new BadRequestException(`Erro ao efetuar o pagamento`);
  }
}
