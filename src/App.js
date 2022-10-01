import "./App.css";
import DiaryEditor from "./DiaryEditor";
import DiaryList from "./DiaryList";

function App() {
  return (
    <div className="App">
      <DiaryEditor />
      <DiaryList diaryList={[]} />
    </div>
  );
}

export default App;
