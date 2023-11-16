const express=require('express')
const bodyParser=require('body-parser')
const port =3000
const app = express()
app.use(bodyParser.json())

let buckets={}

//List buckets
app.get('/buckets',(req,res)=>{
    res.json(Object.keys(buckets))
})

//create bucket
app.post('/buckets/:bucketName',(req,res)=>{
    const {bucketName}=req.params
    if(!buckets[bucketName]){
        buckets[bucketName]={};
        res.status(201).send(`Bucket '${bucketName}' created`)
    }else{
        res.status(400).send(`Bucket '${bucketName}' already exists`)
    }
})

// List objects in a bucket
app.get('/buckets/:bucketName/objects',(req,res)=>{
    const {bucketName}=req.params;
    if(bucketName){
        const objects = Object.keys(bucketName).map(objectKey=>({Key:objectKey}))
        res.json(objects)
    }else{
        res.status(404).send(`Bucket '${bucketName}' not found`)
    }
})

//Add object to bucket
app.put('/buckets/:bucketName/objects/:objectKey', (req, res) => {
    const { bucketName, objectKey } = req.params;
    const { content } = req.body;
    const bucket = buckets[bucketName];
    if (bucket) {
      bucket[objectKey] = content;
      res.status(201).send(`Object '${objectKey}' added to bucket '${bucketName}'.`);
    } else {
      res.status(404).send(`Bucket '${bucketName}' not found.`);
    }
  });

// Get object from bucket
  app.get('/buckets/:bucketName/objects/:objectKey', (req, res) => {
    const { bucketName, objectKey } = req.params;
    const bucket = buckets[bucketName];
    if (bucket && bucket[objectKey]) {
      res.json({ [objectKey]: bucket[objectKey] });
    } else {
      res.status(404).send(`Object '${objectKey}' not found in bucket '${bucketName}'.`);
    }
  });

  // Delete object from bucket
  app.delete('/buckets/:bucketName/objects/:objectKey', (req, res) => {
    const { bucketName, objectKey } = req.params;
    const bucket = buckets[bucketName];
    if (bucket && bucket[objectKey]) {
      delete bucket[objectKey];
      res.status(200).send(`Object '${objectKey}' deleted from bucket '${bucketName}'.`);
    } else {
      res.status(404).send(`Object '${objectKey}' not found in bucket '${bucketName}'.`);
    }
  });



//start the server
app.listen(port,()=>{
    console.log(`Server is running on port ${port}`)
})