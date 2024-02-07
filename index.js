import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db=new pg.Client({
  user:"postgres",
  host:"localhost",
  database:"permalist",
  password:"Aryankiran@12",
  port:5432
});

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let items = [
  { id: 1, title: "Buy milk" },
  { id: 2, title: "Finish homework" },
];

app.get("/", async(req, res) => {
  const result=await db.query("SELECT * FROM item ORDER BY id ASC");
  // console.log(result.rows);
  res.render("index.ejs", {
    listTitle: "Today",
    listItems: result.rows,
  });
});

app.post("/add", async(req, res) => {
  const item = req.body.newItem;
  //console.log(item);
  await db.query("INSERT INTO item (title) VALUES ($1)",[item]);
  //items.push({ title: item });
  res.redirect("/");
});

app.post("/edit", async(req, res) => {
  const item=req.body.updatedItemTitle;
  const rid=req.body.updatedItemId;
  // console.log(rid);
  await db.query("UPDATE item SET title=$1 WHERE id=$2",[item,rid]);
  res.redirect("/");
});

app.post("/delete", async(req, res) => {
  const rid=req.body.deleteItemId;
  // console.log(rid);   
  await db.query("DELETE FROM item WHERE id=$1",[rid]);
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
