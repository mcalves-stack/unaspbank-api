import { FastifyInstance } from 'fastify';
import { hash } from 'bcryptjs';
import { z } from 'zod';
import { prisma } from "../lib/prisma";

function isValidDate(value: string): boolean {
  if (value.length !== 8) return false;
  const day = parseInt(value.substring(0, 2), 10);
  const month = parseInt(value.substring(2, 4), 10);
  const year = parseInt(value.substring(4, 8), 10);
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year && date.getMonth() + 1 === month && date.getDate() === day;
}

export async function createUserRoute(app: FastifyInstance) {
  app.post('/user', async (req, reply) => {
    const bodySchema = z.object({
      ra: z.number().int().min(100000).max(999999, "RA deve ter exatamente 6 dígitos"),
      cpf: z.string().length(11, "CPF deve ter exatamente 11 dígitos"),
      phoneNumber: z.string().min(10, "Número de telefone deve ter pelo menos 10 dígitos"),
      email: z.string().email(),
      password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
      dateOfBirth: z.string().refine(isValidDate, { message: "Data de nascimento inválida. Use o formato 'DDMMYYYY'." })
    });

    const parsedBody = bodySchema.safeParse(req.body);
    if (!parsedBody.success) {
      return reply.status(400).send({ message: "Erro na validação dos dados.", errors: parsedBody.error.issues });
    }

    const { password, ...userData } = parsedBody.data;
    const hashedPassword = await hash(password, 10);

    try {
      const user = await prisma.user.create({
        data: {
          ...userData,
          password: hashedPassword,
        }
      });

      const { password: _, ...userWithoutPassword } = user;
      return reply.status(201).send({ ...userWithoutPassword }); 
    } catch (error) {
      if (error.code === 'P2002') {
        return reply.status(409).send({ message: "O e-mail fornecido já está em uso." });
      }
      console.error(error);
      return reply.status(500).send({ message: "Erro interno do servidor." });
    }
  });
}