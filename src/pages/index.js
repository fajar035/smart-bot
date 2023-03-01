import Head from "next/head";
import { useState } from "react";
import styles from "@/styles/Home.module.css";

export default function Home() {
  const [animalInput, setAnimalInput] = useState("");
  const [result, setResult] = useState();

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/openAi", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ animal: animalInput }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }
      setResult(data.result);
      setAnimalInput("");
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div>
      <Head>
        <title>Aku robot</title>
        <link rel="icon" href="/robot.png" />
      </Head>

      <main className={styles.main}>
        <h3 className={styles.title}>Tanyakan apapun kepada ku. Aku sangat pintar, semoga kamu bisa seperti aku ya 🤖</h3>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="animal"
            placeholder="Tanyakan apapun .."
            value={animalInput}
            onChange={(e) => setAnimalInput(e.target.value)}
          />
          <input type="submit" value="Tanya" />
        </form>
        <div >{result}</div>
      </main>
    </div>
  );
}
