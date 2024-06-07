const mongoose = require("mongoose");
const db = require("./models");
const Olahraga = db.olahraga;
const Prize = db.prize;
const Food = db.food;
const Diet = db.diet;

const dummyOlahraga = [
  {
    nama: "Push Up",
    desc: "Latihan untuk memperkuat tubuh bagian atas",
    picUrl: "http://example.com/pushup.jpg",
    references: ["https://example.com/pushup1", "https://example.com/pushup2"],
    reps: "20 kali",
    pointAwarded: 50,
  },
  {
    nama: "Sit Up",
    desc: "Latihan untuk memperkuat otot perut",
    picUrl: "http://example.com/situp.jpg",
    references: ["https://example.com/situp1", "https://example.com/situp2"],
    reps: "30 kali",
    pointAwarded: 40,
  },
  {
    nama: "Squat",
    desc: "Latihan untuk memperkuat kaki dan tubuh bagian bawah",
    picUrl: "http://example.com/squat.jpg",
    references: ["https://example.com/squat1", "https://example.com/squat2"],
    reps: "15 kali",
    pointAwarded: 60,
  },
  {
    nama: "Burpee",
    desc: "Latihan seluruh tubuh untuk meningkatkan kekuatan dan kardio",
    picUrl: "http://example.com/burpee.jpg",
    references: ["https://example.com/burpee1", "https://example.com/burpee2"],
    reps: "10 kali",
    pointAwarded: 80,
  },
  {
    nama: "Lunge",
    desc: "Latihan untuk memperkuat kaki dan meningkatkan keseimbangan",
    picUrl: "http://example.com/lunge.jpg",
    references: ["https://example.com/lunge1", "https://example.com/lunge2"],
    reps: "20 kali",
    pointAwarded: 55,
  },
];

const dummyPrize = [
  {
    nominal: 10000,
    boothname: "Booth A",
    pointNeeded: 100,
  },
  {
    nominal: 20000,
    boothname: "Booth B",
    pointNeeded: 200,
  },
  {
    nominal: 30000,
    boothname: "Booth C",
    pointNeeded: 300,
  },
  {
    nominal: 40000,
    boothname: "Booth D",
    pointNeeded: 400,
  },
  {
    nominal: 50000,
    boothname: "Booth E",
    pointNeeded: 500,
  },
];

const dummyFood = [
  {
    nama: "Nasi Goreng",
    berat: "250 gram",
    portion: 1,
    kalori: 500,
  },
  {
    nama: "Ayam Goreng",
    berat: "150 gram",
    portion: 1,
    kalori: 300,
  },
  {
    nama: "Sate Ayam",
    berat: "200 gram",
    portion: 1,
    kalori: 400,
  },
  {
    nama: "Gado-Gado",
    berat: "300 gram",
    portion: 1,
    kalori: 350,
  },
  {
    nama: "Mie Goreng",
    berat: "200 gram",
    portion: 1,
    kalori: 450,
  },
];

const dummyDiet = [
  {
    nama: "Diet Keto",
    desc: "Diet rendah karbohidrat dan tinggi lemak",
    picUrl: "http://example.com/keto.jpg",
    references: ["https://example.com/keto1", "https://example.com/keto2"],
  },
  {
    nama: "Diet Mediterania",
    desc: "Diet berbasis pola makan tradisional Mediterania",
    picUrl: "http://example.com/mediterania.jpg",
    references: [
      "https://example.com/mediterania1",
      "https://example.com/mediterania2",
    ],
  },
  {
    nama: "Diet Vegan",
    desc: "Diet yang hanya mengonsumsi makanan nabati",
    picUrl: "http://example.com/vegan.jpg",
    references: ["https://example.com/vegan1", "https://example.com/vegan2"],
  },
  {
    nama: "Diet Paleo",
    desc: "Diet yang mengikuti pola makan manusia purba",
    picUrl: "http://example.com/paleo.jpg",
    references: ["https://example.com/paleo1", "https://example.com/paleo2"],
  },
  {
    nama: "Diet Mayo",
    desc: "Diet dengan menghindari garam selama 13 hari",
    picUrl: "http://example.com/mayo.jpg",
    references: ["https://example.com/mayo1", "https://example.com/mayo2"],
  },
];

const seedDatabase = async () => {
  try {
    await Olahraga.deleteMany({});
    await Prize.deleteMany({});
    await Food.deleteMany({});
    await Diet.deleteMany({});

    await Olahraga.insertMany(dummyOlahraga);
    await Prize.insertMany(dummyPrize);
    await Food.insertMany(dummyFood);
    await Diet.insertMany(dummyDiet);

    console.log("Dummy data inserted successfully!");
  } catch (err) {
    console.error("Error inserting dummy data: ", err);
  }
};

module.exports = seedDatabase;
