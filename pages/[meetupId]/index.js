//dependencies
import { MongoClient } from 'mongodb';
//components
import MeetupDetail from '../../components/meetups/MeetupDetail';

function MeetupDetails() {
	return (
		<MeetupDetail
			image="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Stadtbild_M%C3%BCnchen.jpg/1280px-Stadtbild_M%C3%BCnchen.jpg"
			title="First Meetup"
			address="Some Street 5, Some City"
			description="This is a first meetup"
		/>
	);
}

//preparing paths and working with fallback pages (404 page)
export async function getStaticPaths() {
	//USING MONGODB
	//creating mongo client
	const client = await MongoClient.connect(
		`mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.eusm6.mongodb.net/meetups?retryWrites=true&w=majority`
	);
	//accessing db and collection
	const db = client.db();
	const meetupsCollection = db.collection('meetups');
	//making query only for meetups id and converting them to an array
	const meetups = await meetupsCollection.find({}, { _id: 1 }).toArray();
	//closing db connection
	client.close();

	return {
		fallback: false, //404 when not finding, if true, Next.js will generate dinamically new pages if not finding params value in paths object
		paths: meetups.map((meetup) => ({
			params: { meetupId: meetup._id.toString() },
		})),
	};
}

//fetching data in static pages --> code executed on the building process -> never reach users browser or servers
export async function getStaticProps(context) {
	const meetupId = context.params; //taking the id from url params

	return {
		props: {
			image:
				'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Stadtbild_M%C3%BCnchen.jpg/1280px-Stadtbild_M%C3%BCnchen.jpg',
			id: meetupId,
			title: 'First Meetup',
			address: 'Some Street 5, Some City',
			description: 'This is a first meetup',
		},
		revalidate: 1, //re pre-generating on the server after deployment
	};
}

export default MeetupDetails;
