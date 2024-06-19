import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../lib/prisma';

export async function createIncomeRoute(app: FastifyInstance) {
  app.post('/income', async (req, reply) => {
    const bodySchema = z.object({
      monthlyIncome: z.number().positive().default(0),
      familyIncome: z.number().positive().default(0),
    });

    const parsedBody = bodySchema.safeParse(req.body);
    if (!parsedBody.success) {
      return reply.status(400).send({ message: "Erro na validação dos dados.", errors: parsedBody.error.issues });
    }

    try {
      const income = await prisma.income.create({
        data: parsedBody.data,
      });

      return reply.status(201).send(income);
    } catch (error) {
      console.error(error);
      return reply.status(500).send({ message: "Erro interno do servidor." });
    }
  });
}
