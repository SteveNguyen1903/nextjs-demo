import React from 'react';
import MeetupDetail from '../../components/meetups/MeetupDetail';
import { MongoClient, ObjectId } from 'mongodb';

const MeetupDetails = (props) => {
	return (
		<>
			<MeetupDetail image={props.meetupData.image} title={props.meetupData.title} address={props.meetupData.address} description={props.meetupData.description} />
		</>
	);
};

export const getStaticPaths = async () => {
	const client = await MongoClient.connect('mongodb+srv://steve-hqn:B0MyNCdGH0PqWWkI@cluster0.hhmlesf.mongodb.net/?retryWrites=true&w=majority');
	const db = client.db();

	const meetupsCollection = db.collection('meetups');

	const meetups = await meetupsCollection.find({}, { _id: 1 }).toArray();

	client.close();

	return {
		fallback: 'blocking',
		paths: meetups.map((meetup) => ({
			params: { meetupId: meetup._id.toString() },
		})),
	};
};

export const getStaticProps = async (context) => {
	//fetch data

	const meetupId = context.params.meetupId;

	const client = await MongoClient.connect('mongodb+srv://steve-hqn:B0MyNCdGH0PqWWkI@cluster0.hhmlesf.mongodb.net/?retryWrites=true&w=majority');
	const db = client.db();

	const meetupsCollection = db.collection('meetups');

	const selectedMeetup = await meetupsCollection.findOne({
		_id: ObjectId(meetupId),
	});

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
	};
};

export default MeetupDetails;
