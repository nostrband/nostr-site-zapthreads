import * as fs from 'fs'
import yargs from 'yargs'

let input
let output

try {
	const argv = yargs(process.argv.slice(2)).argv
	input = argv.input ?? './src/modules/tw.css'
	output = argv.output ?? './src/modules/twlit.ts'
} catch (e) {
	console.log(`Error reading input/output parameters ${e}`)
}

console.log(`Reading from file ${input}`)
console.log(`Writing to ${output}`)

fs.readFile(input, { interval: 1000 }, () => {
	try {
		let contents

		try {
			contents = fs.readFileSync(input, 'utf8')
		} catch (e) {
			console.log(
				`Failed to read file ${input}. Might just not be created yet? retrying..`,
			)
		}

		let cleanContents = contents.replaceAll('`', '')
		cleanContents = cleanContents.replaceAll('\\', '\\\\')

		const litContents = `import { css } from "lit";\nexport const TWStyles = css\` ${cleanContents} \`
    `

		fs.writeFileSync(output, litContents)
		console.log(`TWLit - wrote to file ${output}`)
		process.exit(0)
	} catch (err) {
		console.log(err)
	}
})
