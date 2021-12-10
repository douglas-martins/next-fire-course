import { InferGetServerSidePropsType, GetServerSidePropsContext, GetStaticPropsResult } from 'next';
import { useState } from 'react';

import PostFeed, { PostFeedProps } from '../components/PostFeed';
import Loader from '../components/Loader';
import { firestore, fromMillis, postToJSON } from '../lib/firebase';
import { Post } from '../types';

const LIMIT = 1;

interface HomeProps {
	posts: Post[]
}

export async function getServerSideProps(conext: GetServerSidePropsContext): Promise<GetStaticPropsResult<HomeProps>> {
	const postsQuery = firestore
		.collectionGroup('posts')
		.where('published', '==', true)
		.orderBy('createdAt', 'desc')
		.limit(LIMIT);
	
	const posts = (await postsQuery.get()).docs.map(postToJSON);
	
	return {
		props: { posts },
	}
}

export default function Home(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
	const [posts, setPosts] = useState(props.posts);
  const [loading, setLoading] = useState(false);
	const [postsEnd, setPostsEnd] = useState(false);
	
	const getMorePosts = async () => {
		setLoading(true);
		const last = posts[posts.length - 1];
		const cursor = typeof last.createdAt === 'number' ? fromMillis(last.createdAt) : last.createdAt;

		const query = firestore
			.collectionGroup('posts')
			.where('published', '==', true)
			.orderBy('createdAt', 'desc')
			.startAfter(cursor)
			.limit(LIMIT);
		
		const newPosts: any[] = (await query.get()).docs.map((doc) => doc.data());

		setPosts(posts.concat(newPosts));
		setLoading(false);

		if (newPosts.length < LIMIT) {
			setPostsEnd(true);
		}
	};

	const postFeedProps: PostFeedProps = { posts }

	return (
		<main>
			{PostFeed(postFeedProps).map((post: JSX.Element) => post)}

			{!loading && !postsEnd && <button onClick={getMorePosts}>Load more</button>}

			<Loader show={loading} />

			{postsEnd && 'You have reached the end!'}
		</main>
	);
}
