import mongoose from 'mongoose';

async function main() {
  try {
    await mongoose.connect('');
  } catch (error) {
    console.log(error);
  }
}

main();
