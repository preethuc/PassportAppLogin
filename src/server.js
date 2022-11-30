import app from "./app"
import mongoose from "mongoose"
mongoose.connect("mongodb://localhost:27017/passport-data")
const db = mongoose.connection
db.on('error', (err) => {
     console.log(err);
})
db.once("open", () => {
     console.log("db connected");
})
// const PORT = process.env.PORT || 3000
app.listen(3000, () => {
     console.log('server running on the port 3000');
 })