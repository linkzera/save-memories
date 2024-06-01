import { FastifyInstance } from 'fastify'
import { randomUUID } from 'node:crypto'
import { createWriteStream } from 'node:fs'
import { extname, resolve } from 'node:path'
import { pipeline } from 'node:stream'
import { promisify } from 'node:util'

const pump = promisify(pipeline)

export async function uploadRoutes(app: FastifyInstance) {
  // app.addHook('preHandler', async (request) => {
  //   await request.jwtVerify()
  // })

  app.post('/', async (request, reply) => {
    const upload = await request.file({
      limits: {
        fileSize: 1024 * 1024 * 2, // 2MB
      },
    })

    if (!upload) return reply.status(400).send({ error: 'File not found' })

    const regexIfImageOrVideo = /image\/(png|jpeg|jpg)|video\/(mp4|avi)/
    const isValidFileFormat = regexIfImageOrVideo.test(upload.mimetype)

    if (!isValidFileFormat) {
      return reply.status(400).send({ error: 'File must be a image or video' })
    }

    const fileId = randomUUID()
    const extension = extname(upload.filename)

    const fileName = fileId.concat(extension)

    const writeStream = createWriteStream(
      resolve(__dirname, '../../uploads', fileName),
    )

    await pump(upload.file, writeStream)

    const fullUrl = `${request.protocol}://${request.hostname}`

    const fileUrl = `${fullUrl}/uploads/${fileName}`

    return reply.status(201).send({ fileUrl })
  })
}
