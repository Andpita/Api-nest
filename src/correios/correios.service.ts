import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { AxiosError } from 'axios';
import { ReturnCorreiosExternalDTO } from './dtos/returnCorreiosExternal.dto';
import { CityService } from 'src/city/city.service';
import { ReturnCEPDTO } from './dtos/returnCEP.dto';
import { CityEntity } from 'src/city/entities/city.entity';

@Injectable()
export class CorreiosService {
  constructor(
    private readonly httpService: HttpService,
    private readonly cityService: CityService,
  ) {}
  urlCEP = process.env.URL_CEP;

  async findAddressByCEP(cep: string): Promise<ReturnCEPDTO> {
    const returnCep = await this.httpService.axiosRef
      .get<ReturnCorreiosExternalDTO>(this.urlCEP.replace('{cep}', cep))
      .catch((error: AxiosError) => {
        throw new BadRequestException(
          `Erro ao consultar CEP. ${error.message}`,
        );
      });

    const cityInfo: CityEntity | undefined = await this.cityService
      .findCityByName(returnCep.data.localidade, returnCep.data.uf)
      .catch(() => undefined);

    return new ReturnCEPDTO(returnCep.data, cityInfo?.id, cityInfo?.stateId);
  }
}
