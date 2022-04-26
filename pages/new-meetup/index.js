//dependencies
import { useRouter } from 'next/router';
import { Fragment } from 'react';
import Head from 'next/head'; //--> allows to add elements to the head sention of html page
// our-domain.com/new-meetup
import NewMeetupForm from '../../components/meetups/NewMeetupForm';

function NewMeetupPage() {
	const router = useRouter();

	async function addMeetupHandler(enteredMeetupData) {
		const response = await fetch('/api/new-meetup', {
			method: 'POST',
			body: JSON.stringify(enteredMeetupData),
			headers: {
				'Content-Type': 'application/json',
			},
		});
		const data = await response.json();
		console.log(data);

		//navigating away after creating meeting
		router.push('/');
	}

	return (
		<Fragment>
			<Head>
				<title>Add a New Meetup</title>
				<meta
					name="description"
					content="Add a new Dev meetup. Small project in React, NextJS and MongoDB by Cynthia Romero"
				/>
			</Head>
			<NewMeetupForm onAddMeetup={addMeetupHandler} />
		</Fragment>
	);
}

export default NewMeetupPage;
