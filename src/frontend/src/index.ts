import { Actor, HttpAgent } from "@dfinity/agent";
import { AuthClient } from "@dfinity/auth-client";
import idlFactory from "./did";
import type { _SERVICE } from "./did";
import { renderIndex } from "./views";
import { renderLoggedIn } from "./views/loggedIn";
import { canisterId as canisterId1 } from "dfx-generated/whoami";
import { canisterId as canisterId2 } from "dfx-generated/whoami_2";

const init = async () => {
  const authClient = await AuthClient.create();
  if (await authClient.isAuthenticated()) {
    handleAuthenticated(authClient);
  }
  renderIndex();

  const loginButton = document.getElementById(
    "loginButton"
  ) as HTMLButtonElement;
  loginButton.onclick = async () => {
    await authClient.login({
      onSuccess: async () => {
        handleAuthenticated(authClient);
      },
    });
  };
};

async function handleAuthenticated(authClient: AuthClient) {
  const identity = await authClient.getIdentity();

  const agent = new HttpAgent({ identity });
  // console.log(process.env.CANISTER_ID);
  const whoami_actor = Actor.createActor<_SERVICE>(idlFactory, {
    agent,
    canisterId: canisterId1,
  });
  const whoami_actor2 = Actor.createActor<_SERVICE>(idlFactory, {
    agent,
    canisterId: canisterId2,
  });
  console.log({ canisterId1, canisterId2 });
  renderLoggedIn(whoami_actor, whoami_actor2, authClient);
}

init();
