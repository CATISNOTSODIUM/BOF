"use client"
import { ParseAndEvaluate } from "@/lib/mce";
import CodeMirror from "@uiw/react-codemirror";
import React from "react";
import {Result, ok, error, is_error} from "@/lib/types";
import Link from 'next/link'
export default function Home() {
  return (
    <div className="m-10 flex flex-col gap-2 max-h-screen items-center font-body">
      <div className="text-5xl font-bold font-code"> BOF </div>
      <div className="text-xl">
        🧠 Brainf*ck with macros ✨.
      </div>
      <div className="mb-4 w-2/3 text-gray-500">
        While brainf*ck is notoriously known for its minimalistic and impractical, BOF makes programming language in brainf*ck slightly more forgiving with macros and variables.
      You can read the following <Link href="/docs" className="text-purple-600"> documentation </Link> to get started.
      </div>
      <CodeBlock/>
    </div>
  );
}


function CodeBlock() {
  const [value, setValue] = React.useState("");
  const [status, setStatus] = React.useState<String>("");
  const [output, setOutput] = React.useState<String>("");
  const executeCode = (value: string) => {
      setStatus("");
      setOutput([]);
      const result = ParseAndEvaluate(value);
      if (is_error(result)) {
        setStatus(result.data);
      } else {
        setOutput(result.data.join("\n"));
        // Ascii output
        // setOutput(String.fromCharCode.apply(String, result.data))
      }
      return;
  }

  const executeCodeVisual = (value: string) => {
      setStatus("");
      setOutput([]);
      const result = ParseAndEvaluate(value, true);
      if (is_error(result)) {
        setStatus(result.data);
      } else {
        const output = result.data[0];
        const mem = result.data[1];
        const mem_pos = result.data[2];
        let display_mem = "";
        if (mem.length < 12) {
          display_mem = "| " + mem.join(" | ") + " |";
        } else {
          const mem_first = mem.slice(0, 4);
          const mem_second = mem.slice(mem.length - 4, mem.length - 1);
          display_mem = "| " + mem_first.join(" | ") + " ... " + mem_second.join(" | ") + " | ";
        }
        setOutput(`--- ${mem.length} blocks ---\nmem_pos: ${mem_pos}\n`+display_mem + "\n-----------------\n" + output.join("\n"));
        // Ascii output
        // setOutput(String.fromCharCode.apply(String, result.data))
      }
      return;
  }


  const keydownHandler = (e: any) => {
    if(e.key === 'Enter' && e.ctrlKey) executeCode(value);
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
          className=" bg-purple-300 hover:bg-purple-200 text-black px-10 py-3 h-full font-code font-bold"
          onClick={() => executeCode(value)}
      >
          EXECUTE  ▶
      </button>
      <button 
          className=" bg-purple-400 hover:bg-purple-300 text-black px-10 py-3 h-full font-code font-bold"
          onClick={() => executeCodeVisual(value)}
      >
          VISUALIZE   👁
      </button>
      <button 
          className=" bg-purple-500 hover:bg-purple-400  px-10 py-3 h-full font-code font-bold"
          onClick={() => setValue("")}
      >
          CLEAR   🗑️
      </button>
   </div>
    
    <div className="grid grid-cols-4  w-full h-full ">

        <CodeMirror
          defaultValue={"\n".repeat(10)}
          value={value}
          className="font-code text-xl h-96 col-span-2 bg-white p-1 overflow-y-scroll"
          onChange={setValue}
        />
        
        <div className="px-5 py-3 font-code bg-black text-white h-96 max-w-full col-span-2 overflow-y-scroll overflow-x-hidden text-xl text-wrap">
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
