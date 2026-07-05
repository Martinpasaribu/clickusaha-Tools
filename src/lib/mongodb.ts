/* eslint-disable @typescript-eslint/no-explicit-any */
// src/lib/mongodb.ts



// import { MongoClient } from 'mongodb';

// if (!process.env.MONGODB_URI) {
//   throw new Error('Pastikan Anda sudah mengatur MONGODB_URI di file .env.local');
// }

// const uri = process.env.MONGODB_URI;
// const options = {};

// let client: MongoClient;
// let clientPromise: Promise<MongoClient>;

// if (process.env.NODE_ENV === 'development') {
//   // Dalam mode pengembangan, gunakan variabel global agar koneksi tidak terputus saat hot-reload.
//   let globalWithMongo = global as typeof globalThis & {
//     _mongoClientPromise?: Promise<MongoClient>;
//   };

//   if (!globalWithMongo._mongoClientPromise) {
//     client = new MongoClient(uri, options);
//     globalWithMongo._mongoClientPromise = client.connect();
//   }
//   clientPromise = globalWithMongo._mongoClientPromise;
// } else {
//   // Dalam mode produksi, lebih baik tidak menggunakan variabel global.
//   client = new MongoClient(uri, options);
//   clientPromise = client.connect();
// }

// export default clientPromise;