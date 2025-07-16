import { Injectable, NotFoundException } from '@nestjs/common';
import { Board } from './board.entity';
import { CreateBoardDto } from './dto/create-board.dto';
import { Repository } from 'typeorm';
import { BoardStatus } from './board-status.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';
import { GetUser } from 'src/auth/get-user-decorator';

@Injectable()
export class BoardsService {
  constructor(
    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,
  ) {}

  async getAllBoards(@GetUser() user: User): Promise<Board[]> {
    const query = this.boardRepository.createQueryBuilder('board');
    query.where('board.userId = :userId', { userId: user.id });

    const boards = await query.getMany();

    return boards;
    // return this.boardRepository.find();
  }

  async getBoardById(id: number): Promise<Board> {
    const found = await this.boardRepository.findOne({
      where: { id },
    });
    if (!found) {
      throw new NotFoundException(`해당 ${id}의 게시글을 찾을 수 없습니다.`);
    }
    return found;
  }

  async createBoard(
    createBoardDto: CreateBoardDto,
    user: User,
  ): Promise<Board> {
    const { title, description } = createBoardDto;

    const board = this.boardRepository.create({
      title,
      description,
      status: BoardStatus.PUBLIC,
      user,
    });

    await this.boardRepository.save(board);
    return board;
  }

  async deleteBoard(id: number, user: User): Promise<void> {
    const result = await this.boardRepository.delete({ id, user });

    if (result.affected === 0) {
      throw new NotFoundException(`해당 ${id}의 게시글을 찾을 수 없습니다.`);
    }
    return;
  }

  async updateBoardStatus(id: number, status: BoardStatus): Promise<Board> {
    const board = await this.getBoardById(id);

    board.status = status;
    await this.boardRepository.save(board);

    return board;
  }
}
