import nodemailer from 'nodemailer';
import hbs from 'nodemailer-express-handlebars';
import path from 'path';

// Export to service
export const TRANSPORTER = nodemailer.createTransport({
  host: 'localhost',
  port: 1025,
  secure: false
});

TRANSPORTER.use(
  'compile',
  hbs({
    viewEngine: {
      extname: '.hbs',
      partialsDir: path.resolve('./src/services/emails'),
      defaultLayout: undefined
    },
    viewPath: path.resolve('./src/services/emails'),
    extName: '.hbs'
  })
);
