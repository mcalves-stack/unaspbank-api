import { FastifyInstance } from 'fastify';
import { compare } from 'bcryptjs';
import { z } from 'zod';
import { prisma } from "../lib/prisma";
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export async function AuthUserRoute(app: FastifyInstance) {
  app.post('/auth', async (req, reply) => {
    const bodySchema = z.object({
      email: z.string().email(),
      password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres")
    });

    const parsedBody = bodySchema.safeParse(req.body);
    if (!parsedBody.success) {
      return reply.status(400).send({ message: "Erro na validação dos dados.", errors: parsedBody.error.issues });
    }

    const { email, password } = parsedBody.data;

    try {
      const user = await prisma.user.findUnique({
        where: { email }
      });

      if (!user) {
        return reply.status(401).send({ message: "E-mail ou senha incorretos." });
      }

      const isPasswordValid = await compare(password, user.password);
      if (!isPasswordValid) {
        return reply.status(401).send({ message: "E-mail ou senha incorretos." });
      }

      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });

      return reply.status(200).send({ token });
    } catch (error) {
      console.error(error);
      return reply.status(500).send({ message: "Erro interno do servidor." });
    }
  });
}