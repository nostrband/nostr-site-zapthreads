import { css, html, LitElement, nothing } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import { TWStyles } from "./modules/twlit";
import { getRecipientPubkey, registerPlugin } from "./utils";

@customElement("np-content-dm")
export class DirectMessage extends LitElement {
  static styles = [
    css`
      :host {
        display: block;
      }
    `,
    TWStyles,
  ];

  @property({ attribute: "data-peer-npub" }) npub = "";
  @property({ attribute: "data-relays" }) relays = "";
  @property({ attribute: "data-user" }) user = "";

  @state() private open = false;
  @state() private authorName: string = "";
  @state() private authorAvatar: string = "";
  @state() private isLoading: boolean = false;

  connectedCallback() {
    super.connectedCallback();

    registerPlugin().then((ep) => {
      // @ts-ignore
      this.user = window.nostrSite.user()?.pubkey || '';
      ep.subscribe("action-dm", () => {
        setTimeout(() => {
          this.handleOpenDialog();
        }, 100);
      });
      ep.subscribe("auth", (info: { type: string; pubkey?: string }) => {
        this.user = info.pubkey || '';
      });

      // @ts-ignore
      const nostrSite = window.nostrSite;
      this.isLoading = true;
      nostrSite.tabReady.then(async () => {
        const renderer = nostrSite.renderer;

        const profiles = await renderer.fetchProfiles([
          getRecipientPubkey(this.npub),
        ]);
        if (profiles.length) {
          const [profile] = profiles;
          this.authorName =
            profile.profile.display_name ||
            profile.profile.name ||
            profile.id.substring(0, 10) + "...";
          this.authorAvatar = profile.profile.picture;
        }
        this.isLoading = false;
      });
    });
  }

  updated() {
    if (this.open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "initial";
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.isLoading = false;
  }

  private handleOpenDialog() {
    this.open = true;
  }

  private handleCloseDialog() {
    this.open = false;
  }

  private renderProfileAvatar() {
    if (this.isLoading) {
      return html`<svg
        aria-hidden="true"
        class="w-[36px] h-[36px] text-gray-200 animate-spin fill-blue-600"
        viewBox="0 0 100 101"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
          fill="currentColor"
        />
        <path
          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
          fill="currentFill"
        />
      </svg>`;
    }
    if (!this.authorAvatar) {
      return html`<svg
        width="60px"
        height="60px"
        viewBox="0 0 26 27"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M17.1346 10.2376C17.1346 11.3339 16.6992 12.3852 15.924 13.1603C15.1489 13.9355 14.0975 14.371 13.0013 14.371C11.9051 14.371 10.8537 13.9355 10.0786 13.1603C9.30344 12.3852 8.86797 11.3339 8.86797 10.2376C8.86797 9.1414 9.30344 8.09007 10.0786 7.31492C10.8537 6.53977 11.9051 6.1043 13.0013 6.1043C14.0975 6.1043 15.1489 6.53977 15.924 7.31492C16.6992 8.09007 17.1346 9.1414 17.1346 10.2376ZM14.6748 11.9111C15.1186 11.4673 15.368 10.8653 15.368 10.2376C15.368 9.60995 15.1186 9.00798 14.6748 8.56414C14.231 8.12031 13.629 7.87096 13.0013 7.87096C12.3736 7.87096 11.7717 8.12031 11.3278 8.56414C10.884 9.00798 10.6346 9.60995 10.6346 10.2376C10.6346 10.8653 10.884 11.4673 11.3278 11.9111C11.7717 12.355 12.3736 12.6043 13.0013 12.6043C13.629 12.6043 14.231 12.355 14.6748 11.9111Z"
          fill="#616161"
          stroke="white"
          stroke-width="0.4"
        />
        <path
          d="M13.0712 17.6203C11.8189 17.6194 10.585 17.921 9.47431 18.4995C8.36364 19.078 7.40915 19.9162 6.69203 20.9428L6.58562 21.0951L6.72972 21.2124C8.50119 22.6545 10.7164 23.4403 13.0007 23.437C15.3253 23.4402 17.577 22.6261 19.3623 21.1372L19.5049 21.0182L19.3967 20.8672C18.6766 19.8618 17.727 19.0428 16.6268 18.4781C15.5267 17.9134 14.3078 17.6194 13.0712 17.6203ZM13.0712 17.6203L13.0711 17.8203L13.0709 17.6203C13.071 17.6203 13.0711 17.6203 13.0712 17.6203ZM3.05065 13.487V13.487C3.05065 15.7974 3.83902 17.9248 5.16011 19.614L5.31976 19.8182L5.47677 19.612C6.36726 18.4426 7.51605 17.4949 8.83341 16.8429C10.1508 16.1909 11.601 15.8524 13.0709 15.8536H13.0713C14.5221 15.8523 15.9541 16.1821 17.2582 16.8179C18.5622 17.4538 19.704 18.3789 20.5964 19.5228L20.7559 19.7273L20.9131 19.5211C21.871 18.2647 22.516 16.7983 22.7947 15.2432C23.0733 13.6881 22.9777 12.089 22.5156 10.5782C22.0536 9.06742 21.2384 7.68837 20.1376 6.55516C19.0367 5.42196 17.6819 4.56718 16.1851 4.06155C14.6883 3.55592 13.0926 3.41398 11.5301 3.64748C9.96758 3.88097 8.48312 4.48319 7.19955 5.4043C5.91597 6.3254 4.87019 7.53892 4.14872 8.94444C3.42726 10.35 3.05085 11.9071 3.05065 13.487ZM1.28398 13.487C1.28398 7.01619 6.52986 1.77031 13.0007 1.77031C19.4714 1.77031 24.7173 7.01619 24.7173 13.487C24.7173 19.9578 19.4714 25.2036 13.0007 25.2036C6.52986 25.2036 1.28398 19.9578 1.28398 13.487Z"
          fill="#616161"
          stroke="white"
          stroke-width="0.4"
        />
      </svg> `;
    }
    return html`<img
      alt="${this.authorName || ""}"
      src="${this.authorAvatar}"
      class="rounded-full h-[60px] w-[60px] object-cover"
    />`;
  }

  render() {
    if (!this.open) return null;
    return html`<div
      class="fixed z-[47] inset-0 h-full w-full flex justify-center ${!this.open
        ? "hidden"
        : ""}"
    >
      <div
        class="absolute h-full w-full z-[999998] bg-black bg-opacity-50 backdrop-blur-sm "
      ></div>
      <div
        class="absolute z-[999999] bottom-0 w-full max-w-[728px] bg-white p-3 rounded-t-[16px] animate-slide-top shadow-dialog max-h-[calc(100%-8px)] overflow-auto"
      >
        <div class="w-full flex justify-end">
          <button
            class="w-[30px] h-[30px] rounded-full hover:bg-[#0000000a] flex items-center justify-center"
            @click=${this.handleCloseDialog}
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 28 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7.18849 19.0508C6.81935 19.4199 6.80177 20.0791 7.19728 20.4658C7.58399 20.8525 8.24317 20.8438 8.61231 20.4746L13.9912 15.0869L19.3789 20.4746C19.7568 20.8525 20.4072 20.8525 20.794 20.4658C21.1719 20.0703 21.1807 19.4287 20.794 19.0508L15.415 13.6631L20.794 8.28419C21.1807 7.90626 21.1807 7.25587 20.794 6.86915C20.3984 6.49122 19.7568 6.48243 19.3789 6.86036L13.9912 12.2481L8.61231 6.86036C8.24317 6.49122 7.5752 6.47364 7.19728 6.86915C6.81056 7.25587 6.81935 7.91505 7.18849 8.28419L12.5762 13.6631L7.18849 19.0508Z"
                fill="#757575"
              />
            </svg>
          </button>
        </div>

        <div class="flex flex-col gap-4 overflow-auto">
          <div class="flex flex-col items-center gap-3">
            <div>${this.renderProfileAvatar()}</div>
            <h1 class="font-semibold text-xl">
              Chat with ${this.authorName || "..."}
            </h1>
          </div>

          <zap-threads
            npubpro=${"true"}
            mode=${"dm"}
            anchor="${this.npub}"
            relays="${this.relays}"
            user=${this.user}
          ></zap-threads>
        </div>
      </div>
    </div>`;
  }
}
