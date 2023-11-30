import sequelize from "./sequelize.js";
import setupModelRelations from "./modelRelations.js";

const connectDatabase = async () => {
  try {
    setupModelRelations();
    await sequelize.authenticate({ logging: false });
    await sequelize.sync({ logging: false });
    console.log("Database Connected");
  } catch (error) {
    console.log(`Error: ${error.message}`);
  }
};

export default connectDatabase;
