const utils = require('../utils.js')
const database = require('../database.js')
const nodemailer = require('nodemailer')


const quotations = {
    
  async create (request, response, next) {
    const db = database.get()

    const handlerSerig = {
      pan: "panneaux",
      enseignes: "enseignes",
      autocol: "autocollants",
      textile: "textile",
      stands: "stands",
      obj: "objets pub",
      bache: "baches",
      decovCheck: "déco véhicules",
      tampons: "tampons",
      graph: "graphismes",
      other: "autres"
    }

    const handlerImprim = {
      productType: "type de produit",
      quality: "qualité",
      format: "format",
      amount: "quantité",
      recto: "recto-verso",
      pagesNumber: "nombres de pages",
      fileF: "fichier fourni",
      finition: "finitions",
      remarques: "remarques"
    }

    let quotation = `
    Bonjour Stephane, voici un nouveau devis:\r\n\n`

    if (request.body.company !== undefined) {
      quotation += `- Nom de la compagnie: ${request.body.company}\r\n`
    }

    if (request.body.contatctname !== undefined) {
      quotation += `- Nom du contact: ${request.body.contatctname}\r\n`
    }

    if (request.body.email !== undefined) {
      quotation += `- email: ${request.body.email}\r\n`
    }

    if (request.body.phone !== undefined) {
      quotation += `- téléphone: ${request.body.phone}\r\n`
    }

    if (request.body.address !== undefined) {
      quotation += `- adresse: ${request.body.address}\r\n`
    }

    if (request.body.askForContact) {
      quotation += `- me contacter: oui\r\n`
    }

    quotation += `\n  **** Détails du devis ****\r\n`

    if (request.body.serigraphie) {
      quotation += '\r\n\n[serigraphie] '
      Object.keys(request.body.seriData).forEach(function(key,index) {
        quotation += `\r\n > ${handlerSerig[key]}`
      })
    }

    if (request.body.imprimerieData) {
      quotation += '\r\n\n[imprimerie] '
      Object.keys(request.body.imprimerieData).forEach(function(key,index) {
        quotation += `\r\n > ${handlerImprim[key]}: ${request.body.imprimerieData[key]}`
      })
    }

   try {

        let transporter = await nodemailer.createTransport('smtps://contact.ad2c.fr@gmail.com:P@ssword1!@smtp.gmail.com')

        let mailOptions = {
            from: '"Contact ad2c 👻" <contact.ad2c.fr@gmail.com>', 
            to: 'kevin.videau@gmail.com, contact@ad2c.fr, s.aymon@ad2c.fr',
            subject: 'Nouveau devis ✔', 
            text: quotation
        }

      await transporter.sendMail(mailOptions)

      return response.status(201).json({
        status: 201,
        success: true,
        message: 'Quotation submitted successfully'
      })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = quotations
