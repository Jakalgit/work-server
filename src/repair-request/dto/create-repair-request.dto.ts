import {IsNumber, IsPhoneNumber, IsString, Length} from "class-validator";

export class CreateRepairRequestDto {

  @IsString({message: "name должно иметь тип string"})
  @Length(2, 15)
  name: string;

  @IsNumber({}, {message: "phone должно иметь тип number"})
  @IsPhoneNumber("RU")
  phone: number;

  @IsString({message: "message должно иметь тип string"})
  @Length(10)
  message: string;
}