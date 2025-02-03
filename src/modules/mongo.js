import { MongoClient } from "mongodb";

const uri =
  "mongodb+srv://bolortulga07:kA0w7G2iqwdxUTvb@cluster0.jno1r.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri);

export { client };
