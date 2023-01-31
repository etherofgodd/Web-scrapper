import express from "express";
import axios from 'axios';

import * as cheerio from 'cheerio';

interface Therapist {
  imageUrl: string;
  price: string;
  address: string;
  license: string;
  phoneNumber: string;
  specialties: string[];
}

async function getTherapists(): Promise<Therapist[]> {
  const response = await axios.get('https://www.psychologytoday.com/us/therapists/ga/atlanta?category=african-american');
  const $ = cheerio.load(response.data);

  const therapists: Therapist[] = [];
  $('.listing').each((index, element) => {
    const imageUrl = $(element).find('.mugshot').attr('src');
    const price = $(element).find('.price').text();
    const address = $(element).find('.address').text();
    const license = $(element).find('.license').text();
    const phoneNumber = $(element).find('.phone').text();
    const specialties = $(element).find('.specialties span').map((i, el) => $(el).text()).get();

    therapists.push({
      imageUrl,
      price,
      address,
      license,
      phoneNumber,
      specialties,
    });
  });

  return therapists;
}



const app = express();

app.get('/', (req, res) => {
  try {
    (async () => {
      const therapists = await getTherapists();
      res.json(therapists);
    })();

  } catch (error) {
    console.log(error);
  }
});

app.listen("8080", () => {
  console.log("Server started on port 8080...");
});