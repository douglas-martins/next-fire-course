import { InferGetServerSidePropsType, GetServerSidePropsContext, GetStaticPropsResult } from 'next';
import { getUserWithUsername, postToJSON } from '../../lib/firebase';

import UserProfile from '../../components/UserProfile';
import PostFeed, { PostFeedProps } from '../../components/PostFeed';
import { User } from 'firebase/auth';
import { DocumentData } from 'firebase/firestore';
import { Post } from '../../types';

interface UserProfilePageProps {
  user: User,
  posts: Post[],
}

export async function getServerSideProps(context: GetServerSidePropsContext): Promise<GetStaticPropsResult<UserProfilePageProps>> {
  const { username } = context.query;
  const userDoc: DocumentData = await getUserWithUsername(String(username));

  let user: User = null;
  let posts: Post[] = null;

    if (!userDoc) {
      return {
        notFound: true,
      };
    }

    user = userDoc.data();
    const postsQuery = userDoc.ref
      .collection('posts')
      .where('published', '==', true)
      .orderBy('createdAt', 'desc')
      .limit(5);
    posts = (await postsQuery.get()).docs.map(postToJSON);

  return {
    props: { user, posts },
  };
}

export default function UserProfilePage({ user, posts }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const postFeedProps: PostFeedProps = { posts }
 
  return (
    <main>
      <UserProfile user={user} />
      {PostFeed(postFeedProps).map((post: JSX.Element) => post)}
    </main>
  )
}
