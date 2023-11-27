import {IsBoolean, IsNumber, IsString, Length, Min} from "class-validator";

export class ChangeItemDto {

  @IsNumber({}, {message: 'id должно иметь тип number'})
  id: number;

  @IsString({message: 'name должно иметь тип string'})
  @Length(3)
  name: string;

  @IsNumber({}, {message: 'price должно иметь тип number'})
  @Min(0)
  price: number;

  @IsString({message: 'article должно иметь тип string'})
  article: string;

  @IsNumber({}, {message: 'length должно иметь тип number'})
  @Min(0)
  length: number;

  @IsNumber({}, {message: 'width должно иметь тип number'})
  @Min(0)
  width: number;

  @IsNumber({}, {message: 'height должно иметь тип number'})
  @Min(0)
  height: number;

  @IsNumber({}, {message: 'weight должно иметь тип number'})
  @Min(0)
  weight: number;

  @IsNumber({}, {message: 'count должно иметь тип number'})
  @Min(0)
  count: number;

  @IsString({message: 'tags должно иметь тип string'})
  tagIds: string;

  @IsBoolean({message: 'visibility должно иметь тип boolean'})
  visibility: boolean;

  @IsNumber({}, {message: 'colorId должно иметь тип number'})
  colorId: number;
}