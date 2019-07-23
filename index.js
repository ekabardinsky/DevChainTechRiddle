const os = require('os')
const tUpperBound = 600;
const nUpperBound = 11000;

// get data from input stream
const stdinStream = process.stdin.pipe(require('split')());
let rawLines = '';
stdinStream.on('data', chunk => rawLines += chunk + os.EOL);
stdinStream.on('end', () => {
    // ready to process input
    const inputLines = rawLines.trim()
        .split(os.EOL);

    // parse params
    const countOfCases = inputLines.shift();
    const lines = inputLines
        .map(line => {
            const params = line.trim().split(" ");
            return {n: BigInt(params[0].trim()), x: BigInt(params[1].trim())}
        });

    // validate params
    validate(countOfCases, lines);

    // get X child in N generation
    lines
        .forEach(line => {
            console.log(`Child ${line.x} in generation ${line.n}: ${getGenerationChild(line.n, line.x)}`);
        });
});

function getGenerationChild(n, x) {
    let children = ['M'];
    // generate Nst generation
    for (let i = 0; i < n; i++) {
        const invertedChildren = invertPartOfGeneration(children);
        children = children.concat(invertedChildren);

        if (children.length >= x) {
            // take x - 1, because generations starts from 1
            return children[x - 1n]
        }
    }

}

function invertPartOfGeneration(children) {
    return children.map(child => child === 'M' ? 'F' : 'M');
}

function validate(countOfCases, lines) {
    // check lines count
    if (lines.length != countOfCases) {
        throw new Error(`Wrong count of supplied cases`);
    }

    // check T
    if (countOfCases < 1 || countOfCases > tUpperBound) {
        throw new Error(`Please specify parameter T in the following range 1<=T<=${tUpperBound}`);
    }

    // check each line
    lines.forEach(line => {
        if (line.n < 1 || line.n > nUpperBound) {
            throw new Error(`Please specify parameter N in the following range 1<=N<=${nUpperBound}`);
        }

        const xUpperBound = getXUpperBound(line.x);
        if (line.x < 1 || line.x > xUpperBound) {
            throw new Error(`Please specify parameter X in the following range 1<=X<=${xUpperBound}`);
        }
    });
}

function getXUpperBound(n) {
    const tenBasePower = 10n ** 15n;
    const twoBasePower = 2n ** n;

    return tenBasePower > twoBasePower ? tenBasePower : twoBasePower;
}