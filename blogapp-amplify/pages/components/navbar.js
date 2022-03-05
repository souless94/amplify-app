import Link from "next/link";
import React from "react";
import "../../amplifyConfig";
import { useState, useEffect } from "react";
import { Auth, Hub } from "aws-amplify";

const NavBar = () => {
  const [signedInUser, setSignedInUser] = useState(false);
  useEffect(() => {
    authListener();
  }, []);

  async function authListener() {
    Hub.listen("auth", (data) => {
      switch (data.payload.event) {
        case "signIn":
          return setSignedInUser(true);
        case "signOut":
          return setSignedInUser(false);
        default:
          return setSignedInUser(false);
      }
    });
    try {
      await Auth.currentAuthenticatedUser();
      setSignedInUser(true);
    } catch (err) {
      setSignedInUser(false);
    }
  }

  return (
    <nav className="flex justify-center pt-3 pb-3 space-x-4 border-b bg-cyan-500 border-gray-300">
      {[
        ["Home", "/"],
        ["Create Post", "/create-post"],
        ["Profile", "/profile"],
      ].map(([title, url], index) => (
        <Link key={index} href={url}>
          <a className="rounded-lg px-3 py-2 text-slate-700 font-medium hover:bg-slate-100 hover:text-slate-900">
            {title}
          </a>
        </Link>
      ))}

      {signedInUser && (
        <Link href="/my-posts">
          <a className="rounded-lg px-3 py-2 text-slate-700 font-medium hover:bg-slate-100 hover:text-slate-900">
            My Post
          </a>
        </Link>
      )}
    </nav>
  );
};

export default NavBar;
