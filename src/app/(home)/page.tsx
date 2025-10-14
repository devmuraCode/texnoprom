import { HomePage } from "./HomePage";

export default function Home() {
  return (
    <div>
      <HomePage tweet={{ text: "Hello World", author: "John Doe" }} />
    </div>
  );
}
