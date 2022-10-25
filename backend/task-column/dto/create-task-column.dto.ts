import { z } from 'zod';

export const CreateTaskColumnInput = z.object({
    name: z.string(),
})
