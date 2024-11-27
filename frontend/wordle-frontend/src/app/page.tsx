"use client";
import Image from "next/image";
import GuessAreaComponent from "@/components/GuessArea/guessAreaComponent";


export default function Home() {


  return (
    <div className="flex flex-col justify-center items-center overflow-auto mb-10">
      <div className="text-center">
        <h1 className="text-4xl font-bold">Welcome to Wordle</h1>
        <p className="text-lg">The game where you guess the word</p>
      </div>
      <GuessAreaComponent lengthOfWord={5}/>
    </div>
  );
}
