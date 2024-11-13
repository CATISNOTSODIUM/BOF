"use client"
import { ParseAndEvaluate } from "@/lib/mce";
import {Textarea} from "@nextui-org/react";
import React from "react";
import {Result, ok, error, is_error} from "@/lib/types";

export default function Home() {
  return (
    <div className="m-10 flex flex-col gap-2 min-h-screen items-center justify-center font-body">
      <div className="text-4xl font-bold font-code"> ✨BRAINSCRIPT (BS) </div>
      <div className="text-gray-400 text-xl h-full">
        Brainf*ck with states and functions ✨.
      </div>
      <CodeBlock/>
    </div>
  );
}


function CodeBlock() {
  const [value, setValue] = React.useState("");
  const [status, setStatus] = React.useState<String>("");
  const [output, setOutput] = React.useState<String>("");
    return (
    <>
    <button 
        className="rounded-full bg-black text-white px-10 py-3 hover:bg-gray-800"
        onClick={ () => {
          setStatus("");
          setOutput([]);
          const result = ParseAndEvaluate(value);
          if (is_error(result)) {
            setStatus(result.data);
          } else {
            setOutput(result.data.join("\n"));
          }
          return;
        }}
    >
        ▶   RUN
    </button>
    <div className="grid grid-cols-5  w-full h-full">
        <Textarea
          variant="faded"
          placeholder="Your code here ..."
          value={value}
          onValueChange={setValue}
          minRows={200}
          classNames={{
            base: "font-code min-h-96 col-span-3 resize-none bg-red-200",
            input: "px-5 py-3 h-96 bg-gray-200 text-gray-400 focus:text-black",
          }}
        />
        <div className="px-5 py-3 font-code bg-black text-white h-96 w-full col-span-2 overflow-y-scroll">
          BRAINSCRIPT v0.01 
          Written by CATISNOTSODIUM
          {
            (status !== "") && 
            <div className="text-red-700">
              ⓘ {status}
            </div>
          }
          <div className="whitespace-pre-wrap">{output}</div>
        </div>
        
    </div>

    </>
  );
}
