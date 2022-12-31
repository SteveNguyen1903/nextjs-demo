import Head from 'next/head';
import { MongoClient } from 'mongodb';
import MeetupList from '../components/meetups/MeetupList';
import React from 'react';

const HomePage = (props) => {
	return (
		<>
			<Head>
				<title>Meetup</title>
				<meta name="description" content="browse a huge list of active react meetups" />
			</Head>
			<MeetupList meetups={props.meetups} />;
		</>
	);
};

//codes do not reach client side
export const getStaticProps = async () => {
	//fetch api
	const client = await MongoClient.connect('mongodb+srv://steve-hqn:B0MyNCdGH0PqWWkI@cluster0.hhmlesf.mongodb.net/?retryWrites=true&w=majority');
	const db = client.db();

	const meetupsCollection = db.collection('meetups');

	const meetups = await meetupsCollection.find().toArray();

	client.close();

	return {
		props: {
			meetups: meetups.map((meetup) => ({
				title: meetup.title,
				address: meetup.address,
				description: meetup.description,
				image: meetup.image,
				id: meetup._id.toString(),
			})),
		},
		revalidate: 10,
	};
};

// export const getServerSideProps = async (context) => {
// 	const req = context.req;
// 	const res = context.res;
// 	//fetch api
// 	return {
// 		props: {
// 			meetups: DUMMY_MEETUPS,
// 		},
// 	};
// };

export default HomePage;
