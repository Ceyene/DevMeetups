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
export function getStaticPaths() {
	return {
		fallback: false, //404 when not finding, if true, Next.js will generate dinamically new pages if not finding params value in paths object
		paths: {
			params: {
				meetupId: 'm1',
			},
			params: {
				meetupId: 'm2',
			},
		},
	};
}

//fetching data in static pages --> code executed on the building process -> never reach users browser or servers
export async function getStaticProps(context) {
	const meetupId = context.params; //taking the id from url params
	// fetch data from an API
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
