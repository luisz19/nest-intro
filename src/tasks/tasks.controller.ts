import { Body, Controller, Get, NotFoundException, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { TasksService } from './tasks.service';
import type { ITask } from './task.model';
import { CreateTaskDto } from './create-task.dto';
import { FindOneParams } from './find-one.params';

@Controller('tasks')
export class TasksController {

    constructor(private readonly tasksService: TasksService ) {}

    @Get()
    public findAll(): ITask[] {
        return this.tasksService.findAll()
    }

    @Get('/:id')
    public findOne(@Param() params: FindOneParams): ITask {
        const task = this.tasksService.findOne(params.id)

        if(task) {
            return task
        }

        throw new NotFoundException()

        //another way
        // throw new HttpException({
        //     status: HttpStatus.NOT_FOUND,
        //     error: 'It is not possible to find that.',
        // }, HttpStatus.NOT_FOUND, {
        //     cause: 'something caused that'
        // })
    }

    @Post()
    public create(@Body() createTaskDto: CreateTaskDto) {
        return this.tasksService.create(createTaskDto)
    }
}
