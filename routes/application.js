const express = require("express");
const router = express.Router();
const mailgun = require("mailgun-js");
const Application = require("../models/Application");
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");

const API_KEY = process.env.MAILGUN_API_KEY;
const DOMAIN = process.env.MAILGUN_DOMAIN;

const mg = mailgun({apiKey: API_KEY, domain: DOMAIN});

// CREATE *************

const generateNumber = ()=> {
  let val = "";
  for(let i= 0; i<8 ; i++){
    val += Math.floor(Math.random()*9);
  }
  return val;
}

router.post("/application/create", async (req, res) => {
    try {
      const reg = new RegExp(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}/i); 
      const validEmail = reg.test(req.body.emailAddress); // checking if email is valid
      if(validEmail){
        let ref = generateNumber();
      const newApplication = new Application({
        propertyType: req.body.propertyType,
        propertyState: req.body.propertyState,
        propertyUsage: req.body.propertyUsage,
        currentSituation: req.body.currentSituation,
        propertyLocation: req.body.propertyLocation,
        landCost: req.body.landCost,
        estimatedPrice: req.body.estimatedPrice,
        renovationCost: req.body.renovationCost,
        notaryFees: req.body.notaryFees,
        totalCost: req.body.totalCost,
        emailAddress: req.body.emailAddress,
        refNumber: ref
      });
      await newApplication.save();
      res.json({ message: "application registered", refNumber: ref });
      mg.messages().send({
        from: "Mailgun Sandbox <postmaster@"+DOMAIN+">",
        to: req.body.emailAddress,
        subject: "Confirmation de votre demande",
        text: `Bonjour,
        Nous avons bien pris en compte votre demande, votre numéro de dossier est le ${ref}. \n
        Informations relatives à votre demande: \n 
        Type de bien: ${req.body.propertyType} \n 
        Etat de bien: ${req.body.propertyState} \n 
        Usage de bien: ${req.body.propertyUsage} \n 
        Votre situation actuelle: ${req.body.currentSituation} \n 
        Votre adresse: ${req.body.propertyLocation.country} ${req.body.propertyLocation.zip} \n 
        Prix du terrain: ${req.body.landCost} \n 
        Coût construction: ${req.body.estimatedPrice} \n 
        Montant des travaux: ${req.body.renovationCost} \n
        Frais de notaires: ${req.body.notaryFees} \n
        Coût total éstimé: ${req.body.totalCost} \n
        ` 
      }, (error, body) => {
        console.log(body);
      });
      }else{
        return res.json({ message: " your email is not valid"});
      }
    } catch (e) {
      res.status(400).json({ error: "Bad request" });
    }
  });
  
  // READ *************
  
  router.post("/application/", async (req, res) => {
    try {
      const password = SHA256(req.body.password).toString(encBase64);
      const checkPassword = process.env.HASH;
if(password === checkPassword){
  const applications = await Application.find();
  res.json({ applications });
}else{
  res.json({message: "not authorized"})
} 
    } catch (e) {
      res.status(400).json({ error: "Bad request" });
    }
  });

  module.exports = router;
