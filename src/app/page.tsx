"use client"
import { ParseAndEvaluate } from "@/lib/mce";
import CodeMirror from "@uiw/react-codemirror";
import React from "react";
import {Result, ok, error, is_error, Env, EnvFrame} from "@/lib/types";
import Link from 'next/link'
import { Kbd } from "@nextui-org/react";
export default function Home() {
  return (
    <div className="m-10 flex flex-col gap-2 max-h-screen items-center font-body">
      <div className="text-5xl font-bold font-code"> BOF </div>
      <div className="text-xl">
        🧠 Brainf*ck with macros ✨.
      </div>
      <div className="mb-4 w-full lg:w-2/3 text-gray-500">
        While brainf*ck is notoriously known for its minimalistic and impractical, BOF makes programming language in brainf*ck slightly more forgiving with macros and variables.
      You can read the following <Link href="/docs" className="text-purple-600"> documentation </Link> to get started.
      </div>
      <CodeBlock/>
      <div className="mb-4 w-full text-gray-500">
        <div>Press <Kbd keys={[]}>Ctrl + Enter</Kbd> to execute the code.</div>
        <div>Press <Kbd keys={[]}>Ctrl + Shift + Enter</Kbd> to execute the code in visual mode.</div>
      </div>
    </div>
  );
}


function CodeBlock() {
  const [value, setValue] = React.useState("");
  const [status, setStatus] = React.useState<string>("");
  const [output, setOutput] = React.useState<string>("");
  const executeCode = (value: string) => {
      setStatus("");
      setOutput("");
      let result = ParseAndEvaluate(value);
      if (is_error(result)) {
        setStatus(result.data as string);
      } else {
        setOutput((result.data as any[]).join("\n"));
        // Ascii output
        // setOutput(String.fromCharCode.apply(String, result.data))
      }
      return;
  }

  const executeCodeVisual = (value: string) => {
      setStatus("");
      setOutput("");
      const result = ParseAndEvaluate(value, true);
      if (is_error(result)) {
        setStatus(result.data as string);
      } else {
        const output: any[] = result.data[0] as any[];
        const mem: any[] = result.data[1] as any[];
        const env: Env = result.data[2] as Env;
        const mem_pos = result.data[3];
        let display_mem = "";
        if (mem.length < 20) {
          display_mem = "| " + mem.join(" | ") + " |";
        } else {
          const mem_first: any[] = mem.slice(0, 14);
          const mem_second: any[] = mem.slice(mem.length - 14, mem.length - 1);
          display_mem = "| " + mem_first.join(" | ") + " <...truncated...> " + mem_second.join(" | ") + " | ";
        }
        const display_memory = `\nMEMORY\n${mem.length} blocks\nmem_pos: ${mem_pos}\n`+display_mem + "\n";
        function env_stingify(env: Env | EnvFrame | null): string {
          if (env === null) {
            return "<null>";
          } else {
            env = env as [EnvFrame, Env];
            let result_string = "";
            for (let i = 0; i < env[0].names.length; i = i + 1) {
              result_string += env[0].names[i] + ": " + (typeof(env[0].values[i]) === "number" ? env[0].values[i] : "<obj>") + "\n";
            }
            return result_string + "---\n" + env_stingify(env[1]) + "\n---\n";
          }
        }
        const display_env = "\nENVIORNMENT\n" + env_stingify(env) + "\n\n";
        const display_output = "OUTPUT\n" + output.join("\n") + "\n-----"; 
        setOutput(display_output + display_memory + display_env );
        // Ascii output
        // setOutput(String.fromCharCode.apply(String, result.data))
      }
      return;
  }


  const keydownHandler = (e: any) => {
    if(e.key === 'Enter' && e.ctrlKey) executeCode(value);
    if(e.key === 'Enter' && e.ctrlKey && e.shiftKey) executeCodeVisual(value);
  };
  React.useEffect(() => {
    document.addEventListener('keydown', keydownHandler);
    return () => {
      document.removeEventListener('keydown', keydownHandler);
    }
  }, [value]);
  
    return (
    <div className="flex-grow w-full">
    <div className="h-fit w-full bg-gradient-to-r from-violet-200 to-pink-200">
      <button 
          className=" bg-purple-300 hover:bg-purple-200 text-black px-5 py-3 h-full font-code font-bold"
          onClick={() => executeCode(value)}
      >
          RUN ▶
      </button>
      <button 
          className=" bg-purple-400 hover:bg-purple-300 text-black px-5 py-3 h-full font-code font-bold"
          onClick={() => executeCodeVisual(value)}
      >
          👁
      </button>
   </div>
    
    <div className="grid grid-cols-4  w-full h-full ">

        <CodeMirror
          defaultValue={"\n".repeat(10)}
          value={value}
          className="font-code text-base lg:text-xl h-96 col-span-2 bg-gray-200 p-1 overflow-y-scroll"
          onChange={setValue}
        />
        
        <div className="px-5 py-3 font-code bg-black text-gray-100 h-96 max-w-full col-span-2 overflow-y-scroll overflow-x-hidden text-base lg:text-xl text-wrap">
          BOF v0.01 
          written by CATISNOTSODIUM
          {
            (status !== "") && 
            <div className="text-red-400">
              {status}
            </div>
          }
          <div className="whitespace-pre-wrap">{output}</div>
        </div>
        
    </div>

    </div>
  );
}
