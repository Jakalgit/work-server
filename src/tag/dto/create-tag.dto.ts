import {IsString, Length} from "class-validator";

export class CreateTagDto {

  @IsString({message: "name должно быть типа string"})
  @Length(2, 14)
  name: string;
}