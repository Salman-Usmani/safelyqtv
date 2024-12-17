import { AuthConfiguration } from "react-native-app-auth";
import Config from "react-native-config";

const config: AuthConfiguration = {
  issuer: `${Config.ISSUER}`,
  clientId: `${Config.CLIENT_ID}`,
  redirectUrl: `${Config.REDIRECT_URL}`,
  additionalParameters: { prompt: "login" },
  scopes: ["openid", "profile", "email"],
  serviceConfiguration: {
    authorizationEndpoint: `${Config.AUTHORIZATION_END_POINT}`,
    tokenEndpoint: `${Config.TOKEN_END_POINT}`,
    revocationEndpoint: `${Config.REVOCATION_END_POINT}`,
  },
};
export { config };
