"use client";
import Image from "next/image";
import GuessAreaComponent from "@/components/GuessArea/guessAreaComponent";


export default function Home() {


  return (
    <div className="flex flex-col justify-center items-center overflow-auto mb-10">
      <div className="text-center">
        <h1 className="text-4xl font-bold">Välkommen till Ordel Cheater! :D</h1>
        <p className="text-lg">Spelet där du faktiskt försöker vinna, varje gång...</p>
      </div>
      <GuessAreaComponent lengthOfWord={5}/>
    </div>
  );
}
