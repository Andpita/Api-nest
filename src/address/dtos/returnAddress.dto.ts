import { ReturnCityDTO } from '../../city/dtos/returnCity.dto';
import { AddressEntity } from '../entities/address.entity';

export class ReturnAddressDTO {
  complement: string;
  numberAddress: number;
  cep: string;
  city?: ReturnCityDTO;

  constructor(address: AddressEntity) {
    this.complement = address.complement;
    this.numberAddress = address.numberAddress;
    this.cep = address.cep;

    this.city = new ReturnCityDTO(address.city);
  }
}
