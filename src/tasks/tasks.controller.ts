import { Body, Controller, Get, NotFoundException, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { TasksService } from './tasks.service';
import type { ITask } from './task.model';
import { CreateTaskDto } from './create-task.dto';
import { FindOneParams } from './find-one.params';
import { UpdateTaskStatusDto } from './update-task-status.dto';

@Controller('tasks')
export class TasksController {

    constructor(private readonly tasksService: TasksService ) {}

    @Get()
    public findAll(): ITask[] {
        return this.tasksService.findAll()
    }

    @Get('/:id')
    public findOne(@Param() params: FindOneParams): ITask {
        return this.findOneOrFail(params.id)

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

    @Patch('/:id/status')
    public updateTaskStatus(
        @Param() params: FindOneParams,
        @Body() body: UpdateTaskStatusDto
    ) {
        const task = this.findOneOrFail(params.id)
        task.status = body.status

        return task
    }

    // centralizar lógica para evitar repetição
    private findOneOrFail(id: string): ITask {
        const task = this.tasksService.findOne(id)

        if(!task) {
            throw new NotFoundException()
        }

        return task
    }
}
