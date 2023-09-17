const express=require("express");
const axios=require("axios")
const path=require("path")
const hbs=require("hbs");
const app=express();
const PORT= process.env.PORT || 8000;

const viewPath=path.join(__dirname,"./views");

const publicPath=path.join(__dirname,"../public");


app.set('view engine', 'hbs');
app.set('views',viewPath);

app.use(express.static(publicPath));

app.use(express.json());  //to read json
app.use(express.urlencoded({ extended: false })); //use this to get/extract the data from input

hbs.registerHelper('addOne', function(value) {
    return value + 1;
  });

  function diff(a,b){
    if(a==b || a==0 || b==0)
    {return 0}
    let d=100-((a/b)*100)
    return d.toFixed(2)
  }
  function saving(a,b){
    let s=(a-b).toFixed(2);
    return s;
  }

app.get("/",async (req,res)=>{
    try{
        const response = await axios.get('https://api.wazirx.com/api/v2/tickers');
        if (response.status !==200) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
    const data = response.data;
    
    const top10Data = Object.values(data).slice(0, 10);
    const modifiedData = await top10Data.map((item) => ({
        ...item,
        diff: `${diff(item.sell,item.buy)}`,
        saving:`${saving(item.sell,item.buy)}`
      }));

    res.render("index",{title:"API Data",data:modifiedData});
    
    }catch(err){
        console.log(err);
        res.render(err);
    }


    
})

app.listen(PORT,()=>{
    console.log(`Listening to the port no ${PORT}`)
})