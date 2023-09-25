import { HttpService } from '@nestjs/axios';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { AxiosError } from 'axios';
import { ReturnCorreiosExternalDTO } from './dtos/returnCorreiosExternal.dto';
import { CityService } from '../city/city.service';
import { ReturnCEPDTO } from './dtos/returnCEP.dto';
import { CityEntity } from '../city/entities/city.entity';
import { ResponsePriceCorreios } from './dtos/response-price-correios.dto';
import { CdFormatEnum } from './enum/cd-format.enum';
import { SizeProductDTO } from './dtos/size-product.dto';
import { Client } from 'nestjs-soap';
import { ReturnFreteDTO } from './dtos/returnDataFrete.dto';

@Injectable()
export class CorreiosService {
  URL_CORREIOS = process.env.URL_CEP_CORREIOS;
  CEP_COMPANY = process.env.CEP_COMPANY;
  constructor(
    @Inject('SOAP_CORREIOS') private readonly soapClient: Client,
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

  async priceDelivery(
    cdService: string,
    cep: string,
    sizeProduct: SizeProductDTO,
  ): Promise<ResponsePriceCorreios> {
    return new Promise((resolve) => {
      this.soapClient.CalcPrecoPrazo(
        {
          nCdServico: cdService,
          sCepOrigem: this.CEP_COMPANY,
          sCepDestino: cep,
          nCdFormato: CdFormatEnum.BOX,
          nVlPeso: sizeProduct.weight,
          nVlComprimento: sizeProduct.length,
          nVlAltura: sizeProduct.height,
          nVlLargura: sizeProduct.width,
          nVlDiametro: sizeProduct.diameter,
          nCdEmpresa: '',
          sDsSenha: '',
          sCdMaoPropria: 'N',
          nVlValorDeclarado: 0,
          sCdAvisoRecebimento: 'N',
        },
        (_, res: ResponsePriceCorreios) => {
          if (res) {
            resolve(res);
          } else {
            throw new BadRequestException('Error SOAP');
          }
        },
      );
    });
  }

  async calcFrete(cep: string): Promise<any> {
    const infoPrice = await this.httpService.axiosRef.get(
      `https://www.cepcerto.com/ws/json-frete/88021062/${cep}/100`,
    );

    const originalData = { ...infoPrice.data };
    const originalPac = +(
      Number(originalData.valorpac.replace(',', '.')) * 1.7
    ).toFixed(2);
    const originalSedex = +(
      Number(originalData.valorsedex.replace(',', '.')) * 1.8
    ).toFixed(2);

    console.log(originalPac, originalSedex);

    const newData: ReturnFreteDTO = {
      ...originalData,
      valorpac: originalPac,
      valorsedex:
        originalSedex > originalPac ? originalSedex : originalPac * 1.5,
    };

    return newData;
  }
}
