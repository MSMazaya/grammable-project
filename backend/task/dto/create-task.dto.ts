import { z } from 'zod';

export const CreateTaskInput = z.object({
    title: z.string(),
    taskColumnId: z.number()
})
