import { app } from "./app.js";
import { client } from "./mongo.js";

app.listen(3000, () => {
  client
    .connect()
    .then(() => {
      console.log("connected");
    })
    .catch(() => {
      console.log("conection error");
    });
  console.log("server started on 3000");
});
