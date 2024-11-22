import { html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { registerPlugin } from "./utils";

@customElement("np-content-comments")
export class Comments extends LitElement {
  @property({ attribute: "data-id" }) id =
    "note1amhn0tq4c8efhjtescrm80qnnnsulagz809h0czv5jmr5245hxrq2zm6kw";
  @property({ attribute: "data-relays" }) relays = "";
  @property({ attribute: "data-client" }) client = "";
  @property({ attribute: "data-user" }) user = "";

  connectedCallback() {
    super.connectedCallback();

    registerPlugin().then((ep) => {
      // @ts-ignore
      this.user = window.nostrSite.user()?.pubkey;
      ep.subscribe("auth", (info: { type: string; pubkey: string }) => {
        console.log("comments auth", info);
        this.user = info.pubkey;
      });
    });
  }

  render() {
    return html`
      <zap-threads
        npubpro=${"true"}
        mode=${"chat"}
        disable=${"likes,zaps"}
        anchor="${this.id}"
        relays="${this.relays}"
        client="${this.client}"
        user=${this.user}
      ></zap-threads>
    `;
  }
}
