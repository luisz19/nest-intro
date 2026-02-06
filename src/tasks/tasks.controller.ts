import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { TasksService } from './tasks.service';
import type { ITask } from './task.model';

@Controller('tasks')
export class TasksController {

    constructor(private readonly tasksService: TasksService ) {}

    @Get()
    public findAll(): ITask[] {
        return this.tasksService.findAll()
    }

    @Get('/:id')
    public findOne(@Param('id') id: string): ITask {
        const task = this.tasksService.findOne(id)

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
}
