import { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma'
import { z } from 'zod'

export async function memoriesRoutes(app: FastifyInstance) {
  app.addHook('preHandler', async (request) => {
    await request.jwtVerify()
  })

  app.get('/', async (request) => {
    const allMemories = await prisma.memory.findMany({
      where: {
        userId: request.user.sub,
      },
      orderBy: {
        createdAt: 'asc',
      },
    })

    const formattedMemory = allMemories.map((memory) => {
      return {
        id: memory.id,
        coverUrl: memory.coverUrl,
        excerpt: memory.content.substring(0, 115).concat('...'),
      }
    })
    return formattedMemory
  })

  app.get('/:id', async (request, reply) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })
    const { id } = paramsSchema.parse(request.params)
    const memory = await prisma.memory.findUniqueOrThrow({
      where: { id },
    })

    if (memory.userId !== request.user.sub && !memory.isPublic) {
      return reply.status(401).send({
        message: 'Unauthorized',
      })
    }

    return memory
  })

  app.post('/', async (request) => {
    const bodySchema = z.object({
      content: z.string(),
      isPublic: z.coerce.boolean().default(false),
      coverUrl: z.string().url(),
    })

    const { content, isPublic, coverUrl } = bodySchema.parse(request.body)
    const memory = await prisma.memory.create({
      data: {
        content,
        isPublic,
        coverUrl,
        userId: request.user.sub,
      },
    })

    return memory
  })

  app.put('/:id', async (request, reply) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })
    const { id } = paramsSchema.parse(request.params)

    const bodySchema = z.object({
      content: z.string(),
      isPublic: z.coerce.boolean().default(false),
      coverUrl: z.string().url(),
    })

    const body = bodySchema.parse(request.body)

    let memory = await prisma.memory.findUniqueOrThrow({
      where: { id },
    })

    if (memory.userId !== request.user.sub) {
      return reply.status(401).send({
        message: 'Unauthorized',
      })
    }

    memory = await prisma.memory.update({
      where: { id },
      data: {
        ...body,
      },
    })

    return memory
  })

  app.delete('/:id', async (request, reply) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })
    const { id } = paramsSchema.parse(request.params)

    const memory = await prisma.memory.findUniqueOrThrow({
      where: { id },
    })

    if (memory.userId !== request.user.sub) {
      return reply.status(401).send({
        message: 'Unauthorized',
      })
    }

    return await prisma.memory.delete({
      where: { id },
    })
  })
}
