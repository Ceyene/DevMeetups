//dependencies
import { MongoClient } from 'mongodb';
//components
import MeetupList from '../components/meetups/MeetupList';

function HomePage(props) {
	return <MeetupList meetups={props.meetups} />;
}

//server side rendering --> fetching data
// export async function getServerSideProps(context) {
// 	const req = context.req;
// 	const res = context.res;

// 	// fetch data from an API

// 	return {
// 		props: {
// 			meetups: DUMMY_MEETUPS,
// 		},
// 	};
// }

//fetching data in static pages --> code executed on the building process -> never reach users browser or servers
export async function getStaticProps() {
	//USING MONGODB
	//creating mongo client
	const client = await MongoClient.connect(
		`mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.eusm6.mongodb.net/meetups?retryWrites=true&w=majority`
	);
	//accessing db and collection
	const db = client.db();
	const meetupsCollection = db.collection('meetups');
	//making query for all meetups and converting them to an array
	const meetups = await meetupsCollection.find().toArray();
	//closing db connection
	client.close();

	return {
		props: {
			meetups: meetups.map((meetup) => ({
				title: meetup.title,
				address: meetup.address,
				image: meetup.image,
				description: meetup.description,
				id: meetup._id.toString(),
			})),
		},
		revalidate: 1, //re pre-generating on the server after deployment
	};
}

export default HomePage;
