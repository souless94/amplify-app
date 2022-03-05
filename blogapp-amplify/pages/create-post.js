import { withAuthenticator } from "@aws-amplify/ui-react/legacy";
import { useState, useEffect } from "react";
import { API } from "aws-amplify";
import { useRouter } from "next/router";
import { v4 as uuid } from "uuid";
import { createPost } from "../src/graphql/mutations";
// import SimpleMde from "react-simplemde-editor";
const SimpleMde = dynamic(() => import("react-simplemde-editor"), {
  ssr: false,
});

import "easymde/dist/easymde.min.css";
import dynamic from "next/dynamic";

const initalState = {
  title: "",
  content: "",
};

function CreatePost() {
  const [post, setPost] = useState(initalState);
  const { title, content } = post;
  const router = useRouter();
  function onChange(e) {
    setPost({ ...post, [e.target.name]: e.target.value });
  }

  async function createNewPost() {
    if (!title || !content) return;
    const id = uuid();
    post.id = id;
    await API.graphql({
      query: createPost,
      variables: { input: post },
      authMode: "AMAZON_COGNITO_USER_POOLS",
    });
    router.push(`/posts/${id}`);
  }

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-wide mt-6">
        Create New Post
      </h1>
      <input
        onChange={onChange}
        name="title"
        placeholder="title"
        value={post.title}
        className="border-b pb-2 text-lg my-4 focus:outline-none w-full font-light text-gray-500"
      />
      <SimpleMde
        value={post.content}
        onChange={(value) => setPost({ ...post, content: value })}
      />
      <button
        onClick={createNewPost}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
      >
        Create new Post
      </button>
    </div>
  );
}

export default withAuthenticator(CreatePost);
