export function getRecipientPubkey(npub: string = '') {
	try {
		// @ts-ignore
		const { type, data } = window.nostrSite.nostrTools.nip19.decode(npub)
		switch (type) {
			case 'npub':
				return data
		}
	} catch (e) {
		console.log('bad author', npub, e)
	}
	return ''
}
