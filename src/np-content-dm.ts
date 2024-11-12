import { css, html, LitElement, nothing } from 'lit'
import { customElement, property, query, state } from 'lit/decorators.js'
import { TWStyles } from './modules/twlit'

async function waitNostrSite() {
	// @ts-ignore
	if (!window.nostrSite)
		await new Promise<Event>((ok) =>
			document.addEventListener('npLoad', ok),
		)
	// @ts-ignore
	return window.nostrSite.plugins.register('content-cta')
}

@customElement('np-content-dm')
export class DirectMessage extends LitElement {
	static styles = [
		css`
			:host {
				display: block;
			}
		`,
		TWStyles,
	]

	@property({ attribute: 'data-npub' }) npub = ''
	@property({ attribute: 'data-relays' }) relays = ''
	@property({ attribute: 'data-user' }) user = ''

	@state() open = false

	pluginEndpoint: any | undefined = undefined

	connectedCallback() {
		super.connectedCallback()

		console.log(this.npub, this.relays, this.user, 'HISH')

		waitNostrSite().then((ep) => {
			this.pluginEndpoint = ep
			ep.subscribe('action-dm', () => {
				this.handleOpenDialog()
			})
		})
	}

	updated() {
		if (this.open) return
		document.body.style.overflow = 'hidden'
	}

	disconnectedCallback(): void {
		super.disconnectedCallback()
		document.body.style.overflow = 'initial'
	}

	private handleOpenDialog() {
		this.open = true
	}

	private handleCloseDialog() {
		this.open = false
	}

	private handleDispatchDm() {
		this.pluginEndpoint?.dispatch('action-dm')
	}

	render() {
		if (!this.open) {
			return html`<button type="button" @click=${this.handleDispatchDm}>
				Open Dialog
			</button>`
		}
		return html`<div
			class="fixed z-[999997] inset-0 h-full w-full flex justify-center"
		>
			<div
				class="absolute h-full w-full z-[999998] bg-black bg-opacity-50 backdrop-blur-sm "
			></div>
			<div
				class="absolute z-[999999] bottom-0 w-full max-w-[728px] bg-white p-3 rounded-t-[16px] animate-slide-top shadow-dialog"
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

				<zap-threads
					mode=${'dm'}
					anchor="${this.npub}"
					relays="${this.relays}"
					user=${this.user}
				></zap-threads>
			</div>
		</div>`
	}
}
