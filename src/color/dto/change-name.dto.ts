import {IsNumber, IsString, Length} from "class-validator";

export class ChangeNameDto {

  @IsNumber({}, {message: 'id должно иметь тип number'})
  id: number;

  @IsString({message: 'name должно иметь тип string'})
  @Length(4)
  name: string;
}