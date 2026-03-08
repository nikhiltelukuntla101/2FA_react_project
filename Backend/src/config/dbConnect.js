import { connect } from "mongoose";
export const dbConnect = async () => {
  try {
    const mongoDbConnection = await connect(process.env.CONNECTION_STRING);
    console.log(`Database connected ${mongoDbConnection.connection.host}`);
  } catch (error) {
    console.log(`Database connection error ${error}`);
    process.exit(1);
  }
};
