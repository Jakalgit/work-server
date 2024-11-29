import {IsNumber, IsString, Min} from "class-validator";

export class GetItemFilterDto {

  @IsNumber({}, {message: "min_price должно иметь тип number"})
  @Min(0)
  min_price: number;

  @IsNumber({}, {message: "max_price должно иметь тип number"})
  max_price: number;

  @IsNumber({}, {message: "page должно иметь тип number"})
  @Min(1)
  page: number;

  @IsString({message: "tagIds должно иметь тип string"})
  tagIds: string;

  name: string
}