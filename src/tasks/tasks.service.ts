import { Injectable } from '@nestjs/common';
import { ITask } from './task.model';
import { CreateTaskDto } from './create-task.dto';
import { randomUUID } from 'node:crypto';
import { UpdateTaskDto } from './update-task.dto';

@Injectable()
export class TasksService {
    private tasks: ITask[] = [] //são inseridas aqui

    public findAll(): ITask[] {
        return this.tasks
    }

    public findOne(id: string): ITask | undefined {
        return this.tasks.find((task) => task.id === id)
    }

    public create(createTaskDto: CreateTaskDto): ITask {
        const task: ITask = {
            id: randomUUID(),
            ...createTaskDto //nesse caso só pega as propriedades e copia aqui
        }

        this.tasks.push(task)
        return task
    }

    public updateTask(task: ITask, updateTaskDto: UpdateTaskDto): ITask {
        Object.assign(task, updateTaskDto) //copia as propriedades do updateTaskDto para task (função simplicada)

        return task
    }

    public deleteTask(task: ITask): void {
        this.tasks = this.tasks.filter(
            (filtredTask) => filtredTask.id !== task.id
        )
    }

}
