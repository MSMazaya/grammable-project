// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next'
import { validator } from '../utils'
import { CreateTaskInput } from './dto/create-task.dto'

const prisma = new PrismaClient()

async function taskController(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        if (req.method === "POST") {
            const { title, taskColumnId } = validator(CreateTaskInput, req.body)
            await prisma.task.create({
                data: {
                    taskColumnId,
                    title,
                }
            })
            res.status(200).send("Success")
            return
        } else if (req.method === "GET") {
            const tasks = await prisma.task.findMany({
                include: {
                    TaskColumn: true
                }
            })
            res.status(200).json(tasks)
            return
        }
    } catch (err: any) {
        res.status(400).send(err.toString())
    }
}

export default taskController
