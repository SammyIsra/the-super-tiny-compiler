"use strict";

import {
  Token,
  SimpleAST,
  CallExpressionNode,
  TransformedASTNode,
  TransformedAST,
  ExpressionStatementNode,
  ASTBodyNode,
  TransformedArgumentNode
} from "./types";

/*
 * TTTTTTTTTTTTTTTTTTTTTTTHHHHHHHHH     HHHHHHHHHEEEEEEEEEEEEEEEEEEEEEE
 * T:::::::::::::::::::::TH:::::::H     H:::::::HE::::::::::::::::::::E
 * T:::::::::::::::::::::TH:::::::H     H:::::::HE::::::::::::::::::::E
 * T:::::TT:::::::TT:::::THH::::::H     H::::::HHEE::::::EEEEEEEEE::::E
 * TTTTTT  T:::::T  TTTTTT  H:::::H     H:::::H    E:::::E       EEEEEE
 *         T:::::T          H:::::H     H:::::H    E:::::E
 *         T:::::T          H::::::HHHHH::::::H    E::::::EEEEEEEEEE
 *         T:::::T          H:::::::::::::::::H    E:::::::::::::::E
 *         T:::::T          H:::::::::::::::::H    E:::::::::::::::E
 *         T:::::T          H::::::HHHHH::::::H    E::::::EEEEEEEEEE
 *         T:::::T          H:::::H     H:::::H    E:::::E
 *         T:::::T          H:::::H     H:::::H    E:::::E       EEEEEE
 *       TT:::::::TT      HH::::::H     H::::::HHEE::::::EEEEEEEE:::::E
 *       T:::::::::T      H:::::::H     H:::::::HE::::::::::::::::::::E
 *       T:::::::::T      H:::::::H     H:::::::HE::::::::::::::::::::E
 *       TTTTTTTTTTT      HHHHHHHHH     HHHHHHHHHEEEEEEEEEEEEEEEEEEEEEE
 *
 *    SSSSSSSSSSSSSSS UUUUUUUU     UUUUUUUUPPPPPPPPPPPPPPPPP   EEEEEEEEEEEEEEEEEEEEEERRRRRRRRRRRRRRRRR
 *  SS:::::::::::::::SU::::::U     U::::::UP::::::::::::::::P  E::::::::::::::::::::ER::::::::::::::::R
 * S:::::SSSSSS::::::SU::::::U     U::::::UP::::::PPPPPP:::::P E::::::::::::::::::::ER::::::RRRRRR:::::R
 * S:::::S     SSSSSSSUU:::::U     U:::::UUPP:::::P     P:::::PEE::::::EEEEEEEEE::::ERR:::::R     R:::::R
 * S:::::S             U:::::U     U:::::U   P::::P     P:::::P  E:::::E       EEEEEE  R::::R     R:::::R
 * S:::::S             U:::::U     U:::::U   P::::P     P:::::P  E:::::E               R::::R     R:::::R
 *  S::::SSSS          U:::::U     U:::::U   P::::PPPPPP:::::P   E::::::EEEEEEEEEE     R::::RRRRRR:::::R
 *   SS::::::SSSSS     U:::::U     U:::::U   P:::::::::::::PP    E:::::::::::::::E     R:::::::::::::RR
 *     SSS::::::::SS   U:::::U     U:::::U   P::::PPPPPPPPP      E:::::::::::::::E     R::::RRRRRR:::::R
 *        SSSSSS::::S  U:::::U     U:::::U   P::::P              E::::::EEEEEEEEEE     R::::R     R:::::R
 *             S:::::S U:::::U     U:::::U   P::::P              E:::::E               R::::R     R:::::R
 *             S:::::S U::::::U   U::::::U   P::::P              E:::::E       EEEEEE  R::::R     R:::::R
 * SSSSSSS     S:::::S U:::::::UUU:::::::U PP::::::PP          EE::::::EEEEEEEE:::::ERR:::::R     R:::::R
 * S::::::SSSSSS:::::S  UU:::::::::::::UU  P::::::::P          E::::::::::::::::::::ER::::::R     R:::::R
 * S:::::::::::::::SS     UU:::::::::UU    P::::::::P          E::::::::::::::::::::ER::::::R     R:::::R
 *  SSSSSSSSSSSSSSS         UUUUUUUUU      PPPPPPPPPP          EEEEEEEEEEEEEEEEEEEEEERRRRRRRR     RRRRRRR
 *
 * TTTTTTTTTTTTTTTTTTTTTTTIIIIIIIIIINNNNNNNN        NNNNNNNNYYYYYYY       YYYYYYY
 * T:::::::::::::::::::::TI::::::::IN:::::::N       N::::::NY:::::Y       Y:::::Y
 * T:::::::::::::::::::::TI::::::::IN::::::::N      N::::::NY:::::Y       Y:::::Y
 * T:::::TT:::::::TT:::::TII::::::IIN:::::::::N     N::::::NY::::::Y     Y::::::Y
 * TTTTTT  T:::::T  TTTTTT  I::::I  N::::::::::N    N::::::NYYY:::::Y   Y:::::YYY
 *         T:::::T          I::::I  N:::::::::::N   N::::::N   Y:::::Y Y:::::Y
 *         T:::::T          I::::I  N:::::::N::::N  N::::::N    Y:::::Y:::::Y
 *         T:::::T          I::::I  N::::::N N::::N N::::::N     Y:::::::::Y
 *         T:::::T          I::::I  N::::::N  N::::N:::::::N      Y:::::::Y
 *         T:::::T          I::::I  N::::::N   N:::::::::::N       Y:::::Y
 *         T:::::T          I::::I  N::::::N    N::::::::::N       Y:::::Y
 *         T:::::T          I::::I  N::::::N     N:::::::::N       Y:::::Y
 *       TT:::::::TT      II::::::IIN::::::N      N::::::::N       Y:::::Y
 *       T:::::::::T      I::::::::IN::::::N       N:::::::N    YYYY:::::YYYY
 *       T:::::::::T      I::::::::IN::::::N        N::::::N    Y:::::::::::Y
 *       TTTTTTTTTTT      IIIIIIIIIINNNNNNNN         NNNNNNN    YYYYYYYYYYYYY
 *
 *         CCCCCCCCCCCCC     OOOOOOOOO     MMMMMMMM               MMMMMMMMPPPPPPPPPPPPPPPPP   IIIIIIIIIILLLLLLLLLLL             EEEEEEEEEEEEEEEEEEEEEERRRRRRRRRRRRRRRRR
 *      CCC::::::::::::C   OO:::::::::OO   M:::::::M             M:::::::MP::::::::::::::::P  I::::::::IL:::::::::L             E::::::::::::::::::::ER::::::::::::::::R
 *    CC:::::::::::::::C OO:::::::::::::OO M::::::::M           M::::::::MP::::::PPPPPP:::::P I::::::::IL:::::::::L             E::::::::::::::::::::ER::::::RRRRRR:::::R
 *   C:::::CCCCCCCC::::CO:::::::OOO:::::::OM:::::::::M         M:::::::::MPP:::::P     P:::::PII::::::IILL:::::::LL             EE::::::EEEEEEEEE::::ERR:::::R     R:::::R
 *  C:::::C       CCCCCCO::::::O   O::::::OM::::::::::M       M::::::::::M  P::::P     P:::::P  I::::I    L:::::L                 E:::::E       EEEEEE  R::::R     R:::::R
 * C:::::C              O:::::O     O:::::OM:::::::::::M     M:::::::::::M  P::::P     P:::::P  I::::I    L:::::L                 E:::::E               R::::R     R:::::R
 * C:::::C              O:::::O     O:::::OM:::::::M::::M   M::::M:::::::M  P::::PPPPPP:::::P   I::::I    L:::::L                 E::::::EEEEEEEEEE     R::::RRRRRR:::::R
 * C:::::C              O:::::O     O:::::OM::::::M M::::M M::::M M::::::M  P:::::::::::::PP    I::::I    L:::::L                 E:::::::::::::::E     R:::::::::::::RR
 * C:::::C              O:::::O     O:::::OM::::::M  M::::M::::M  M::::::M  P::::PPPPPPPPP      I::::I    L:::::L                 E:::::::::::::::E     R::::RRRRRR:::::R
 * C:::::C              O:::::O     O:::::OM::::::M   M:::::::M   M::::::M  P::::P              I::::I    L:::::L                 E::::::EEEEEEEEEE     R::::R     R:::::R
 * C:::::C              O:::::O     O:::::OM::::::M    M:::::M    M::::::M  P::::P              I::::I    L:::::L                 E:::::E               R::::R     R:::::R
 *  C:::::C       CCCCCCO::::::O   O::::::OM::::::M     MMMMM     M::::::M  P::::P              I::::I    L:::::L         LLLLLL  E:::::E       EEEEEE  R::::R     R:::::R
 *   C:::::CCCCCCCC::::CO:::::::OOO:::::::OM::::::M               M::::::MPP::::::PP          II::::::IILL:::::::LLLLLLLLL:::::LEE::::::EEEEEEEE:::::ERR:::::R     R:::::R
 *    CC:::::::::::::::C OO:::::::::::::OO M::::::M               M::::::MP::::::::P          I::::::::IL::::::::::::::::::::::LE::::::::::::::::::::ER::::::R     R:::::R
 *      CCC::::::::::::C   OO:::::::::OO   M::::::M               M::::::MP::::::::P          I::::::::IL::::::::::::::::::::::LE::::::::::::::::::::ER::::::R     R:::::R
 *         CCCCCCCCCCCCC     OOOOOOOOO     MMMMMMMM               MMMMMMMMPPPPPPPPPP          IIIIIIIIIILLLLLLLLLLLLLLLLLLLLLLLLEEEEEEEEEEEEEEEEEEEEEERRRRRRRR     RRRRRRR
 *
 * =======================================================================================================================================================================
 * =======================================================================================================================================================================
 * =======================================================================================================================================================================
 * =======================================================================================================================================================================
 */

/*
 * Today we're going to write a compiler together. But not just any compiler... A
 * super duper teeny tiny compiler! A compiler that is so small that if you
 * remove all the comments this file would only be ~200 lines of actual code.
 *
 * We're going to compile some lisp-like function calls into some C-like
 * function calls.
 *
 * If you are not familiar with one or the other. I'll just give you a quick intro.
 *
 * If we had two functions `add` and `subtract` they would be written like this:
 *
 *                  LISP                      C
 *
 *   2 + 2          (add 2 2)                 add(2, 2)
 *   4 - 2          (subtract 4 2)            subtract(4, 2)
 *   2 + (4 - 2)    (add 2 (subtract 4 2))    add(2, subtract(4, 2))
 *
 * Easy peezy right?
 *
 * Well good, because this is exactly what we are going to compile. While this
 * is neither a complete LISP or C syntax, it will be enough of the syntax to
 * demonstrate many of the major pieces of a modern compiler.
 */

/*
 * Most compilers break down into three primary stages: Parsing, Transformation,
 * and Code Generation
 *
 * 1. *Parsing* is taking raw code and turning it into a more abstract
 *    representation of the code.
 *
 * 2. *Transformation* takes this abstract representation and manipulates to do
 *    whatever the compiler wants it to.
 *
 * 3. *Code Generation* takes the transformed representation of the code and
 *    turns it into new code.
 */

/*
 * Parsing
 * -------
 *
 * Parsing typically gets broken down into two phases: Lexical Analysis and
 * Syntactic Analysis.
 *
 * 1. *Lexical Analysis* takes the raw code and splits it apart into these things
 *    called tokens by a thing called a tokenizer (or lexer).
 *
 *    Tokens are an array of tiny little objects that describe an isolated piece
 *    of the syntax. They could be numbers, labels, punctuation, operators,
 *    whatever.
 *
 * 2. *Syntactic Analysis* takes the tokens and reformats them into a
 *    representation that describes each part of the syntax and their relation
 *    to one another. This is known as an intermediate representation or
 *    Abstract Syntax Tree.
 *
 *    An Abstract Syntax Tree, or AST for short, is a deeply nested object that
 *    represents code in a way that is both easy to work with and tells us a lot
 *    of information.
 *
 * For the following syntax:
 *
 *   (add 2 (subtract 4 2))
 *
 * Tokens might look something like this:
 *
 *   [
 *     { type: 'paren',  value: '('        },
 *     { type: 'name',   value: 'add'      },
 *     { type: 'number', value: '2'        },
 *     { type: 'paren',  value: '('        },
 *     { type: 'name',   value: 'subtract' },
 *     { type: 'number', value: '4'        },
 *     { type: 'number', value: '2'        },
 *     { type: 'paren',  value: ')'        },
 *     { type: 'paren',  value: ')'        },
 *   ]
 *
 * And an Abstract Syntax Tree (AST) might look like this:
 *
 *   {
 *     type: 'Program',
 *     body: [{
 *       type: 'CallExpression',
 *       name: 'add',
 *       params: [{
 *         type: 'NumberLiteral',
 *         value: '2',
 *       }, {
 *         type: 'CallExpression',
 *         name: 'subtract',
 *         params: [{
 *           type: 'NumberLiteral',
 *           value: '4',
 *         }, {
 *           type: 'NumberLiteral',
 *           value: '2',
 *         }]
 *       }]
 *     }]
 *   }
 */

/*
 * Transformation
 * --------------
 *
 * The next type of stage for a compiler is transformation. Again, this just
 * takes the AST from the last step and makes changes to it. It can manipulate
 * the AST in the same language or it can translate it into an entirely new
 * language.
 *
 * Let’s look at how we would transform an AST.
 *
 * You might notice that our AST has elements within it that look very similar.
 * There are these objects with a type property. Each of these are known as an
 * AST Node. These nodes have defined properties on them that describe one
 * isolated part of the tree.
 *
 * We can have a node for a "NumberLiteral":
 *
 *   {
 *     type: 'NumberLiteral',
 *     value: '2',
 *   }
 *
 * Or maybe a node for a "CallExpression":
 *
 *   {
 *     type: 'CallExpression',
 *     name: 'subtract',
 *     params: [...nested nodes go here...],
 *   }
 *
 * When transforming the AST we can manipulate nodes by
 * adding/removing/replacing properties, we can add new nodes, remove nodes, or
 * we could leave the existing AST alone and create an entirely new one based
 * on it.
 *
 * Since we’re targeting a new language, we’re going to focus on creating an
 * entirely new AST that is specific to the target language.
 *
 * Traversal
 * ---------
 *
 * In order to navigate through all of these nodes, we need to be able to
 * traverse through them. This traversal process goes to each node in the AST
 * depth-first.
 *
 *   {
 *     type: 'Program',
 *     body: [{
 *       type: 'CallExpression',
 *       name: 'add',
 *       params: [{
 *         type: 'NumberLiteral',
 *         value: '2'
 *       }, {
 *         type: 'CallExpression',
 *         name: 'subtract',
 *         params: [{
 *           type: 'NumberLiteral',
 *           value: '4'
 *         }, {
 *           type: 'NumberLiteral',
 *           value: '2'
 *         }]
 *       }]
 *     }]
 *   }
 *
 * So for the above AST we would go:
 *
 *   1. Program - Starting at the top level of the AST
 *   2. CallExpression (add) - Moving to the first element of the Program's body
 *   3. NumberLiteral (2) - Moving to the first element of CallExpression's params
 *   4. CallExpression (subtract) - Moving to the second element of CallExpression's params
 *   5. NumberLiteral (4) - Moving to the first element of CallExpression's params
 *   6. NumberLiteral (2) - Moving to the second element of CallExpression's params
 *
 * If we were manipulating this AST directly, instead of creating a separate AST,
 * we would likely introduce all sorts of abstractions here. But just visiting
 * each node in the tree is enough for what we're trying to do.
 *
 * The reason I use the word "visiting" is because there is this pattern of how
 * to represent operations on elements of an object structure.
 *
 * Visitors
 * --------
 *
 * The basic idea here is that we are going to create a “visitor” object that
 * has methods that will accept different node types.
 *
 *   var visitor = {
 *     NumberLiteral() {},
 *     CallExpression() {},
 *   };
 *
 * When we traverse our AST, we will call the methods on this visitor whenever we
 * "enter" a node of a matching type.
 *
 * In order to make this useful we will also pass the node and a reference to
 * the parent node.
 *
 *   var visitor = {
 *     NumberLiteral(node, parent) {},
 *     CallExpression(node, parent) {},
 *   };
 *
 * However, there also exists the possibility of calling things on "exit". Imagine
 * our tree structure from before in list form:
 *
 *   - Program
 *     - CallExpression
 *       - NumberLiteral
 *       - CallExpression
 *         - NumberLiteral
 *         - NumberLiteral
 *
 * As we traverse down, we're going to reach branches with dead ends. As we
 * finish each branch of the tree we "exit" it. So going down the tree we
 * "enter" each node, and going back up we "exit".
 *
 *   -> Program (enter)
 *     -> CallExpression (enter)
 *       -> Number Literal (enter)
 *       <- Number Literal (exit)
 *       -> Call Expression (enter)
 *          -> Number Literal (enter)
 *          <- Number Literal (exit)
 *          -> Number Literal (enter)
 *          <- Number Literal (exit)
 *       <- CallExpression (exit)
 *     <- CallExpression (exit)
 *   <- Program (exit)
 *
 * In order to support that, the final form of our visitor will look like this:
 *
 *   var visitor = {
 *     NumberLiteral: {
 *       enter(node, parent) {},
 *       exit(node, parent) {},
 *     }
 *   };
 */

/*
 * Code Generation
 * ---------------
 *
 * The final phase of a compiler is code generation. Sometimes compilers will do
 * things that overlap with transformation, but for the most part code
 * generation just means take our AST and string-ify code back out.
 *
 * Code generators work several different ways, some compilers will reuse the
 * tokens from earlier, others will have created a separate representation of
 * the code so that they can print node linearly, but from what I can tell most
 * will use the same AST we just created, which is what we’re going to focus on.
 *
 * Effectively our code generator will know how to “print” all of the different
 * node types of the AST, and it will recursively call itself to print nested
 * nodes until everything is printed into one long string of code.
 */

/*
 * And that's it! That's all the different pieces of a compiler.
 *
 * Now that isn’t to say every compiler looks exactly like I described here.
 * Compilers serve many different purposes, and they might need more steps than
 * I have detailed.
 *
 * But now you should have a general high-level idea of what most compilers look
 * like.
 *
 * Now that I’ve explained all of this, you’re all good to go write your own
 * compilers right?
 *
 * Just kidding, that's what I'm here to help with :P
 *
 * So let's begin...
 */

/*
 * ============================================================================
 *                                   (/^▽^)/
 *                                THE TOKENIZER!
 * ============================================================================
 */

/*
 * We're gonna start off with our first phase of parsing, lexical analysis, with
 * the tokenizer.
 *
 * We're just going to take our string of code and break it down into an array
 * of tokens.
 *
 *   (add 2 (subtract 4 2))   =>   [{ type: 'paren', value: '(' }, ...]
 */

// We start by accepting an input string of code, and we're gonna set up two
// things...
/** Tokenizer function, first step in the compiling process */
export function tokenizer(input: string): Token[] {
  // A `current` variable for tracking our position in the code like a cursor.
  let current = 0;

  // And a `tokens` array for pushing our tokens to.
  const tokens: Token[] = [];

  // We start by creating a `while` loop where we are setting up our `current`
  // variable to be incremented as much as we want `inside` the loop.
  //
  // We do this because we may want to increment `current` many times within a
  // single loop because our tokens can be any length.
  while (current < input.length) {
    // We're also going to store the `current` character in the `input`.
    let char = input[current];

    // The first thing we want to check for is an open parenthesis. This will
    // later be used for `CallExpression` but for now we only care about the
    // character.
    //
    // We check to see if we have an open parenthesis:
    if (char === "(") {
      // If we do, we push a new token with the type `paren` and set the value
      // to an open parenthesis.
      tokens.push({
        type: "paren",
        value: "("
      });

      // Then we increment `current`
      current++;

      // And we `continue` onto the next cycle of the loop.
      continue;
    }

    // Next we're going to check for a closing parenthesis. We do the same exact
    // thing as before: Check for a closing parenthesis, add a new token,
    // increment `current`, and `continue`.
    if (char === ")") {
      tokens.push({
        type: "paren",
        value: ")"
      });
      current++;
      continue;
    }

    // Moving on, we're now going to check for whitespace. This is interesting
    // because we care that whitespace exists to separate characters, but it
    // isn't actually important for us to store as a token. We would only throw
    // it out later.
    //
    // So here we're just going to test for existence and if it does exist we're
    // going to just `continue` on.
    const WHITESPACE = /\s/;
    if (WHITESPACE.test(char)) {
      current++;
      continue;
    }

    // The next type of token is a number. This is different than what we have
    // seen before because a number could be any number of characters and we
    // want to capture the entire sequence of characters as one token.
    //
    //   (add 123 456)
    //        ^^^ ^^^
    //        Only two separate tokens
    //
    // So we start this off when we encounter the first number in a sequence.
    const NUMBERS = /[0-9]/;
    if (NUMBERS.test(char)) {
      // We're going to create a `value` string that we are going to push
      // characters to.
      let value = "";

      // Then we're going to loop through each character in the sequence until
      // we encounter a character that is not a number, pushing each character
      // that is a number to our `value` and incrementing `current` as we go.
      while (NUMBERS.test(char)) {
        value += char;
        char = input[++current];
      }

      // After that we push our `number` token to the `tokens` array.
      tokens.push({ type: "number", value });

      // And we continue on.
      continue;
    }

    // We'll also add support for strings in our language which will be any
    // text surrounded by double quotes (").
    //
    //   (concat "foo" "bar")
    //            ^^^   ^^^ string tokens
    //
    // We'll start by checking for the opening quote:
    if (char === '"') {
      // Keep a `value` variable for building up our string token.
      let value = "";

      // We'll skip the opening double quote in our token.
      char = input[++current];

      // Then we'll iterate through each character until we reach another
      // double quote.
      while (char !== '"') {
        value += char;
        char = input[++current];
      }

      // Skip the closing double quote.
      char = input[++current];

      // And add our `string` token to the `tokens` array.
      tokens.push({ type: "string", value });

      continue;
    }

    // The last type of token will be a `name` token. This is a sequence of
    // letters instead of numbers, that are the names of functions in our lisp
    // syntax.
    //
    //   (add 2 4)
    //    ^^^
    //    Name token
    //
    // The name are not received from a specific enum, they can be any string
    const LETTERS = /[a-z]/i;
    if (LETTERS.test(char)) {
      let value = "";

      // Again we're just going to loop through all the letters pushing them to
      // a value.
      while (LETTERS.test(char)) {
        value += char;
        char = input[++current];
      }

      // And pushing that value as a token with the type `name` and continuing.
      tokens.push({ type: "name", value });

      continue;
    }

    // Finally if we have not matched a character by now, we're going to throw
    // an error and completely exit.
    throw new TypeError("I dont know what this character is: " + char);
  }

  // Then at the end of our `tokenizer` we simply return the tokens array.
  return tokens;
}

/*
 * ============================================================================
 *                                THE PARSER!!!
 * ============================================================================
 */

/*
 * For our parser we're going to take our array of tokens and turn it into an
 * AST.
 *
 *   [{ type: 'paren', value: '(' }, ...]   =>   { type: 'Program', body: [...] }
 */

// Okay, so we define a `parser` function that accepts our array of `tokens`.
/** Parser function, used  */
export function parser(tokens: Token[]): SimpleAST {
  // Again we keep a `current` variable that we will use as a cursor.
  let current = 0;

  // But this time we're going to use recursion instead of a `while` loop. So we
  // define a `walk` function.
  function walk(): ASTBodyNode {
    // Inside the walk function we start by grabbing the `current` token.
    let token = tokens[current];

    // We're going to split each type of token off into a different code path,
    // starting off with `number` tokens.
    //

    switch (token.type) {
      // We test to see if we have a `number` token.
      case "number":
        // We'll increment `current`.
        current++;

        // And we'll return a new AST node called `NumberLiteral` and setting its
        // value to the value of our token.
        return {
          type: "NumberLiteral",
          value: token.value
        };

      // If we have a string we will do the same as number and create a
      // `StringLiteral` node.
      case "string":
        current++;

        return {
          type: "StringLiteral",
          value: token.value
        };

      // Next we're going to look for CallExpressions.
      case "paren":
        //We start this off when we encounter an open parenthesis.
        if (token.value === "(") {
          // We'll increment `current` to skip the parenthesis since we don't care
          // about it in our AST.
          token = tokens[++current];

          // We create a base node with the type `CallExpression`, and we're going
          // to set the name as the current token's value since the next token after
          // the open parenthesis is the name of the function.
          const node: CallExpressionNode = {
            type: "CallExpression",
            name: token.value,
            params: []
          };

          // We increment `current` *again* to skip the name token.
          token = tokens[++current];

          // And now we want to loop through each token that will be the `params` of
          // our `CallExpression` until we encounter a closing parenthesis.
          //
          // Now this is where recursion comes in. Instead of trying to parse a
          // potentially infinitely nested set of nodes we're going to rely on
          // recursion to resolve things.
          //
          // To explain this, let's take our Lisp code. You can see that the
          // parameters of the `add` are a number and a nested `CallExpression` that
          // includes its own numbers.
          //
          //   (add 2 (subtract 4 2))
          //
          // You'll also notice that in our tokens array we have multiple closing
          // parenthesis.
          //
          //   [
          //     { type: 'paren',  value: '('        },
          //     { type: 'name',   value: 'add'      },
          //     { type: 'number', value: '2'        },
          //     { type: 'paren',  value: '('        },
          //     { type: 'name',   value: 'subtract' },
          //     { type: 'number', value: '4'        },
          //     { type: 'number', value: '2'        },
          //     { type: 'paren',  value: ')'        }, <<< Closing parenthesis
          //     { type: 'paren',  value: ')'        }, <<< Closing parenthesis
          //   ]
          //
          // We're going to rely on the nested `walk` function to increment our
          // `current` variable past any nested `CallExpression`.

          // So we create a `while` loop that will continue until it encounters a
          // token with a `type` of `'paren'` and a `value` of a closing
          // parenthesis.
          while (
            token.type !== "paren" ||
            (token.type === "paren" && token.value !== ")")
          ) {
            // we'll call the `walk` function which will return a `node` and we'll
            // push it into our `node.params`.
            node.params.push(walk());
            token = tokens[current];
          }

          // Finally we will increment `current` one last time to skip the closing
          // parenthesis.
          current++;

          // And return the node.
          return node;
        } else {
          throw new TypeError(
            "Closing parenthesis found without a matching opening parenthesis on token " +
              current
          );
        }

      default:
        throw new TypeError("Unknown token: " + token.value);
    }
  }

  // Now, we're going to create our AST which will have a root which is a
  // `Program` node.
  const ast: SimpleAST = {
    type: "Program",
    body: []
  };

  // And we're going to kickstart our `walk` function, pushing nodes to our
  // `ast.body` array.
  //
  // The reason we are doing this inside a loop is because our program can have
  // `CallExpression` after one another instead of being nested.
  //
  //   (add 2 2)
  //   (subtract 4 2)
  //
  while (current < tokens.length) {
    // fuck it.
    // TODO: Remove the type assertion to CallExpressionNode
    ast.body.push(walk() as CallExpressionNode);
  }

  // At the end of our parser we'll return the AST.
  return ast;
}

/*
  ============================================================================
                               THE TRANSFORMER!!!
  ============================================================================
 */

/*
  Next up, the transformer. Our transformer is going to take the AST that we
  have built and pass it to our traverser function with a visitor and will
  create a new ast.
 
  ----------------------------------------------------------------------------
    Original AST                     |   Transformed AST
  ----------------------------------------------------------------------------
    {                                |   {
      type: 'Program',               |     type: 'Program',
      body: [{                       |     body: [{
        type: 'CallExpression',      |       type: 'ExpressionStatement',
        name: 'add',                 |       expression: {
        params: [{                   |         type: 'CallExpression',
          type: 'NumberLiteral',     |         callee: {
          value: '2'                 |           type: 'Identifier',
        }, {                         |           name: 'add'
          type: 'CallExpression',    |         },
          name: 'subtract',          |         arguments: [{
          params: [{                 |           type: 'NumberLiteral',
            type: 'NumberLiteral',   |           value: '2'
            value: '4'               |         }, {
          }, {                       |           type: 'CallExpression',
            type: 'NumberLiteral',   |           callee: {
            value: '2'               |             type: 'Identifier',
          }]                         |             name: 'subtract'
        }]                           |           },
      }]                             |           arguments: [{
    }                                |             type: 'NumberLiteral',
                                     |             value: '4'
  ---------------------------------- |           }, {
                                     |             type: 'NumberLiteral',
                                     |             value: '2'
                                     |           }]
   (sorry the other one is longer.)  |         }
                                     |       }
                                     |     }]
                                     |   }
  ----------------------------------------------------------------------------
 */

/*
  Differences between the old and the new AST:
    1. Program:
      a. Every line in the body property is an ExpressionStatement node instead of a CallExpression node
        - Expression Nodes represent a line
    2. CallExpression
      a. New 'callee' property contains an Identifier node, which just identifies/gives a name to a variable
        - This replaces the 'name' property
      b. 'arguments' property repalces the 'params' array, serves the same purpose
        - This seems unnecessary, no? 
        - Isnt 'arguments' the correct nomeclature, anyway?
    3. NumberLiteral
      a. Unchanged
    4. StringLiteral
      a. Unchanges
    5. ExpressionStatement (new)
      a. Represent a line of our program. 
      b. A Program can have many Expressions.
      c. An Expression can (maybe?) have many CallExpressions
*/

/** Transformer function, as per https://the-super-tiny-compiler.glitch.me/transformer */
export function transformer(ast: SimpleAST): TransformedAST {
  function processNode(node: ASTBodyNode): TransformedArgumentNode {
    switch (node.type) {
      case "CallExpression":
        return {
          type: "CallExpression",
          arguments: node.params.map(child => processNode(child)),
          callee: { type: "Identifier", name: node.name }
        };
      case "NumberLiteral":
      case "StringLiteral":
        return node;
    }
  }

  /** Isolate transformer that handles top level call expresions, which get turned into expression statements */
  function processExpressionNode(
    node: CallExpressionNode
  ): ExpressionStatementNode {
    return {
      type: "ExpressionStatement",
      expression: {
        type: "CallExpression",
        callee: { type: "Identifier", name: node.name },
        arguments: node.params.map(childNode => processNode(childNode))
      }
    };
  }

  const newAST: TransformedAST = {
    type: "Program",
    body: ast.body.map(bodyNode => processExpressionNode(bodyNode))
  };

  return newAST;
}

/*
 * ============================================================================
 *                            THE CODE GENERATOR!!!!
 * ============================================================================
 */

/*
 * Now let's move onto our last phase: The Code Generator.
 *
 * Our code generator is going to recursively call itself to print each node in
 * the tree into one giant string.
 */
export function codeGenerator(node: TransformedASTNode): string {
  // We'll break things down by the `type` of the `node`.
  switch (node.type) {
    // If we have a `Program` node. We will map through each node in the `body`
    // and run them through the code generator and join them with a newline.
    case "Program":
      return node.body.map(codeGenerator).join("\n");

    // For `ExpressionStatement` we'll call the code generator on the nested
    // expression and we'll add a semicolon...
    case "ExpressionStatement":
      return (
        codeGenerator(node.expression) + ";" // << (...because we like to code the *correct* way)
      );

    // For `CallExpression` we will print the `callee`, add an open
    // parenthesis, we'll map through each node in the `arguments` array and run
    // them through the code generator, joining them with a comma, and then
    // we'll add a closing parenthesis.
    case "CallExpression":
      return (
        codeGenerator(node.callee) +
        "(" +
        node.arguments.map(codeGenerator).join(", ") +
        ")"
      );

    // For `Identifier` we'll just return the `node`'s name.
    case "Identifier":
      return node.name;

    // For `NumberLiteral` we'll just return the `node`'s value.
    case "NumberLiteral":
      return node.value;

    // For `StringLiteral` we'll add quotations around the `node`'s value.
    case "StringLiteral":
      return '"' + node.value + '"';

    // And if we haven't recognized the node, we'll throw an error.
    default:
      throw new TypeError(`Node seems to have unknown type: ${node}`);
  }
}

/*
 * ============================================================================
 *                         !!!!!!!!THE COMPILER!!!!!!!!
 * ============================================================================
 */

/*
 * FINALLY! We'll create our `compiler` function. Here we will link together
 * every part of the pipeline.
 *
 *   1. input  => tokenizer   => tokens
 *   2. tokens => parser      => ast
 *   3. ast    => transformer => newAst (also called 'Transformed AST')
 *   4. newAst => generator   => output
 */

export function compiler(input: string) {
  const tokens = tokenizer(input);
  const ast = parser(tokens);
  const newAst = transformer(ast);
  const output = codeGenerator(newAst);

  // and simply return the output!
  return output;
}

/*
 * ============================================================================
 * !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!YOU MADE IT!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
 * ============================================================================
 */

// Everything is exported via ES6 modules
// Now I'm just exporting everything in their own lines...
// module.export = {
//   tokenizer,
//   parser,
//   traverser,
//   transformer,
//   codeGenerator,
//   compiler
// };
