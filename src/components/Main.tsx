import Welcome from "../views/Welcome";
import styles from "./Main.module.css";

export default function Main() {
  return (
    <div className={`@container ${styles.main}`}>
      <Welcome></Welcome>
    </div>
  );
}
