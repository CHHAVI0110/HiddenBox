const dns = require("dns");
const mongoose = require("mongoose");

dns.setServers(["192.168.1.1"]);

console.log("DNS:", dns.getServers());

const uri = "mongodb+srv://sharmachavi0110_db_user:chhAVI1010@cluster0.it842as.mongodb.net/hiddenbox?retryWrites=true&w=majority";

mongoose
  .connect(uri)
  .then(() => {
    console.log("MongoDB CONNECTED");
    process.exit(0);
  })
  .catch((error) => {
    console.error("MongoDB FAILED");
    console.error(error);
    process.exit(1);
  });