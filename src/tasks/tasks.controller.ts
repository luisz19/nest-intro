import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './create-task.dto';
import { FindOneParams } from './find-one.params';
import { UpdateTaskDto } from './update-task.dto';
import { WrongTaskStatusException } from './exceptions/wrong-task-status.exception';
import { Task } from './task.entity';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  public async findAll(): Promise<Task[]> {
    return this.tasksService.findAll();
  }

  @Get('/:id')
  public async findOne(@Param() params: FindOneParams): Promise<Task> {
    return this.findOneOrFail(params.id);

    //another way
    // throw new HttpException({
    //     status: HttpStatus.NOT_FOUND,
    //     error: 'It is not possible to find that.',
    // }, HttpStatus.NOT_FOUND, {
    //     cause: 'something caused that'
    // })
  }

  @Post()
  public async create(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    return await this.tasksService.createTask(createTaskDto);
  }

  // @Patch('/:id/status')
  // public updateTaskStatus(
  //     @Param() params: FindOneParams,
  //     @Body() body: UpdateTaskStatusDto
  // ) {
  //     const task = this.findOneOrFail(params.id)
  //     task.status = body.status

  //     return task
  // }

  @Patch('/:id')
  public async updateTask(
    @Param() params: FindOneParams,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    const task = await this.findOneOrFail(params.id); //valida existência da task antes de passar para o service
    try {
      return await this.tasksService.updateTask(task, updateTaskDto);
    } catch (error) {
      if (error instanceof WrongTaskStatusException) {
        throw new BadRequestException([error.message]);
      }

      throw error;
    }
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT) //retorna status de NO CONTENT
  public async deleteTask(@Param() params: FindOneParams): Promise<void> {
    const task = await this.findOneOrFail(params.id);
    await this.tasksService.deleteTask(task);
  }

  // centralizar lógica para evitar repetição
  private async findOneOrFail(id: string): Promise<Task> {
    const task = await this.tasksService.findOne(id);

    if (!task) {
      throw new NotFoundException();
    }

    return task;
  } //recomendável passar para um service, mas nesse caso é mais simples deixar aqui
}
