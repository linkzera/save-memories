import '@fastify/jwt'

declare module '@fastify/jwt' {
  export interface FastifyJWT {
    user: {
      name: string
      avatarUrl: string
      sub: string
    } // user type is return type of `request.user` object
  }
}
