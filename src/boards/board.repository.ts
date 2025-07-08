import { Repository } from 'typeorm';
import { Board } from './board.entity';

export class BoardRepository {
  constructor(private readonly boardRepository: Repository<Board>) {}
}
