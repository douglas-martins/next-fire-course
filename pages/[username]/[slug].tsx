import { useDocumentData } from 'react-firebase-hooks/firestore';
import { InferGetStaticPropsType, GetStaticPropsResult, GetStaticPathsResult } from 'next';
import Link from 'next/link';

import styles from '../../styles/Post.module.css';
import PostContent from '../../components/PostContent';
import HeartButton from '../../components/HeartButton';
import AuthCheck from '../../components/AuthCheck';
import { firestore, getUserWithUsername, postToJSON } from '../../lib/firebase';
import { Post as PostData } from '../../types';
import { DocumentData, DocumentReference } from 'firebase/firestore';

type Path = {
  username: string,
  slug: string,
}

interface PostProps {
  post: PostData,
  path: string,
}

export async function getStaticProps({ params }): Promise<GetStaticPropsResult<PostProps>> {
  const { username, slug } = params;
  const userDoc = await getUserWithUsername(username);

  let post: PostData = null;
  let path: any = null;

  if (userDoc) {
    const postRef = userDoc.ref.collection('posts').doc(slug);
    post = postToJSON(await postRef.get());

    path = postRef.path;
  }

  return {
    props: { post, path },
    revalidate: 5000,
  };
}

export async function getStaticPaths(): Promise<GetStaticPathsResult<Path>> {
    const snapshot = await firestore.collectionGroup('posts').get();

  const paths = snapshot.docs.map((doc) => {
    const { slug, username } = doc.data();
    return {
      params: { username, slug },
    };
  });

  return {
    paths,
    fallback: 'blocking',
  };
}


export default function Post(props: InferGetStaticPropsType<typeof getStaticProps>) {
  const postRef = firestore.doc(props.path);
  const [realtimePost] = useDocumentData(postRef);

  const post = realtimePost || props.post;

  return (
    <main className={styles.container}>
      <section>
        <PostContent post={post} />
      </section>

      <aside className="card">
        <p>
          <strong>{post.heartCount || 0} 🤍</strong>
        </p>

        <AuthCheck
          fallback={
            <Link href="/enter">
              <button>💗 Sign Up</button>
            </Link>
          }
        >
          <HeartButton postRef={postRef} />
        </AuthCheck>
      </aside>
    </main>
  )
}
