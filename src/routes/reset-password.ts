import { FastifyInstance } from 'fastify';
import { hash } from 'bcryptjs';
import { z } from 'zod';
import { prisma } from "../lib/prisma";
import jwt from 'jsonwebtoken';

// Substitua 'secret' por uma chave secreta forte armazenada em uma variável de ambiente
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function ResetPasswordRoute(app: FastifyInstance) {
  app.post('/reset-password', async (req, reply) => {
    const bodySchema = z.object({
      token: z.string(),
      newPassword: z.string().min(6, "A senha deve ter pelo menos 6 caracteres")
    });

    const parsedBody = bodySchema.safeParse(req.body);
    if (!parsedBody.success) {
      return reply.status(400).send({ message: "Erro na validação dos dados.", errors: parsedBody.error.issues });
    }

    const { token, newPassword } = parsedBody.data;

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

      const hashedPassword = await hash(newPassword, 10);

      await prisma.user.update({
        where: { id: decoded.userId },
        data: { password: hashedPassword }
      });

      return reply.status(200).send({ message: "Senha redefinida com sucesso." });
    } catch (error) {
      console.error(error);
      return reply.status(400).send({ message: "Token inválido ou expirado." });
    }
  });
}
