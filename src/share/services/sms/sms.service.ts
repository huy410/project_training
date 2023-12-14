import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Twilio } from 'twilio';

@Injectable()
export default class SmsService {
  private twilioClient: Twilio;

  constructor(private readonly configService: ConfigService) {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;

    this.twilioClient = new Twilio(accountSid, authToken);
  }
  async initiatePhoneNumberVerification(phoneNumber: string, otp: string) {
    // const serviceSid = process.env.TWILIO_VERIFICATION_SERVICE_SID;

    // const otp = hotp({
    //   secret: '12345678901234567890',
    // });
    // console.log(otp);
    return (
      this.twilioClient.messages
        //   .services(serviceSid)
        //   .verifications
        .create({ body: `Your OTP is: ${otp}`, from: process.env.TWILIO_PHONE, to: '+84' + phoneNumber.slice(1) })
    );
  }
}
