import { Injectable, NotFoundException } from '@nestjs/common';
import { Board } from './board.entity';
import { CreateBoardDto } from './dto/create-board.dto';
import { Repository } from 'typeorm';
import { BoardStatus } from './board-status.enum';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class BoardsService {
  // 로컬메모리 이용
  // private boards: Board[] = [];
  // getAllBoards(): Board[] {
  //   return this.boards;
  // }
  // getBoardById(id: string): Board {
  //   const board = this.boards.find((board) => board.id === id);
  //   if (!board) {
  //     throw new NotFoundException(`해당 ${id}의 게시글을 찾을 수 없습니다.`);
  //   }
  //   return board;
  // }
  // createBoard(createBoardDto: CreateBoardDto): Board {
  //   const { title, description } = createBoardDto;
  //   const newBoard: Board = {
  //     id: uuid(),
  //     title,
  //     description,
  //     status: BoardStatus.PUBLIC,
  //   };
  //   this.boards.push(newBoard);
  //   return newBoard;
  // }
  // deleteBoard(id: string): void {
  //   const found = this.getBoardById(id); // 에러 처리를 getBoardById에서 해주기 땜에 여기서 할 필요가 없음
  //   this.boards = this.boards.filter((board) => board.id !== found.id);
  // }
  // updateBoardStatus(id: string, status: BoardStatus): Board {
  //   const board = this.getBoardById(id);
  //   if (!board) {
  //     throw new NotFoundException('해당 게시글을 찾을 수 없습니다.');
  //   }
  //   board.status = status;
  //   return board;
  // }
  constructor(
    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,
  ) {}

  async getBoardById(id: number): Promise<Board> {
    const found = await this.boardRepository.findOne({
      where: { id },
    });
    if (!found) {
      throw new NotFoundException(`해당 ${id}의 게시글을 찾을 수 없습니다.`);
    }
    return found;
  }

  async createBoard(createBoardDto: CreateBoardDto): Promise<Board> {
    const { title, description } = createBoardDto;

    const board = this.boardRepository.create({
      title,
      description,
      status: BoardStatus.PUBLIC,
    });

    await this.boardRepository.save(board);
    return board;
  }
}
