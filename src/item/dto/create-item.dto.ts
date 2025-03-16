import {IsBoolean, IsNumber, IsString, Length, Min} from "class-validator";

// FormData
export class CreateItemDto {

  @IsString({message: 'name должно иметь тип string'})
  @Length(3)
  name: string;

  @IsNumber({}, {message: 'price должно иметь тип number'})
  @Min(0)
  price: number;

  @IsString({message: 'article должно иметь тип string'})
  article: string;

  @IsNumber({}, {message: 'count должно иметь тип number'})
  @Min(0)
  count: number;

  @IsString({message: 'tagIds должно иметь тип string'})
  tagIds: string;

  @IsString({message: 'infos должно иметь тип string'})
  infos: string;

  @IsBoolean({message: 'visibility должно иметь тип boolean'})
  visibility: boolean;

  @IsBoolean({message: 'availability должно иметь тип boolean'})
  availability: boolean;
}