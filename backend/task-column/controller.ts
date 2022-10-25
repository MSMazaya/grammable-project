// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next'
import { validator } from '../utils'
import { CreateTaskColumnInput } from './dto/create-task-column.dto'

const prisma = new PrismaClient()

async function taskController(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        if (req.method === "POST") {
            const { name } = validator(CreateTaskColumnInput, req.body)
            await prisma.taskColumn.create({
                data: {
                    name,
                }
            })
            res.status(200).send("Success")
            return
        } else if (req.method === "GET") {
            const taskColumns = await prisma.taskColumn.findMany({
                include: {
                    Tasks: true
                }
            })
            res.status(200).json(taskColumns)
            return
        }
    } catch (err: any) {
        res.status(400).send(err.toString())
    }
}

export default taskController
