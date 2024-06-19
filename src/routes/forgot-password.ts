import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from "../lib/prisma";
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET

export async function ForgotPasswordRoute(app: FastifyInstance) {
  app.post('/forgot-password', async (req, reply) => {
    const bodySchema = z.object({
      email: z.string().email()
    });

    const parsedBody = bodySchema.safeParse(req.body);
    if (!parsedBody.success) {
      return reply.status(400).send({ message: "Erro na validação dos dados.", errors: parsedBody.error.issues });
    }

    const { email } = parsedBody.data;

    try {
      const user = await prisma.user.findUnique({
        where: { email }
      });

      if (!user) {
        return reply.status(404).send({ message: "Usuário não encontrado." });
      }

      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });

      await prisma.user.update({
        where: { email },
        data: {
          resetToken: token,
          resetTokenExpiry: new Date(Date.now() + 3600000)
        }
      });

      return reply.status(200).send({ message: "Token de redefinição de senha gerado e armazenado no banco de dados." });
    } catch (error) {
      console.error(error);
      return reply.status(500).send({ message: "Erro interno do servidor." });
    }
  });
}
