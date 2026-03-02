import { BadRequestException, Body, Controller, Delete, Get, HttpCode, HttpStatus, NotFoundException, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { TasksService } from './tasks.service';
import type { ITask } from './task.model';
import { CreateTaskDto } from './create-task.dto';
import { FindOneParams } from './find-one.params';
import { UpdateTaskStatusDto } from './update-task-status.dto';
import { UpdateTaskDto } from './update-task.dto';
import { WrongTaskStatusException } from './exceptions/wrong-task-status.exception';

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
    public updateTask(
        @Param() params: FindOneParams,
        @Body() updateTaskDto: UpdateTaskDto
    ): ITask {
        const task = this.findOneOrFail(params.id) //valida existência da task antes de passar para o service
        try {
            return this.tasksService.updateTask(task, updateTaskDto)

        } catch(error) {
            if(error instanceof WrongTaskStatusException) {
                throw new BadRequestException([error.message])
            }

            throw error
        }


    
    }

    @Delete('/:id')
    @HttpCode(HttpStatus.NO_CONTENT) //retorna status de NO CONTENT
    public deleteTask(@Param() params: FindOneParams): void {
        const task = this.findOneOrFail(params.id)
        this.tasksService.deleteTask(task)
    }

    // centralizar lógica para evitar repetição
    private findOneOrFail(id: string): ITask {
        const task = this.tasksService.findOne(id)

        if(!task) {
            throw new NotFoundException()
        }

        return task
    } //recomendável passar para um service, mas nesse caso é mais simples deixar aqui
}
