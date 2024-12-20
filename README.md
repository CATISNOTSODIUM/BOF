# 🧠 BOF - Brainf_ck with macros ✨
While brainf_ck is notoriously known for its minimalistic and impractical, BOF makes programming language in brainf_ck slightly more forgiving with macros and variables.

## Quick start
You can try our beloved BOF in our playground <a href="https://bof-blush.vercel.app/">here</a>.
Before start exploring BOF, we recommend you to learn the basic syntax of [<u>Brainf_ck</u>](https://en.wikipedia.org/wiki/Brainf_ck).
Here are some quick examples.
```
++++--. // output 2 memory [2]
++++-->. // output 0 memory [2 | 0]
++++-->.++. // output 0, 2 memory [2 | 2]
+++[>+<-]>. // output 3 memory [0 | 3]
```
Taking user input can be a little bit tricky, so we decided not to include the character `,` (receive user input) from the Brainf_ck. Therefore, only seven characters are included in the original language.

---
## Variables
Normally, transfering value `n` from the current block to the next block requires `O(n)` steps. 
However, variable assignments ease the process of transfering data from one place to another place. Here is a quick example.

```
++++ // memory [4]
x=.; > // memory [4 | 0], x = 4
x; // memory [4 | 4]
```

By assigning value to the dummy variable, move one step, and replace the original value with the dummary variable, we can transfer the data in `O(1)` step. Although having variable assignment ruins the esoterism of Brainf_ck, but who cares? 

Here is another example. 

```
x = ++.
>> x
+.
```
This code can be breakdown as follows.
- `x = ++.` assigns 2 to variable x.
- `>>x`  assigns x to the memory.
- `+.`  outputs 3.
---
## Macros
Macros abstracts the repeated instruction, making the code more readable.

Here is some quick example.
```
x $= ++++.> |  // add 4 to the current block, output its value and move to its consecutive block.
x x x // output 4, 4, 4 memory [ 4 | 4 | 4 | 0 ]
```

You can do bunch of cool things with macros.
```
mov $= [->+<]> | // allocate value from current block to the next one
+ mov mov mov // memory [ 0 | 0 | 0 | 1 ]
```
---

Note that macros is multi-lined by default. You have to use `|` to stop recording macros. Here is another example.

```
cpy $= x=.;>x| // copy the value from this block and transfer to another block.
+++; // set initial value to 3
cpy cpy cpy // memory [ 3 | 3 | 3 | 3 ]
```

We can also use macros to multiply two numbers.
```
// multiplying two numbers 
mul $= 
  tmp=>;<; // save temporary value
  [->tmp[->+<]<]
|
+++>++<mul
```
## Recursion

You can call macros to itself.

```
// recursion
n = +++;
f $= .[-f] |
f
```

---
# Predeclared macros

### `new`  
The macro `new` moves the pointer to the position with `0`.
`new` is defined as `new $= [>] |`. Here is a simple example.
```
+>+>+>+>+>+<<<<< // mem_pos: 6
new .            // output: 1, mem_pos: 0
``` 
---

# Predeclared functions

Here are some functions that have been predeclared. Note that unlike macros, these functions are primitive and cannot be rewritten.

### `chr`  
The function `chr` (primitive) reads the value from the current pointer and output the character based on ASCII code.
Now, we can print `hello` in `BOF`.

```
>++++++++[<+++++++++>-]< chr // h
>++++[<+++++++>-]<+ chr // e
+++++++ chr chr // l l
+++ chr // o
``` 