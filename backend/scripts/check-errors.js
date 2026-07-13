require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../src/config/database');
const ResumeAnalysis = require('../src/models/analysis.model');

async function main() {
  await connectDB();

  const analyses = await ResumeAnalysis.find({}).lean();
  console.log('Total analysis records found:', analyses.length);
  for (const analysis of analyses) {
    console.log(`- Resume: ${analysis.resume}`);
    console.log(`  Parsing Status: ${analysis.parsingStatus}`);
    console.log(`  Parsing Error: ${analysis.parsingError}`);
    console.log(`  Analysis Status: ${analysis.analysisStatus}`);
    console.log(`  Analysis Error: ${analysis.analysisError}`);
  }

  await mongoose.connection.close();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
