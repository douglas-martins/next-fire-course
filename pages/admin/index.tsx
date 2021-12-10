import { FormEvent, useContext, useState } from 'react';
import { useRouter } from 'next/router';
import { useCollection } from 'react-firebase-hooks/firestore';
import kebabCase from 'lodash.kebabcase';
import toast from 'react-hot-toast';

import AuthCheck from "../../components/AuthCheck"
import styles from '../../styles/Admin.module.css';
import PostFeed, { PostFeedProps } from '../../components/PostFeed';
import { UserContext } from '../../lib/context';
import { firestore, auth, serverTimestamp } from '../../lib/firebase';
import { Post } from '../../types';

export default function AdminPostsPage({ }) {
  return (
    <main>
      <AuthCheck>
        <PostList />
        <CreateNewPost />
      </AuthCheck>
    </main>
  )
}

function PostList() {
  const ref: any = firestore.collection('users').doc(auth.currentUser.uid).collection('posts');
  const query = ref.orderBy('createdAt');
  const [querySnapshot] = useCollection(query);

  const posts: Post[] = querySnapshot?.docs.map((doc) => doc.data() as Post);
  const postFeedProps: PostFeedProps = { posts, admin: true }

  return (
    <>
      <h1>Manage your Posts</h1>
      {PostFeed(postFeedProps)?.map((post: JSX.Element) => post)}
    </>
  )
}

function CreateNewPost() {
  const router = useRouter();
  const { username } = useContext(UserContext);
  const [title, setTitle] = useState('');

  const slug = encodeURI(kebabCase(title));
  const isValid = title.length > 3 && title.length < 100;
  
  const createPost = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const uid = auth.currentUser.uid;
    const ref = firestore.collection('users').doc(uid).collection('posts').doc(slug);

    const data: Post = {
      title,
      slug,
      uid,
      username,
      published: false,
      content: '# hello world',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      heartCount: 0,
    };

    await ref.set(data)

    toast.success('Post created!');

    router.push(`/admin/${slug}`);
  };

  return (
    <form onSubmit={createPost}>
      <input
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="My Awesome Article!"
        className={styles.input}
      />
      <p>
        <strong>Slug: </strong> {slug}
      </p>
      <button type="submit" disabled={!isValid} className="btn-green">
        Creatw New Post
      </button>
    </form>
  )
}
