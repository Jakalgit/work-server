import {IsNumber, Min} from "class-validator";

export class CreateBasketItemDto {

  @IsNumber({}, {message: 'itemId должно иметь тип number'})
  itemId: number;

  @IsNumber({}, {message: 'count должно иметь тип number'})
  @Min(1)
  count: number;

  @IsNumber({}, {message: 'userId должно иметь тип number'})
  userId: number;

}