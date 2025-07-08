import { BadRequestException, PipeTransform } from '@nestjs/common';
import { BoardStatus } from '../board-status.enum';

export class BoardStatusValidationPipe implements PipeTransform {
  readonly StatusOptions = [BoardStatus.PRIVATE, BoardStatus.PUBLIC];

  transform(value: string) {
    value = value.toUpperCase();

    if (!this.isStatusValid(value as BoardStatus)) {
      throw new BadRequestException(`${value}는 올바르지 않은 상태입니다.`);
    }
    return value;
  }

  private isStatusValid(status: BoardStatus) {
    const index = this.StatusOptions.indexOf(status);
    return index !== -1;
  }
}
