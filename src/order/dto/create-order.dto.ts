import {IsNumber, IsPhoneNumber, IsString, Length} from "class-validator";

export class CreateOrderDto {

  @IsString({message: "itemIds должно иметь тип string"})
  basketItemIds: string;

  @IsString({message: "token должно иметь тип string"})
  token: string;

  @IsString({message: "name должно иметь тип string"})
  @Length(2)
  name: string;

  @IsString({message: "phone должно иметь тип string"})
  @IsPhoneNumber("RU", {message: "Неверный формат номера телефона"})
  phone: string;

  @IsString({message: "email должно иметь тип string"})
  email: string;

  @IsString({message: "address должно иметь тип string"})
  address: string;

  // @IsNumber("track должно иметь тип number")
  // track: number;

  @IsNumber({}, {message: "typePay должно иметь тип number"})
  typePay: number;

  @IsNumber({}, {message: "typeDelivery должно иметь тип number"})
  typeDelivery: number;

}