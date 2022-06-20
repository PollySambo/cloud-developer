import express from 'express';
import { Request, Response } from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  app.get("/filteredimage/", async (req: Request, res: Response) =>{
    try{
      let image_url =  req.query.image_url;

      if (!image_url) {
        res.status(400).send("Bad Request.");
        return;
      }
      let imageFile = await filterImageFromURL(image_url);
      res.status(200).sendFile(imageFile);
      res.on("finish", () => deleteLocalFiles([imageFile]));
    }
    catch {
      return res.status(422).send('please check image url and try again');
    }
    })
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();