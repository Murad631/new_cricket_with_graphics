import { BadRequestException } from '@nestjs/common';
import { diskStorage } from 'multer';
import { extname } from 'path';

export const teamLogoUploadOptions = {
  storage: diskStorage({
    destination: './uploads/teams',
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = extname(file.originalname);
      cb(null, `logo-${uniqueSuffix}${ext}`);
    },
  }),
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
      cb(new BadRequestException('Only image files (jpg, jpeg, png) are allowed'), false);
    } else {
      cb(null, true);
    }
  },
};
