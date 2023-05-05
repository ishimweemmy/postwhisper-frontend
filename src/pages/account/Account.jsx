import { useSelector } from "react-redux";
import LinkedinLogin from "../../components/auth/LinkedinLogin";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const Account = () => {
  const user = useSelector((state) => state.user);
  console.log(user.accessToken);

  const [userPost, setUserPost] = useState("");

  const [userPosts, setUserPosts] = useState([]);

  const corsProxyUrl = "https://cors-anywhere.herokuapp.com/";

  const handleChange = (e) => setUserPost(e.target.value);

  const handlePost = async (e) => {
    e.preventDefault();

    try {
      const accessToken = user.accessToken;
      const requestBody = {
        author: `urn:li:person:${user.id}`,
        lifecycleState: "PUBLISHED",
        specificContent: {
          "com.linkedin.ugc.ShareContent": {
            shareCommentary: {
              text: userPost,
            },
            shareMediaCategory: "NONE",
          },
        },
        visibility: {
          "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
        },
      };

      if (!accessToken) {
        return toast.error("you forgot to connect to your linkedin account");
      }
      await fetch(`${corsProxyUrl}https://api.linkedin.com/v2/ugcPosts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          "X-Restli-Protocol-Version": "2.0.0",
        },
        body: JSON.stringify(requestBody),
      })
        .then((data) => {
          data.json();
          return toast.success("You have successfully posted!", {
            position: toast.POSITION.TOP_CENTER,
          });
        })
        .catch((error) =>
          toast.error(
            "invalid credentials. check whether you have connected to linkedin",
            { position: toast.POSITION.TOP_CENTER }
          )
        );
    } catch (error) {
      toast.error("server error. try again in few minutes !!", {
        position: toast.POSITION.TOP_CENTER,
      });
    }
  };

  const fetchLatestPosts = async (accessToken) => {
    console.log(user.profilePic)
    const response = await fetch(
      `${corsProxyUrl}https://api.linkedin.com/v2/shares?q=owners&owners=urn:li:person:${user.id}&count=4`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      return toast.error(
        "failed to fetch the latest posts. try again later!!",
        {
          position: toast.POSITION.TOP_CENTER,
        }
      );
    }

    const { elements } = await response.json();
    setUserPosts(elements);
    return elements;
  };

  return (
    <div className="w-full h-screen flex flex-col justify-start bg-white">
      <div className="h-[4rem] w-full flex justify-center items-center mx-auto shadow-sm bg-[#00ffffb7] px-[5rem]">
        <LinkedinLogin />
        <div className="w-full h-full flex items-center justify-center gap-4">
          <h1>{user.firstName}</h1>
          <h1>{user.lastName}</h1>
          {user && user.profilePic ? (
            <img src={user.profilePic} alt="" className="rounded-full" />
          ) : (
            "No profile picture available"
          )}
        </div>
        <button
          className={`w-[80%] h-[2.3rem] ${user.accessToken ? "bg-green-500" : "bg-[#ff0000bd]"}`}
          type="button"
        >
          {user.accessToken ? "connected to your linkedin account" : "connect to linkedin account"}
        </button>
      </div>
      <form
        onSubmit={handlePost}
        className="w-full h-fit flex flex-col items-center justify-center py-[2rem] gap-2"
      >
        <span className="text-lg font-bold">post something</span>
        <textarea
          name=""
          id=""
          cols="30"
          rows="50"
          className="w-[80%] h-[10rem] border p-2 text-gray-500 outline-none"
          disabled={!user.accessToken ? true : false}
          onChange={handleChange}
        ></textarea>
        <button className="w-[80%] h-[2.3rem] bg-[#00ffffb7]">
          Go ahead and post
        </button>
        <button
          className="w-[80%] h-[2.3rem] bg-[#00ffffb7]"
          type="button"
          onClick={() => fetchLatestPosts(user.accessToken)}
        >
          Get latest posts
        </button>
      </form>

      <div className="w-full h-[20rem] grid grid-cols-2 items-center gap-4 px-2">
        {userPosts.forEach((post) => {
          const titleAndDescription =
            post.specificContent["com.linkedin.ugc.ShareContent"].media[0];
          return (
            <div className="w-full h-[5rem] flex flex-col items-center justify-center gap-2">
              <span className="text-blue-700">
                {titleAndDescription.title.text}
              </span>
              <p className="text-center text-sm text-gray-700 ">
                {titleAndDescription.description.text}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Account;
