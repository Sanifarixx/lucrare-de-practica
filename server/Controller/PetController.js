const Pet = require('../Model/PetModel');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

const postPetRequest = async (req, res) => {
  try {
    const { name, age, area, justification, email, phone, type } = req.body;
    const { filename } = req.file;

    const pet = await Pet.create({
      name,
      age,
      area,
      justification,
      email,
      phone,
      type,
      filename,
      status: 'Pending'
    });

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
    subject: 'Confirmare Trimitere Animal - Strelka',
    text: `Dragă ${name},\n\nÎți mulțumim pentru că ai trimis animalul tău spre adopție pe Strelka.\n\nAm primit cererea ta, iar echipa noastră de administratori o analizează în acest moment. După aprobare, animalul tău va fi listat pe platforma noastră și va putea fi adoptat de membrii comunității noastre de iubitori de animale.\n\nÎți mulțumim pentru răbdare și te vom anunța de îndată ce anunțul animalului tău este publicat.\n\nDacă ai întrebări sau ai nevoie de ajutor, nu ezita să ne contactezi.\n\nCu stimă,\nEchipa Strelka`
};

try {
    await transporter.sendMail(mailOptions);
} catch (error) {
    console.error('Eroare la trimiterea emailului de confirmare:', error);
}

res.status(200).json(pet);
} catch (error) {
    res.status(500).json({ error: error.message });
}
};

const approveRequest = async (req, res) => {
try {
    const id = req.params.id;
    const { name, email, phone, status } = req.body;
    const pet = await Pet.findByIdAndUpdate(id, { email, phone, status }, { new: true });

    if (!pet) {
        return res.status(404).json({ error: 'Animalul nu a fost găsit' });
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_APP_PASS
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: pet.email,
        subject: 'Animalul Tău Este Acum Publicat pe Strelka!',
        text: `Dragă Stăpân al lui ${pet.name},\n\nVești bune! Animalul tău a fost aprobat și este acum vizibil pe platforma Strelka.\n\nIubitorii de animale din comunitatea noastră pot acum vedea și adopta animalul tău. Îți mulțumim pentru contribuția ta la comunitatea noastră și pentru că ajuți animalele să-și găsească un nou cămin.\n\nPoți vizualiza anunțul animalului tău conectându-te în contul tău de pe site-ul nostru.\n\nDacă ai întrebări sau ai nevoie de ajutor suplimentar, nu ezita să ne contactezi.\n\nCu stimă,\nEchipa Strelka`
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Eroare la trimiterea emailului de aprobare:', error);
    }

    res.status(200).json(pet);
} catch (err) {
    res.status(500).json({ error: err.message });
}
};

const allPets = async (reqStatus, req, res) => {
try {
    const data = await Pet.find({ status: reqStatus }).sort({ updatedAt: -1 });
    if (data.length > 0) {
        res.status(200).json(data);
    } else {
        res.status(200).json({ error: 'Nu s-au găsit date' });
    }
} catch (err) {
    res.status(500).json({ error: err.message });
}
};

const deletePost = async (req, res) => {
try {
    const id = req.params.id;
    const pet = await Pet.findByIdAndDelete(id);
    if (!pet) {
        return res.status(404).json({ error: 'Animalul nu a fost găsit' });
    }
    const filePath = path.join(__dirname, '../images', pet.filename);

    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_APP_PASS
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: pet.email,
        subject: 'Anunțul Animalului a Fost Eliminat - Strelka',
        text: `Dragă ${pet.name},\n\nDorim să te informăm că anunțul animalului tău a fost eliminat de pe platforma Strelka de către echipa noastră de administratori.\n\nDacă ai întrebări sau dorești să afli mai multe despre această decizie, nu ezita să ne contactezi.\n\nÎți mulțumim pentru înțelegere.\n\nCu stimă,\nEchipa Strelka`
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Eroare la trimiterea emailului de ștergere:', error);
    }

    res.status(200).json({ message: 'Animalul a fost șters cu succes' });
} catch (err) {
    res.status(500).json({ error: err.message });
}
};


module.exports = {
  postPetRequest,
  approveRequest,
  deletePost,
  allPets
};
