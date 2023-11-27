import {IsString, Length} from "class-validator";

export class CreateColorDto {

  @IsString({message: 'name должно иметь тип string'})
  @Length(4)
  name: string;

}