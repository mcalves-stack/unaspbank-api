import { FastifyInstance } from "fastify";
import { fastifyMultipart } from '@fastify/multipart';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import fs from 'node:fs';
import { pipeline } from 'node:stream';
import { promisify } from "node:util";
import { prisma } from "../lib/prisma";

const pump = promisify(pipeline);

export async function UploadPhotoRoute(app: FastifyInstance) {
  app.register(fastifyMultipart, {
    limits: {
      fileSize: 25 * 1024 * 1024, 
    }
  });

  app.post('/upload-photo', async (request, reply) => {
    const data = await request.file();

    if (!data) {
      return reply.status(400).send({ error: 'Missing file input' });
    }

    const extension = path.extname(data.filename).toLowerCase();
    const allowedExtensions = ['.png', '.jpg', '.jpeg', '.gif'];

    if (!allowedExtensions.includes(extension)) {
      return reply.status(400).send({ error: 'Invalid file type, please upload an image (png, jpg, jpeg, gif).' });
    }

    const fileBaseName = path.basename(data.filename, extension);
    const fileUploadName = `${fileBaseName}-${randomUUID()}${extension}`;
    const uploadDestination = path.resolve(__dirname, '../../uploads'); 

    if (!fs.existsSync(uploadDestination)) {
      fs.mkdirSync(uploadDestination, { recursive: true });
    }

    const filePath = path.join(uploadDestination, fileUploadName);
    await pump(data.file, fs.createWriteStream(filePath));


    try {

      return reply.status(200).send({ message: 'Upload successful', fileName: fileUploadName });
    } catch (error) {
      console.error(error);
      return reply.status(500).send({ error: "Erro interno do servidor." });
    }
  });
}
