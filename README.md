# 🧠 BOF - Brainf_ck with macros ✨
While brainf_ck is notoriously known for its minimalistic and impractical, BOF makes programming language in brainf_ck slightly more forgiving with macros and variables.

## Quick start
You can try our beloved BOF in our playground <u>here</u>.
Before start exploring BOF, we recommend you to learn the basic syntax of [<u>Brainfuck</u>](https://en.wikipedia.org/wiki/Brainfuck).
Here are some quick examples.
- `++++--.` // output 2 memory [2]
- `++++-->.` // output 0 memory [2 | 0]
- `++++-->.++.` // output 0, 2 memory [2 | 2]
- `+++[>+<-]>.` // output 3 memory [0 | 3]

Taking user input can be a little bit tricky, so we decided not to include the character `,` (receive user input) from the Brainfuck. Therefore, only seven characters are included in the original language.

---
## Variables
Normally, transfering value `n` from the current block to the next block requires `O(n)` steps. 
However, variable assignments ease the process of transfering data from one place to another place. Here is a quick example.


- `++++` // memory [4]
- `x=.; >` // memory [4 | 0], x = 4
- `x;` // memory [4 | 4]

By assigning value to the dummy variable, move one step, and replace the original value with the dummary variable, we can transfer the data in `O(1)` step. Although having variable assignment ruins the esoterism of Brainfuck, but who cares? 

Here is another example. 

```
x = ++.
>> x
+.
```
This code can be breakdown as follows.
- `x = ++.` // assign 2 to variable x
- `>>x` // assign x to the memory
- `+.` // output 3
---
## Macros
Macros abstracts the repeated instruction, making the code more readable.

Here is some quick example.

- `x $= ++++.> |`  // add 4 to the current block, output its value and move to its consecutive block.
-  `x x x` // output 4, 4, 4 memory [ 4 | 4 | 4 | 0 ]

You can do bunch of cool things with macros.

- `mov $= [->+<]> |` // allocate value from current block to the next one
- `+ mov mov mov` // memory [ 0 | 0 | 0 | 1 ]

---

Note that macros is multi-lined by default. You have to use `|` to stop recording macros. Here is another example.

- `cpy $= x=.;>x|` // copy the value from this block and transfer to another block.
- `+++;` // set initial value to 3
- `cpy cpy cpy` // memory [ 3 | 3 | 3 | 3 ]


We can also use macros to multiply two numbers.
```
// multiplying two numbers 
mul $= 
  tmp=>;<; // save temporary value
  [->tmp[->+<]<]
|
+++>++<mul
```
## Predeclared macros

Here are some macros that have been predeclared. 

### `new` 

The macro `new` moves the pointer to the position with `0`.
`new` is defined as `new $= [>] |`.

---