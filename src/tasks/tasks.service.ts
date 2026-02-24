import { Injectable } from '@nestjs/common';
import { ITask } from './task.model';
import { CreateTaskDto } from './create-task.dto';
import { randomUUID } from 'node:crypto';

@Injectable()
export class TasksService {
    private tasks: ITask[] = [] //são inseridas aqui

    findAll(): ITask[] {
        return this.tasks
    }

    findOne(id: string): ITask | undefined {
        return this.tasks.find((task) => task.id === id)
    }

    create(createTaskDto: CreateTaskDto): ITask {
        const task: ITask = {
            id: randomUUID(),
            ...createTaskDto //nesse caso só pega as propriedades e copia aqui
        }

        this.tasks.push(task)
        return task
    }

    deleteTask(id: string) {
        this.tasks = this.tasks.filter((task) => task.id != id)
    }

}
