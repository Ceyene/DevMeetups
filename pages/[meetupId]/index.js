//dependencies
import { MongoClient, ObjectId } from 'mongodb';
import { Fragment } from 'react';
//components
import Head from 'next/head'; //--> allows to add elements to the head sention of html page
import MeetupDetail from '../../components/meetups/MeetupDetail';

function MeetupDetails(props) {
	return (
		<Fragment>
			<Head>
				<title>{props.meetupData.title}</title>
				<meta name="description" content={props.meetupData.description} />
			</Head>
			<MeetupDetail
				image={props.meetupData.image}
				title={props.meetupData.title}
				address={props.meetupData.address}
				description={props.meetupData.description}
			/>
		</Fragment>
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
		fallback: 'blocking', //blocking: list might grow in the future, false: 404 when not finding, true: Next.js will generate dinamically new pages if not finding params value in paths object
		paths: meetups.map((meetup) => ({
			params: { meetupId: meetup._id.toString() },
		})),
	};
}

//fetching data in static pages --> code executed on the building process -> never reach users browser or servers
export async function getStaticProps(context) {
	const meetupId = context.params.meetupId; //taking the id from url params
	//USING MONGODB
	//creating mongo client
	const client = await MongoClient.connect(
		`mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.eusm6.mongodb.net/meetups?retryWrites=true&w=majority`
	);
	//accessing db and collection
	const db = client.db();
	const meetupsCollection = db.collection('meetups');
	//making query for one meetup
	const selectedMeetup = await meetupsCollection.findOne({
		_id: ObjectId(meetupId),
	});
	//closing db connection
	client.close();

	return {
		props: {
			meetupData: {
				id: selectedMeetup._id.toString(),
				title: selectedMeetup.title,
				address: selectedMeetup.address,
				image: selectedMeetup.image,
				description: selectedMeetup.description,
			},
		},
		revalidate: 1, //re pre-generating on the server after deployment
	};
}

export default MeetupDetails;
