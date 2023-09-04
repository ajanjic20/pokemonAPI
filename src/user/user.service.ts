import {
  Injectable,
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas/user.schema';
import * as crypto from 'crypto';
import { ConfigService } from '@nestjs/config';
import { GetUserInfoDto } from './userInfoDto/userInfo-req.dto';
import { RegisterDto } from 'src/user/registerDto/register-req.dto';

@Injectable()
export class UserService {
  private aesKey: Buffer;

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private configService: ConfigService,
  ) {
    this.aesKey = crypto.randomBytes(32);
  }

  aesPassphrase = this.configService.get('AES_PASSPHRASE');

  async createUser(dto: RegisterDto, hashedPassword: string) {
    if (await this.userModel.findOne({ phone: dto.phone }).exec()) {
      throw new HttpException('Number already taken', HttpStatus.BAD_REQUEST);
    }

    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem',
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem',
        cipher: 'aes-256-cbc',
        passphrase: this.aesPassphrase,
      },
    });

    const encryptedAesKey = crypto.publicEncrypt(publicKey, this.aesKey);

    if (!(await this.userModel.findOne({ email: dto.email }).exec())) {
      const encryptedPhone = this.aesEncrypt(dto.phone, this.aesKey);
      const encryptedName = this.aesEncrypt(dto.name, this.aesKey);

      await this.userModel.create({
        email: dto.email,
        name: encryptedName,
        phone: encryptedPhone,
        password: hashedPassword,
        encryptedAesKey: encryptedAesKey,
        privateKey: privateKey,
      });

      return 'Successfully created account';
    } else {
      throw new HttpException('E-mail already taken', HttpStatus.BAD_REQUEST);
    }
  }

  async getUser({ email }) {
    return this.userModel.findOne({
      email,
    });
  }

  async getUserInfo(
    dto: GetUserInfoDto,
    loggedUserEmail: string,
  ): Promise<{
    name: string;
    email: string;
    phone: string;
  }> {
    if (!(loggedUserEmail === dto.email)) {
      throw new UnauthorizedException(
        `You are not authorized to access this user's data`,
      );
    }
    const user = await this.getUser({ email: dto.email });

    const decryptedAESKey = crypto.privateDecrypt(
      {
        key: user.privateKey,
        passphrase: this.aesPassphrase,
      },
      user.encryptedAesKey,
    );

    const decryptedName = this.aesDecrypt(user.name, decryptedAESKey);
    const decryptedPhone = this.aesDecrypt(user.phone, decryptedAESKey);

    return {
      name: decryptedName,
      email: user.email,
      phone: decryptedPhone,
    };
  }

  aesEncrypt(data: string, key: Buffer): string {
    const iv = crypto.randomBytes(16);

    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);

    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const encryptedData = iv.toString('hex') + encrypted;

    return encryptedData;
  }

  aesDecrypt(encryptedData: string, key: Buffer): string {
    const iv = Buffer.from(encryptedData.slice(0, 32), 'hex');
    const encryptedText = encryptedData.slice(32);

    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);

    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  }
}
