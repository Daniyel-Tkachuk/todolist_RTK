import { FieldError } from "common/types/types"


export type DomainTask = {
  description: string
  title: string
  status: number
  priority: number
  startDate: string
  deadline: string
  id: string
  todoListId: string
  order: number
  addedDate: string
}

export type GetTasksResponse = {
  error: string | null
  totalCount: number
  items: DomainTask[]
}

export type CreateTaskResponse = {
  resultCode: number
  messages: string[]
  fieldsErrors: FieldError[]
  data: {
    item: DomainTask
  }
}

export type DeleteTaskResponse = {
  resultCode: number
  messages: string[]
  fieldsErrors: FieldError[]
  data: {}
}

export type UpdateTaskModel = {
  title: string;
  description: string;
  status: number;
  priority: number;
  startDate: string;
  deadline: string;
};

export type UpdateTaskResponse = {
  resultCode: number
  messages: string[]
  fieldsErrors: FieldError[]
  data: {
    item: DomainTask
  }
}