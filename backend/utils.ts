import type { z } from 'zod';
import type { NextApiRequest, NextApiResponse } from 'next'

export function validator(dto: z.ZodObject<any>, body: any) {
    const parseResult = dto.safeParse(body);

    if (!parseResult.success) {
        const errorMessage = parseResult.error.issues.map(i => i.message).join(', ');
        console.log("PARSING NOT SUCCESS")
        console.log(errorMessage)
        throw errorMessage
    }

    return parseResult.data
}
