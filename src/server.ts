import { fastify } from 'fastify'
import { fastifyCors } from '@fastify/cors'
import { createUserRoute } from './routes/create-user'
import { AuthUserRoute } from './routes/login-user'
import { ForgotPasswordRoute } from './routes/forgot-password';
import { ResetPasswordRoute } from './routes/reset-password';
import { UploadPhotoRoute } from './routes/uploaded-img';
import {  createIncomeRoute } from './routes/income'


const app = fastify()

app.register(fastifyCors, {
  origin: '*',
})


app.register(createUserRoute)
app.register(AuthUserRoute)
app.register(ForgotPasswordRoute)
app.register(ResetPasswordRoute)
app.register(UploadPhotoRoute)
app.register(createIncomeRoute)

require('dotenv').config();

app.listen({
  port: 3333,
  
}).then(() => {
  console.log('HTTP Server Running!')
})
