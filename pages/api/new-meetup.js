//dependencies
import { MongoClient } from 'mongodb';

// API ROUTE:
// POST /api/new-meetup

async function handler(req, res) {
	try {
		if (req.method === 'POST') {
			const data = req.body;
			const { title, image, address, description } = data; //getting info to be sent to my db

			//USING MONGODB

			//creating mongo client
			const client = await MongoClient.connect(
				`mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.eusm6.mongodb.net/meetups?retryWrites=true&w=majority`
			);
			//creating db and collection
			const db = client.db();
			const meetupsCollection = db.collection('meetups');
			//creating a document
			const result = await meetupsCollection.insertOne(data);
			console.log(result);
			//closing db connection
			client.close();

			res.status(201).json({ message: 'Meetup inserted' });
		}
	} catch (error) {
		console.log(error.message);
	}
}

export default handler;
