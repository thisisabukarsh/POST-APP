import { Sequelize } from "sequelize";

const sequelize = new Sequelize("abd", "abd", "abd1", {
  host: "195.201.114.229",
  dialect: "mysql",
});

sequelize
  .authenticate()
  .then(() => {
    console.log("Connected to MySQL Database!");
  })
  .catch((err) => {
    console.error("Error connecting to MySQL database:", err);
  });

export default sequelize;
