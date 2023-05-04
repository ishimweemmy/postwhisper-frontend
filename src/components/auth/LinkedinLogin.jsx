import { LinkedIn } from "react-linkedin-login-oauth2";
// You can use provided image shipped by this package or using your own
import linkedin from "react-linkedin-login-oauth2/assets/linkedin.png";

function LinkedinLogin() {
  const handleLinkedInSuccess = async (data) => {
    try {
      const corsProxyUrl = "https://cors-anywhere.herokuapp.com/";

      const response = await fetch(
        `${corsProxyUrl}https://api.linkedin.com/v2/me`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${data.code}`,
          },
        }
      );
      const datas = await response.json();
      console.log(`DATA RECEIVED IS ${datas}`);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full">
      <LinkedIn
        clientId="77e4t6z5k9k8mv"
        redirectUri="http://localhost:5173"
        state="attgpYvAzS8aEwsf"
        onSuccess={handleLinkedInSuccess}
        onError={(error) => {
          console.log("the error is ", error);
        }}
        scope="r_liteprofile r_emailaddress w_member_social"
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
