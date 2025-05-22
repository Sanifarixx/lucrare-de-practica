const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const nodemailer = require('nodemailer');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
}, { timestamps: true });

UserSchema.statics.signup = async function (name, email, password) {
    const exits = await this.findOne({ email });
    if (exits) {
        throw Error('Acest email este deja folosit');
    }
    if (!name || !email || !password) {
        throw Error('Toate câmpurile trebuie completate');
    }
    if (!validator.isEmail(email)) {
        throw Error('Emailul nu este valid');
    }
    if (!validator.isStrongPassword(password)) {
        throw Error('Parola nu este suficient de puternică');
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const user = await this.create({ name, email, password: hash });

    // Configurare email
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
        subject: 'Bun venit în STrelka!',
        text: `Dragă ${name},\n\nBine ai venit în STrelka!\n\nÎți mulțumim că te-ai înregistrat. Acum poți explora platforma noastră pentru a oferi un animal unui centru sau pentru a adopta un animal de la centru. Suntem încântați să te avem alături în comunitatea noastră de iubitori de animale.\n\nDacă ai întrebări sau ai nevoie de ajutor, nu ezita să ne contactezi.\n\nCu drag,\nEchipa STrelka`
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Eroare la trimiterea emailului de bun venit:', error);
    }

    return user;
}

UserSchema.statics.login = async function (email, password) {
    if (!email || !password) {
        throw Error('Toate câmpurile trebuie completate');
    }

    if (!validator.isEmail(email)) {
        throw Error('Emailul nu este valid');
    }

    const user = await this.findOne({ email });
    if (!user) {
        throw Error('Utilizatorul nu a fost găsit');
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        throw Error('Parolă incorectă');
    }

    return user;
}

module.exports = mongoose.model('User', UserSchema);
