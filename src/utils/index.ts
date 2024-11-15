export function getRecipientPubkey(npub: string = "") {
  try {
    // @ts-ignore
    const { type, data } = window.nostrSite.nostrTools.nip19.decode(npub);
    switch (type) {
      case "npub":
        return data;
    }
  } catch (e) {
    console.log("bad author", npub, e);
  }
  return "";
}

let pluginPromise: Promise<any> | undefined;

export async function registerPlugin() {
	return pluginPromise;
}

async function startRegisterPlugin() {
  pluginPromise = new Promise(async (ok) => {
    // @ts-ignore
    if (!window.nostrSite)
      await new Promise<Event>((ok) => document.addEventListener("npLoad", ok));
    // @ts-ignore
    ok(window.nostrSite.plugins.register("zapthreads"));
  });
}

startRegisterPlugin();