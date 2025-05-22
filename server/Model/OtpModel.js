const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require('./UserModel');

const otpSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  otpCode: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  }
});

otpSchema.statics.genOtp = async function (name, email, password) {
  const exists = await User.findOne({ email });
  if (exists) {
    throw Error('Emailul este deja folosit');
  }

  if (!name || !email || !password) {
    throw new Error('Toate câmpurile trebuie completate');
  }

  if (!validator.isEmail(email)) {
    throw new Error('Emailul nu este valid');
  }

  if (!validator.isStrongPassword(password)) {
    throw new Error('Parola nu este suficient de puternică');
  }

  const existingOtp = await this.findOne({ email });
  if (existingOtp) {
    if (existingOtp.expiresAt > Date.now()) {
      const timeRemainingMs = existingOtp.expiresAt - Date.now();
      const minutes = Math.floor(timeRemainingMs / 1000 / 60);
      const seconds = Math.floor((timeRemainingMs / 1000) % 60);
      throw new Error(`Un cod OTP a fost deja trimis. Vă rugăm să așteptați ${minutes} min și ${seconds} sec înainte de a cere altul.`);
    } else {
      await this.deleteOne({ email });
    }
  }

  const otp = crypto.randomInt(100000, 999999).toString();
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(otp, salt);
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  const userOtp = await this.create({ name, email, otpCode: hash, expiresAt });

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_APP_PASS
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Strelka - Codul tău OTP',
    text: `Salut, ${name}!\n\nCodul tău OTP este: ${otp}\n\nCodul expiră în 10 minute.\n\nEchipa Strelka 🐾`
  };

  try {
    await transporter.sendMail(mailOptions);
    return userOtp;
  } catch (error) {
    console.error('Eroare la trimiterea emailului OTP:', error);
    await this.deleteOne({ email });
    throw new Error('Trimiterea emailului cu OTP a eșuat');
  }
};

otpSchema.statics.verifyOtp = async function (email, otp) {
  if (!email || !otp) {
    throw new Error('Toate câmpurile trebuie completate');
  }

  const userOtp = await this.findOne({ email });
  if (!userOtp) {
    throw new Error('Nu există un OTP asociat cu acest email');
  }

  if (userOtp.expiresAt < Date.now()) {
    await this.deleteOne({ email });
    throw new Error('Codul OTP a expirat');
  }

  const isMatch = await bcrypt.compare(otp, userOtp.otpCode);
  if (!isMatch) {
    throw new Error('Cod OTP incorect');
  }

  await this.deleteOne({ email });

  return { success: true, message: 'OTP verificat cu succes' };
};

otpSchema.statics.forgotOtp = async function (email) {
  if (!email) {
    throw new Error('Emailul este obligatoriu');
  }
  if (!validator.isEmail(email)) {
    throw new Error('Emailul nu este valid');
  }

  const exists = await User.findOne({ email });
  if (!exists) {
    throw new Error('Acest email nu este înregistrat');
  }

  const existingOtp = await this.findOne({ email });
  if (existingOtp && existingOtp.expiresAt > Date.now()) {
    const timeRemainingMs = existingOtp.expiresAt - Date.now();
    const minutes = Math.floor(timeRemainingMs / 1000 / 60);
    const seconds = Math.floor((timeRemainingMs / 1000) % 60);
    throw new Error(`Un cod OTP a fost deja trimis. Vă rugăm să așteptați ${minutes} min și ${seconds} sec înainte de a cere altul.`);
  } else if (existingOtp) {
    await this.deleteOne({ email });
  }

  const otp = crypto.randomInt(100000, 999999).toString();
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(otp, salt);
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  const userOtp = await this.create({ name: exists.name, email, otpCode: hash, expiresAt });

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_APP_PASS
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Strelka - Resetează-ți parola',
    text: `Salut, ${exists.name}!\n\nAi cerut resetarea parolei. Codul tău OTP este: ${otp}\n\nAcest cod este valabil 10 minute.\n\nDacă nu ai cerut această acțiune, poți ignora acest email.\n\nEchipa Strelka 🐾`
  };

  try {
    await transporter.sendMail(mailOptions);
    return userOtp;
  } catch (error) {
    console.error('Eroare la trimiterea emailului OTP:', error);
    await this.deleteOne({ email });
    throw new Error('Trimiterea emailului cu OTP a eșuat');
  }
};

module.exports = mongoose.model('Otp', otpSchema);
