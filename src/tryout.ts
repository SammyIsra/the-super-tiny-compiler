import * as language from "./the-super-tiny-compiler";

const input = '(add 2 (subtract 4 2)) (concat "String is" (add 4 5))';

console.log(`
**************
Tryout run:

INPUT:
${input}

OUTPUT:
${language.compiler(input)}
**************
`);
