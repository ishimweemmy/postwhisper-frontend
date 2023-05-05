import { LinkedIn } from "react-linkedin-login-oauth2";
import linkedin from "react-linkedin-login-oauth2/assets/linkedin.png";
import { useDispatch } from "react-redux";
import { linkedinAuth } from "../../features/userSlice";
import { toast } from "react-toastify";
import { useCallback } from "react";

function LinkedinLogin() {
  const dispatch = useDispatch();

  const handleLinkedInSuccess = useCallback(async (data) => {
    try {
      const corsProxyUrl = "https://cors-anywhere.herokuapp.com/";

      const response = await fetch(
        `${corsProxyUrl}https://www.linkedin.com/oauth/v2/accessToken`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: `grant_type=authorization_code&code=${data}&redirect_uri=${"http://localhost:5173/linkedin"}&client_id=${"77e4t6z5k9k8mv"}&client_secret=${"attgpYvAzS8aEwsf"}`,
        }
      );

      const fetchedData = await response.json();
      const accessToken = fetchedData.access_token;

      const userResponse = await fetch(
        `${corsProxyUrl}https://api.linkedin.com/v2/me?projection=(id,firstName,lastName,profilePicture(displayImage~:playableStreams))`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const datas = await userResponse.json();

      if (!datas) {
        return toast.error(
          "An error occured while connecting to your linkedin account"
        );
      }

      dispatch(
        linkedinAuth({
          firstName: datas.firstName.localized.en_US,
          lastName: datas.lastName.localized.en_US,
          profilePic:
            datas.profilePicture["displayImage~"].elements[0].identifiers[0]
              .identifier,
          id: datas.id,
          accessToken,
        })
      );
    } catch (error) {
      toast.error("linkedin server has failed. Try again later!", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  }, [])

  return (
    <div className="w-1/2">
      <LinkedIn
        clientId="77e4t6z5k9k8mv"
        redirectUri="http://localhost:5173/linkedin"
        state={"attgpYvAzS8aEwsf"}
        onSuccess={handleLinkedInSuccess}
        onError={(error) => {
          console.log("the error is ", error);
        }}
        scope="profile email openid r_liteprofile w_member_social r_emailaddress"
      >
        {({ linkedInLogin }) => (
          <img
            onClick={linkedInLogin}
            src={linkedin}
            alt="Sign in with Linked In"
            style={{ maxWidth: "180px", cursor: "pointer" }}
          />
        )}
      </LinkedIn>
    </div>
  );
}

export default LinkedinLogin;
