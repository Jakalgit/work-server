import {IsNumber, IsString, Length} from "class-validator";

export class ChangeNameDto {

  @IsNumber({}, {message: "id должно быть типа number"})
  id: number;

  @IsString({message: "name должно быть типа string"})
  @Length(2, 14)
  name: string;
}